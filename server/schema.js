const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    type User {
        id: Int!
        name: String!
        createdAt: String!
        updatedAt: String!
    }

    type Note {
        id: Int!
        filename: String!
        content: String!
        user: User
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
        notes: [Note]
    }
`);

module.exports = typeDefs;
