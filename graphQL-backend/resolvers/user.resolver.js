

const userResolver = {
    Query: {
        // 1. fetch authenticated user details
        authUser: async (_, __, context) => {
            try {
                const user = await context.user;
                return user;

            } catch (error) {
                console.log(`Internal server error: authUser Failed:: ${error}`)
                throw new Error("Failed to authenticate user");
            }
        },

        // 2. fetch user by ID


        // 3. fetch all users
        users: async () => {
            try {
                // const users = await User.find({});
                // return users;
            } catch (error) {
                console.log(`Internal server error: users Failed:: ${error}`)
                throw new Error("Failed to fetch users");
            }
        },
    },
    Mutation: {},
}

export default userResolver;