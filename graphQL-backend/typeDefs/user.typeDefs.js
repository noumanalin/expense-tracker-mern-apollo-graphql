export const userTypeDefs = `#graphql

  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
    transactions: [Transaction!]
  }

  input SignUpInput {
    username: String!
    name: String!
    password: String!
    gender: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type LogoutResponse {
    message: String!
  }

  
  type Query {
    authUser: User
    user(userId:ID!): User
    users: [User!]
  }

  type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
  }
  
`;


// ! = Non-nullable field, Required field

// type Query is reserved keyword in GraphQL for defining read operations
// type Mutation is reserved keyword in GraphQL for defining write operations

// Query and Mutation both are entry points for client to interact with the GraphQL server.
// in Query and Mutation, we define fields the client can query or mutate along with their arguments and return types
// in Query and Mutation, we define the operations that can be performed on the User type in resolvers.
