const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    type User {
        id: Int!
        name: String!
        createdAt: String!
        updatedAt: String!
    }

    type LoginPayload {
        success: Boolean!
        token: String
    }

    type Query {
        hello: String
        login(username: String!, password: String!): LoginPayload
        isAuthenticated: Boolean
        getAuthenticatedUser: User
        logout: Boolean
        users: [User]
    }
`);

module.exports = typeDefs;
