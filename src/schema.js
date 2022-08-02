const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getUserByRole(role: Role!): [User]!
    }
    type Mutation {
        createUser(userInput: UserInput!): CreateUserResponse!
    }
    type CreateUserResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User
    }
    interface User {
        id: ID!
        name: String
        username: String!
        password: String!
    }
    type Customer implements User {
        id: ID!
        name: String
        username: String!
        password: String!
    }
    type Admin implements User {
        id: ID!
        name: String
        username: String!
        password: String!
    }
    type Driver implements User {
        id: ID!
        name: String
        username: String!
        password: String!
        isActive: Boolean!
    }
    input UserInput {
        name: String
        username: String!
        password: String!
        role: Role!
    }
    enum Role {
        DRIVER
        CUSTOMER
        ADMIN
    }
`;

module.exports = typeDefs;
