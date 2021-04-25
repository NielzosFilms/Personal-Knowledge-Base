const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// const { Sequelize } = require("sequelize");

const sequelize = require(path.join(__dirname, "../models/index"));

app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(process.env.PORT || 8080);
console.log(`Listening on port ${process.env.PORT || 8080}`);

// async function verifyDatabaseConnection(sequelize) {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }
