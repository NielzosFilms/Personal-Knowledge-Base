const {gql} = require("apollo-server-express");

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
        folder: Folder!
        user: User
        createdAt: Date!
        updatedAt: Date!
    }

    type Folder {
        id: Int!
        ancestry: String!
        name: String!
        notes: [Note]
        subFolders: [Folder]
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
        notes(search: String): [Note]
        noteById(id: Int!): Note
        noteWithIds(ids: [Int]!): [Note]

        folders(ancestry: String): [Folder]
        folderByIdOrRoot(id: Int): Folder
    }

    type Mutation {
        createNote(filename: String!, content: String): Note
        updateNote(id: Int!, filename: String, content: String): Note
        deleteNote(id: Int!): Boolean
    }
`);

module.exports = typeDefs;
