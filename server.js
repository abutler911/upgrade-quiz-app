const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("./config/db");
const Question = require("./models/Question");
const bodyParser = require("body-parser");
require("dotenv").config();

// Set up static files
app.use(express.static("public"));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("From the slash page");
});

app.get("/questions/create", (req, res) => {
  res.render("questions/create");
});

app.post("/questions/create", (req, res) => {
  const { question, category, answer } = req.body;

  const newQuestion = new Question({
    question,
    category,
    answer,
  });

  newQuestion
    .save()
    .then(() => {
      res.redirect("/questions/create");
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
