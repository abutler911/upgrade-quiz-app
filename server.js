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

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Add Question page
app.get("/questions/create", (req, res) => {
  res.render("questions/create");
});

// Start Quiz page
app.get("/quiz", (req, res) => {
  res.render("quiz");
});

// Modify Question page
app.get("/questions/:id/edit", (req, res) => {
  const id = req.params.id;

  Question.findById(id)
    .then((question) => {
      res.render("questions/edit", { question });
    })
    .catch((err) => console.log(err));
});

// Submit modified question
app.post("/questions/:id/edit", (req, res) => {
  const id = req.params.id;
  const { question, category, answer } = req.body;

  Question.findByIdAndUpdate(
    id,
    {
      question,
      category,
      answer,
    },
    { new: true }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// Create new question
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
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
