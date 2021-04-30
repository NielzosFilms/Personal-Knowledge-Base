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
        if (process.env.DISABLE_AUTHENTICATION === "1") {
            return {
                models: sequelize,
                loggedIn: true,
                user: {
                    id: 1,
                    name: "admin",
                },
                token: null,
            };
        }
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
                return { models: sequelize, loggedIn: true, user, token };
            }
        }
        return { models: sequelize, loggedIn: false, user: null, token: null };
    },
});

const corsOptions = {
    origin: `http://${process.env.HOST || "localhost"}:${
        process.env.SERVER_PORT || "8080"
    }`,
    credentials: true,
};

console.log(process.env.NODE_ENV);

server.applyMiddleware({
    app,
    path: "/graphql",
    ...(process.env.NODE_ENV === "production" && { cors: corsOptions }),
});

app.use(express.static(path.join(__dirname, "../build")));

// app.get("/ping", function (req, res) {
//     return res.send("pong");
// });

// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, "../build", "index.html"));
// });

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(process.env.SERVER_PORT || 8080);
console.log(`Listening on port ${process.env.SERVER_PORT || 8080}`);
