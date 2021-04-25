const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    type User {
        id: Int!
        name: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        hello: String
        users: [User]
    }
`);

module.exports = typeDefs;
