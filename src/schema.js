const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        me: User
    }
    type Mutation {
        signUp(userInput: UserInput!): MutationResponse!
        login(username: String!, password: String!): LoginResponse!
        "If deactivate sets to true, it means you are deactivating user"
        activateDriver(username: String!, deactivate: Boolean!): MutationResponse!
    }
    type MutationResponse {
        code: Int!
        success: Boolean!
        message: String!
    }
    type LoginResponse {
        code: Int!
        success: Boolean!
        message: String!
        token: String
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
        Driver
        Customer
        Admin
    }
`;

module.exports = typeDefs;
