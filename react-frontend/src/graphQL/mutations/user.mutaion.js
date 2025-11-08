import { gql } from "@apollo/client";


export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      # Fields of User type we want to get back after signing up
      _id
      username
      name
      gender
    }
  }
`;


export const LOGIN_USER = gql`
    mutation LoginUser($loginInput: LoginInput!) {
        login(input: $loginInput) {
            _id
            username 
            name
        }
    }
`;


export const LOGOUT_USER = gql`
    mutation LogoutUser {
        logout {
            message
        }
    }   
`