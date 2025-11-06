import mongoose from "mongoose";

export const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI, { dbName: "mern-graphQL-expense-tracker" });

        console.log(`✔ Mongo db connected successfully. 🚀 `)
    } catch (error) {
        console.log(`❌ Mongoose Connection Error: ${error.message || error}`);
        process.exit(1)
    }
}