//Modules and dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("./config/db");
const User = require("./models/User");
const { isLoggedIn, isAdmin } = require("./middleware/middlewares");
require("dotenv").config();

// Routers
const briefingsRouter = require("./routers/briefingsRouter");
const questionRouter = require("./routers/questions");
const quizRouter = require("./routers/quiz");
const categoryRouter = require("./routers/categoryRouter");
const notesRouter = require("./routers/notes");

//Express App Set Up
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

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    if (user.status !== "approved") {
      return res.status(403).send("Your account is not approved yet.");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  User.register(
    new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      employeeNumber: req.body.employeeNumber,
      username: req.body.username,
      status: "pending",
      iaAdmin: false,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      }
      res.redirect("/awaiting-approval");
    }
  );
});

app.get("/awaiting-approval", (req, res) => {
  res.render("./awaiting-approval");
});

app.get(
  "/admin/users-awaiting-approval",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const users = await User.find({ status: "pending" });
      res.render("admin/users-awaiting-approval", { users });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching users");
    }
  }
);

app.post(
  "/admin/approve-user/:userId",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.userId, { status: "approved" });
      res.redirect("/admin/users-awaiting-approval");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating user status");
    }
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    }
    res.redirect("/");
  });
});

// Routers
app.use(briefingsRouter);
app.use(questionRouter);
app.use(quizRouter);
app.use(categoryRouter);
app.use(notesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
