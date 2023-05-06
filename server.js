// Modules and dependencies
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("./config/db");
const User = require("./models/User");
const { isLoggedIn, isAdmin } = require("./middleware/middlewares");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Routers
const mainRoutes = require("./routers/main");
const briefingsRouter = require("./routers/briefingsRouter");
const questionRouter = require("./routers/questionsRouter");
const quizRouter = require("./routers/quizRouter");
const categoryRouter = require("./routers/categoryRouter");
const notesRouter = require("./routers/notesRouter");
const registerRouters = require("./routers/registerRouters");
const authRoutes = require("./routers/auth");
const adminRoutes = require("./routers/admin");
const logoutRoutes = require("./routers/logout");
const flowsRoutes = require("./routers/flows");
const fuelRoutes = require("./routers/fuelRouter");
const questionRatingRouter = require("./routers/questionRatingRouter");

// Express app setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make user accessible in views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(expressLayouts);

// Routers
app.use(mainRoutes);
app.use(adminRoutes);
app.use(briefingsRouter);
app.use(questionRouter);
app.use(quizRouter);
app.use(categoryRouter);
app.use(notesRouter);
app.use(registerRouters);
app.use(authRoutes);
app.use(logoutRoutes);
app.use(flowsRoutes);
app.use(questionRatingRouter);
app.use(fuelRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
