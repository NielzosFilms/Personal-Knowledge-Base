const {gql} = require("apollo-server-express");

const typeDefs = gql(`
    scalar Date

    type User {
        id: Int!
        name: String!
        email: String!
        admin: Boolean!
        userGroups: [UserGroup]
        createdAt: Date!
        updatedAt: Date!
    }

    type UserGroup {
        id: Int!
        name: String
        users: [User]
        groceryLists: [GroceryList]
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
        ancestryResolved: String
        name: String!
        notes: [Note]
        subFolders: [Folder]
        user: User
        createdAt: Date!
        updatedAt: Date!
    }

    type Grocery {
        id: Int!
        name: String!
        needed: Boolean!
        groceryList: GroceryList!
        createdAt: Date!
        updatedAt: Date!
    }

    type GroceryList {
        id: Int!
        name: String!
        userGroup: UserGroup
        groceries: [Grocery]
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
        userById(id: Int!, token: String): User

        userGroups: [UserGroup]
        userGroupById(id: Int!): UserGroup

        notes(search: String): [Note]
        noteById(id: Int!): Note
        noteWithIds(ids: [Int]!): [Note]

        folders(ancestry: String): [Folder]
        folderByIdOrRoot(id: Int): Folder
        folderByAncestry(ancestry: String!): Folder

        groceryListById(id: Int!): GroceryList
    }

    type Mutation {
        sendVerifyEmail(email: String!): Boolean
        sendChangePasswordEmail(email: String!): Boolean

        createUser(token: String!, name: String!, password: String!): User
        updateUser(id: Int!, name: String, email: String, admin: Boolean, password: String, token: String): User
        deleteUser(id: Int!): Boolean

        updateUserGroup(id: Int!, name: String!): UserGroup

        createNote(filename: String!, content: String, folderId: Int): Note
        updateNote(id: Int!, filename: String, content: String): Note
        deleteNote(id: Int!): Boolean

        createFolder(ancestry: String!, name: String!): Folder
        updateFolder(id: Int!, ancestry: String, name: String): Folder
        deleteFolder(id: Int!): Boolean

        createGroceryList(name: String!, user_group_id: Int!): GroceryList
        updateGroceryList(id: Int!, name: String!): GroceryList
        deleteGroceryList(id: Int!): Boolean

        createGrocery(grocery_list_id: Int!, name: String!, needed: Boolean): Grocery
        updateGrocery(id: Int!, name: String, needed: Boolean): Grocery
        deleteGrocery(id: Int!): Boolean
    }
`);

module.exports = typeDefs;
