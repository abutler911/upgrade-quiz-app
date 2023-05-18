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
app.use(methodOverride("_method"));

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  User.serializeUser()(user, done);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user ID:", id);
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

app.get("/discussions", isLoggedIn, async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .sort("-createdAt")
      .populate("user");

    const recentDiscussions = await Discussion.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user");

    res.render("discussions/discussions", {
      title: "Discussions",
      customCSS: "discussions.css",
      discussions,
      recentDiscussions,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).send("Error fetching discussions");
  }
});

app.post("/discussions", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user._id;

  try {
    const newDiscussion = new Discussion({
      title,
      content,
      user: userId,
    });

    await newDiscussion.save();

    res.redirect("/discussions");
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Error creating discussion" });
  }
});

// app.delete("/discussions/:id", isLoggedIn, async (req, res) => {
//   try {
//     const discussion = await Discussion.findById(req.params.id);

//     if (discussion.user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).send("Unauthorized");
//     }

//     await Discussion.findByIdAndDelete(req.params.id);
//     res.redirect("/discussions");
//   } catch (error) {
//     console.error("Error deleting discussion:", error);
//     res.status(500).send("Error deleting discussion");
//   }
// });
app.post("/discussions/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (discussion.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).send("Unauthorized");
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.redirect("/discussions");
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).send("Error deleting discussion");
  }
});

app.get("/discussions/:id", isLoggedIn, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("user")
      .populate("comments.user");
    res.render("discussions/discussion", {
      title: discussion.title,
      customCSS: "discussion.css",
      discussion,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).send("Error fetching discussion");
  }
});

app.post("/discussions/:id/comments", isLoggedIn, async (req, res) => {
  try {
    // Get the discussion
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).send("Discussion not found");
    }

    // Add the comment to the discussion
    const comment = {
      user: req.user._id,
      content: req.body.content,
    };
    discussion.comments.push(comment);

    // Save the discussion
    await discussion.save();

    // Redirect back to the discussion page
    res.redirect(`/discussions/${req.params.id}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Error adding comment");
  }
});

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
app.use(passwordResetRoutes);
app.use(weatherRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
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
