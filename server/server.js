const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const sequelize = require(path.join(__dirname, "../models/index"));

app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("/users", async function (req, res) {
  const users = await sequelize.User.findAll();
  res.type("json");
  return res.json(users);
});

app.listen(process.env.PORT || 8080);
console.log(`Listening on port ${process.env.PORT || 8080}`);
