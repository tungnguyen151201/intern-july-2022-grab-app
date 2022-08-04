const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    "User logged-in"
    me: User
  }
  type Mutation {
    signUp(userInput: UserInput!): SignUpResponse!
    login(username: String!, password: String!): LoginResponse!
    "If deactivate sets to true, it means you are deactivating user"
    activateDriver(username: String!, deactivate: Boolean!): ActivateDriverResponse!
  }
  type SignUpResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: User
  }
  type LoginResponse {
    code: Int!
    success: Boolean!
    message: String!
    token: String
    user: User
  }
  type ActivateDriverResponse {
    code: Int!
    success: Boolean!
    message: String!
    driver: Driver
  }
  interface User {
    id: ID!
    name: String
    username: String!
  }
  type Customer implements User {
    id: ID!
    name: String
    username: String!
  }
  type Admin implements User {
    id: ID!
    name: String
    username: String!
  }
  type Driver implements User {
    id: ID!
    name: String
    username: String!
    isActive: Boolean!
  }
  input UserInput {
    name: String
    username: String!
    password: String!
    role: Role!
  }
  enum Role {
    Driver
    Customer
    Admin
  }
`;

module.exports = typeDefs;
