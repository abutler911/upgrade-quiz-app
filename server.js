const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("./config/db");
// const mongoose = require("mongoose");

const Question = require("./models/Question");
const ejs = require("ejs");
require("dotenv").config();
const multer = require("multer");
const categories = require("./public/data/categories");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/briefings", (req, res) => {
  res.render("briefings");
});

// Add question routes
app.get("/questions/create", (req, res) => {
  res.render("questions/create", { categories: categories });
});

app.post("/questions/create", async (req, res) => {
  const { question, category, answer } = req.body;

  // Check that required fields are present in form data
  if (!question || !answer) {
    res
      .status(400)
      .json({ message: "Question and answer fields are required" });
    return;
  }

  try {
    // let categories = category;
    // if (Array.isArray(category)) {
    //   categories = category.join(", ");
    // }

    const categories = Array.isArray(category) ? category : [category];

    // const categories = Array.isArray(category) ? category : [category];
    const newQuestion = new Question({
      question,
      category: categories,
      answer,
    });
    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating question" });
  }
});

// View all questions route
app.get("/view-questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.render("questions/view-questions", { questions });
  } catch (err) {
    console.log(err);
  }
});

//API route
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Edit and delete routes
app.get("/modify-questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.render("questions/modify-questions", { questions });
  } catch (err) {
    console.log(err);
  }
});

app.get("/modify-questions/:id/edit", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).send("Question not found");
    } else {
      res.render("questions/update", {
        question,
        categories,
        questionCategories: question.category,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.post("/modify-questions/:id/edit", async (req, res) => {
  const { question, category, answer } = req.body;

  if (!question || !answer) {
    res
      .status(400)
      .json({ message: "Question and answer fields are required" });
    return;
  }

  try {
    let categories = category;
    if (Array.isArray(category)) {
      categories = category.join(", ");
    }

    const updatedQuestion = {
      question,
      category: categories,
      answer,
    };

    await Question.findByIdAndUpdate(req.params.id, updatedQuestion, {
      new: true,
    });
    res.redirect("/view-questions");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.post("/modify-questions/:id/delete", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/modify-questions");
  } catch (err) {
    console.log(err);
  }
});

// Quiz route
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
