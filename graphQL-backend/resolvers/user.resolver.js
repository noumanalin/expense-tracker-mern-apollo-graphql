import bcrypt from "bcryptjs";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const userResolver = {
    Query: {
        // 1. fetch authenticated user details
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser(); // ✅ correct GraphQL Passport method
                return user;
            } catch (error) {
                console.log(`Internal server error: authUser Failed:: ${error}`);
                throw new Error("Failed to authenticate user");
            }
        },

        // 2. fetch user by ID
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.log(`Internal server error: user query Failed:: ${error}`);
                throw new Error("Failed to fetch user by ID");
            }
        },

        // 3. fetch all users
        users: async () => {
            try {
                const users = await User.find({});
                return users;
            } catch (error) {
                console.log(`Internal server error: users Failed:: ${error}`);
                throw new Error("Failed to fetch users");
            }
        },
    },

    Mutation: {
        // 1. Sign up user
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;

                if (!username || !name || !password || !gender) {
                    throw new Error(`${!username ? "Username" : !name ? "Name" : !password ? "Password" : !gender ? "Gender" : ""} is/are required field(s).`);
                }

                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error("User already exists");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // https://avatar-placeholder.iran.liara.run/
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`; // Generate a unique avatar URL based on username
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;

            } catch (err) {
                console.error("Error in signUp: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },

        // 2. Login user
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;

                if (!username || !password) {
                    throw new Error("All fields are required");
                }

                const { user } = await context.authenticate("graphql-local", { username, password });
                await context.login(user);
                return user;

            } catch (err) {
                console.error("Error in login:", err);
                throw new Error(err.message || "Internal server error");
            }
        },

        // 3. Logout user
        logout: async (_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy((err) => {
                    if (err) throw err;
                });
                context.res.clearCookie("connect.sid");
                return { message: "Logged out successfully" };
            } catch (err) {
                console.error("Error in logout:", err);
                throw new Error(err.message || "Internal server error");
            }
        },
    },

    // Resolve user transactions
    User: {
        transactions: async (parent) => {
            try {
                const transactions = await Transaction.find({ userId: parent._id });
                return transactions;
            } catch (err) {
                console.log("Error in user.transactions resolver: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
    },
};

export default userResolver;
