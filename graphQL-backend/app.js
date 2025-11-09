import { ApolloServer } from "@apollo/server";
// for integrating Apollo Server with Express & use custom middlewares like cors, helmet, cookie-parser, etc.
// And In Apollo Server v5, they completely removed the express4 integration from the main package.
import { expressMiddleware } from '@as-integrations/express5';
import express from "express";
import path from "path";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { buildContext } from "graphql-passport";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import ConnectMongoDBSession from "connect-mongodb-session";

import dotenv from "dotenv";
dotenv.config();

import { configurePassport } from "./config/passport.config.js";
await configurePassport();

const app = express();
const __dirname = path.resolve();

import compression from "compression";
app.use(compression()); // Shrinks response size for faster delivery


import { userTypeDefs } from "./typeDefs/user.typeDefs.js";
import { transactionTypeDef } from "./typeDefs/transaction.typeDefs.js";
import mergedResolvers from "./resolvers/index.js";
import { connectDB } from "./config/connectDB.js";


const httpServer = http.createServer(app); // Create HTTP server for handling requests (plugin needs it)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
});

// Session store setup 👇
const MongoDBStore = ConnectMongoDBSession(session);
// ✔ small library to saves your user sessions in a MongoDB collection instead of just keeping them in memory.
// ✔ By default, express-session stores all sessions in server memory (RAM). 
// ✔ But it has big problems in production like all users get logged out immediately when server restart. Memory fills up when many users are online.
// ✔ should use connect-mongodb-session if: You’re using express-session or deploy on AWS Lambda + MongoDB Atlas, Render, Railway, Vercel (API) etc.

const store = new MongoDBStore({
    uri: `${process.env.MONGO_URI}`,
    collection: "sessions",
});

store.on("connected", () => {
    console.log("✔ Session store connected to MongoDB");
});

store.on("error", (error) => {
    console.log("❌ Session store error:", error);
});

// 🔐 Session middleware (Passport needs it)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false, // if true, then we have multiple sessions of same user in db
        saveUninitialized: false,
        store: store, // ✅ store sessions in MongoDB
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,        // JS can’t read cookies → prevents XSS
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "lax",       // helps prevent CSRF 
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// ⚠️ Apply security middlewares
app.use(limiter);
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
}));
app.set('trust proxy', 1);
// If your app is hosted behind another server (like Nginx or Render), this makes Express correctly detect real user IPs and HTTPS connections.
// Without it, things like: 
// req.ip, secure cookies, HTTPS checks > might not work correctly.

// CORS and body-parser
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:5173"], credentials: true, }));
app.use(bodyParser.json());

// GraphQL setup
const server = new ApolloServer({
    typeDefs: [userTypeDefs, transactionTypeDef], // or use mergedTypeDefs
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // important for proper shutdown
    // Hide Stack Traces and Sensitive Errors in Production
    formatError: (err) => {
        if (process.env.NODE_ENV === 'production') {
            // Hide internal errors
            return new Error('Internal server error');
        }
        return err; // show full error in dev
    },
});

await server.start();

// By default, Apollo exposes its GraphQL playground (good for dev, bad for prod).
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }), // ✅ important line
    introspection: process.env.NODE_ENV !== 'production',
}));


// npm run build will build your frontend app, and it will the optimized version of your app
app.use(express.static(path.join(__dirname, "react-frontend/dist")));
// Serve React frontend for any other route (not /graphql)
app.use((req, res, next) => {
    if (req.path.startsWith("/graphql")) return next(); // skip GraphQL requests
    res.sendFile(path.join(__dirname, "react-frontend/dist/index.html"));
});



if (process.env.NODE_ENV === "production") {
    const startServer = async () => {
        await connectDB();
        console.log("Database connected");
    };

    startServer().catch(console.error);
} else {

    app.listen(4000, () => {
        console.log("🚀 Server ready at http://localhost:4000/graphql");
        connectDB();
    });
}

export default app; // for deployment on serverless platforms like Vercel, Netlify, etc.





// app.use(
//   "/graphql",
//   expressMiddleware(server, {
//     context: async ({ req }) => {
//       const token = req.headers.authorization || "";
//       return { token };
//     },
//   })
// );