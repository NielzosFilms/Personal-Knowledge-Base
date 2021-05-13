const {gql} = require("apollo-server-express");

const typeDefs = gql(`
    scalar Date

    type User {
        id: Int!
        name: String!
        email: String!
        admin: Boolean!
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

    type VerifyEmailTokenPayload {
        success: Boolean!
        email: String
    }

    type Query {
        login(username: String!, password: String!): LoginPayload
        isAuthenticated: Boolean
        getAuthenticatedUser: User
        logout: Boolean

        verifyEmailToken(token: String!): VerifyEmailTokenPayload

        users: [User]
        userById(id: Int!): User

        notes(search: String): [Note]
        noteById(id: Int!): Note
        noteWithIds(ids: [Int]!): [Note]

        folders(ancestry: String): [Folder]
        folderByIdOrRoot(id: Int): Folder
        folderByAncestry(ancestry: String!): Folder
    }

    type Mutation {
        sendVerifyEmail(email: String!): Boolean
        createUser(token: String!, name: String!, password: String!): User
        updateUser(id: Int!, name: String, email: String, admin: Boolean): User
        deleteUser(id: Int!): Boolean

        createNote(filename: String!, content: String, folderId: Int): Note
        updateNote(id: Int!, filename: String, content: String): Note
        deleteNote(id: Int!): Boolean

        createFolder(ancestry: String!, name: String!): Folder
        updateFolder(id: Int!, ancestry: String, name: String): Folder
        deleteFolder(id: Int!): Boolean
    }
`);

module.exports = typeDefs;
