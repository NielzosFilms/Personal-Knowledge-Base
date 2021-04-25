const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require(path.join(__dirname, "/schema"));
const resolvers = require(path.join(__dirname, "/resolvers"));

const sequelize = require(path.join(__dirname, "../models/index"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models: sequelize },
});
server.applyMiddleware({ app });

app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(process.env.SERVER_PORT || 8080);
console.log(`Listening on port ${process.env.SERVER_PORT || 8080}`);
