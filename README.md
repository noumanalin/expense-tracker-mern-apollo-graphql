# Expense Tracker - MERN Stack with Apollo GraphQL
A production-ready full-stack Expense Tracker application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Apollo GraphQL. Features secure authentication, real-time transaction management, and comprehensive financial analytics.

## 🚀 Features
- 🔐 Secure Authentication - Passport.js with session-based auth
- 📊 Financial Analytics - Category-wise spending statistics
- 💳 Transaction Management - Create, read, update, delete transactions
- 👤 User Profiles - Personalized avatars and profile management
- 🛡️ Production Security - Helmet, rate limiting, CORS, and more
- ⚡ GraphQL API - Efficient data fetching with Apollo Server
- 📱 Responsive Design - Modern UI with Tailwind CSS

## 🏗️ Architecture
```
Frontend (React + Apollo Client)
          ↓
GraphQL API (Apollo Server + Express)
          ↓
Data Layer (MongoDB + Mongoose)
          ↓
Authentication (Passport.js + Sessions)
```

## 🔒 Security Breakdown
| Feature | Description | ✅ Status |
|---------|-------------|-----------|
| Helmet | Adds HTTP headers to prevent XSS, clickjacking, and other attacks | ✅ Enabled correctly |
| Rate Limiter | Protects from brute force & DDoS (100 requests/15 min per IP) | ✅ Good basic config |
| Session Security | httpOnly, secure, sameSite=lax, maxAge → all good session settings | ✅ Well done |
| Passport | Good for authenticated sessions, works with express-session | ✅ Properly integrated |
| CORS | Restricted to specific origin + allows credentials | ✅ Correct for client–server setup |
| Compression | Reduces payload size (performance) | ✅ OK (safe) |
| Error Sanitization | Hides internal stack traces in production | ✅ Excellent security practice |
| Trust Proxy | Needed for reverse proxies (e.g., Render, Nginx, Vercel, AWS) | ✅ Correct use |
| Introspection Disabled in Prod | Prevents schema leaks to outsiders | ✅ Excellent |
| .env Configuration | Used for secrets and environment-dependent logic | ✅ Correct practice |


## 🔧 Installation & Setup
### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## 1. Clone the Repository
```
git clone https://github.com/noumanalin/expense-tracker-mern-apollo-graphql.git
cd expense-tracker-mern-apollo-graphql
```
## 2. Backend Setup
```
cd backend
npm install
```
## 3. Environment Configuration
Create a .env file in the backend directory:
```
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://username:password@cluster-shard-00-00.n2s4x.mongodb.net:27017,cluster-shard-00-01.n2s4x.mongodb.net:27017,cluster-shard-00-02.n2s4x.mongodb.net:27017/?replicaSet=atlas-jnrzf0-shard-0&ssl=true&authSource=admin
SESSION_SECRET=your_secure_session_secret_here_min_32_chars
```

# 📡 GraphQL API
## User Operations
### Queries
```
# Get authenticated user
query {
  authUser {
    _id
    username
    name
    profilePicture
    gender
  }
}

# Get user by ID
query {
  user(userId: "user_id") {
    _id
    username
    name
  }
}

# Get all users
query {
  users {
    _id
    username
    name
  }
}
```
### Mutations
```
# Sign up
mutation {
  signUp(input: {
    username: "john_doe",
    name: "John Doe",
    password: "securepassword",
    gender: "male"
  }) {
    _id
    username
    name
  }
}

# Login
mutation {
  login(input: {
    username: "john_doe",
    password: "securepassword"
  }) {
    _id
    username
    name
  }
}

# Logout
mutation {
  logout {
    message
  }
}
```

## Transaction Operations
### Queries
```
# Get all transactions for authenticated user
query {
  transactions {
    _id
    description
    amount
    category
    date
    location
  }
}

# Get specific transaction
query {
  transaction(transactionId: "transaction_id") {
    _id
    description
    amount
    category
  }
}

# Get category statistics
query {
  categoryStatistics {
    category
    totalAmount
  }
}
```

### Mutations
```
# Create transaction
mutation {
  createTransaction(input: {
    description: "Groceries",
    paymentType: "card",
    category: "expense",
    amount: 150.50,
    date: "2024-01-15",
    location: "Supermarket"
  }) {
    _id
    description
    amount
  }
}

# Update transaction
mutation {
  updateTransaction(input: {
    transactionId: "transaction_id",
    description: "Updated Description",
    amount: 200.00
  }) {
    _id
    description
    amount
  }
}

# Delete transaction
mutation {
  deleteTransaction(transactionId: "transaction_id") {
    _id
    description
  }
}
```

## 📝 API Testing
Use the GraphQL Playground at http://localhost:4000/graphql to test queries and mutations. Include session cookies for authenticated endpoints.

## 🤝 Contributing
- Fork the repository
- Create a feature branch
- Commit your changes
- Push to the branch
- Create a Pull Request

## 📄 License
This project is licensed under the MIT License.


## Deployment
render.com => backend and frontend under the same domain


