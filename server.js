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
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const { isLoggedIn } = require("./middleware/middlewares");
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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    }
    res.redirect("/");
  });
});

app.get("/briefings", isLoggedIn, (req, res) => {
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
