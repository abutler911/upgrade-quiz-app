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
const { isLoggedIn, isAdmin } = require("./middleware/middlewares");
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

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   }),
//   (req, res) => {}
// );
// Update your '/login' POST route
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
      username: req.body.username,
    }),
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

app.get("/admin/pending-users", isAdmin, (req, res) => {
  User.find({ status: "pending" }, (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving pending users");
    }
    res.render("pendingUsers", { users });
  });
});

app.post("/admin/approve-user/:userId", isAdmin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { status: "approved" },
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error approving user");
      }
      res.redirect("/admin/pending-users");
    }
  );
});

app.post("/admin/reject-user/:userId", isAdmin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { status: "rejected" },
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error rejecting user");
      }
      res.redirect("/admin/pending-users");
    }
  );
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
