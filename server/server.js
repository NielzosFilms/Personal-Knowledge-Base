const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const typeDefs = require(path.join(__dirname, "/schema"));
const resolvers = require(path.join(__dirname, "/resolvers"));

const sequelize = require(path.join(__dirname, "../models/index"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const session = await sequelize.Session.findOne({
      where: {
        token: token,
      },
    });

    if (session) {
      const user = await sequelize.User.findOne({
        where: {
          id: session.user_id,
        },
      });
      if (user) {
        return { models: sequelize, loggedIn: true, user };
      }
    }
    return { models: sequelize, loggedIn: false, user: null };
  },
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
