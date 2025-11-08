import { gql } from "@apollo/client";


export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser { 
    authUser { # The name of the query we defined on the server
        _id
        username
        name
        profilePicture
    }
  } `

export const GET_USER_AND_TRANSACTIONS = gql`
  query GetUserAndTransactions($userId: ID!) { 
    user(userId: $userId) {
        _id
        username
        name
        profilePicture
        # Relationships
        transactions {
            _id
            description
            amount
            paymentType
            category
            location
            date
        }
    }}`