const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("./config/db");
const questionRouter = require("./routers/questions");
const quizRouter = require("./routers/quiz");
const categoryRouter = require("./routers/categoryRouter");
const notesRouter = require("./routers/notes");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
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

// Routers
app.use(questionRouter);
app.use(quizRouter);
app.use(categoryRouter);
app.use(notesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
