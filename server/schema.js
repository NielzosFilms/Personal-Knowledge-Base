const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    scalar Date

    type User {
        id: Int!
        name: String!
        createdAt: Date!
        updatedAt: Date!
    }

    type Note {
        id: Int!
        filename: String!
        content: String!
        user: User
        createdAt: Date!
        updatedAt: Date!
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
        noteById(id: Int!): Note
    }

    type Mutation {
        createNote(filename: String!, content: String): Note
        updateNote(id: Int!, filename: String, content: String): Note
    }
`);

module.exports = typeDefs;
