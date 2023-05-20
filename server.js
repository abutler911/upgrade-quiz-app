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
const Discussion = require("./models/Discussion");
const methodOverride = require("method-override");
const winston = require("winston");
const multer = require("multer");

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
const passwordResetRoutes = require("./routers/passwordReset");
const weatherRouter = require("./routers/weatherRouter");
const rvrRouter = require("./routers/rvrRouter");
const discussionRouter = require("./routers/discussionRouter");

// Express app setup
const app = express();
const port = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

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
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 43200000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
const upload = multer({ dest: "public/docs" });

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser((user, done) => {
  // console.log("Serializing user:", user);
  User.serializeUser()(user, done);
});

passport.deserializeUser((id, done) => {
  // console.log("Deserializing user ID:", id);
  User.deserializeUser()(id, done);
});
// Make user accessible in views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(expressLayouts);

app.get("/documents", isLoggedIn, (req, res) => {
  const documents = [{ name: "Systems Review", filename: "SystemsReview.pdf" }];
  res.render("documents", {
    documents,
    title: "Systems Review",
    customCSS: "documents.css",
  });
});

app.post("/upload", upload.single("document"), (req, res) => {
  const { name, document } = req.body;
  // Process the uploaded file (e.g., save it to a database, perform validation, etc.)

  res.redirect("/documents");
});

// Routers
app.use(mainRoutes);
app.use(adminRoutes);
app.use(briefingsRouter);
app.use(discussionRouter);
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
app.use(passwordResetRoutes);
app.use(rvrRouter);
app.use(weatherRouter);
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500);
  res.render("error", {
    title: "Error",
    customCSS: "error.css",
    error: err,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server up on localhost:${port}`);
});
