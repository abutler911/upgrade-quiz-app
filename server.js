const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./config/db");
const Question = require("./models/Question");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/questions/create", (req, res) => {
  res.render("questions/create");
});

app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.render("questions/questions", { questions });
  } catch (err) {
    console.log(err);
  }
});

app.get("/questions/:id/edit", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.render("questions/edit", { question });
  } catch (err) {
    console.log(err);
  }
});

app.post("/questions/:id/edit", async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/questions/create", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/questions/:id/delete", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/questions");
  } catch (err) {
    console.log(err);
  }
});

app.get("/quiz", async (req, res) => {
  try {
    const questions = await Question.find({});
    const currentQuestion = 0;
    res.render("quiz", { questions, currentQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving questions");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
