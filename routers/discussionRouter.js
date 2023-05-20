const express = require("express");
const router = express.Router();

const Discussion = require("../models/Discussion.js");
const { isLoggedIn } = require("../middleware/middlewares.js");
const winston = require("winston");

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

router.get("/discussions", isLoggedIn, async (req, res) => {
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
    logger.error("Error fetching discussions:", error);
    res.status(500).send("Error fetching discussions");
  }
});

router.post("/discussions", isLoggedIn, async (req, res) => {
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
    logger.error("Error creating discussion:", error);
    res.status(500).json({ message: "Error creating discussion" });
  }
});

router.post("/discussions/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (discussion.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).send("Unauthorized");
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.redirect("/discussions");
  } catch (error) {
    logger.error("Error deleting discussion:", error);
    res.status(500).send("Error deleting discussion");
  }
});

router.get("/discussions/:id", isLoggedIn, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("user")
      .populate("comments.user");
    res.render("discussions/discussion", {
      title: discussion.title,
      customCSS: "single-discussion.css",
      discussion,
      user: req.user,
    });
  } catch (error) {
    logger.error("Error fetching discussion:", error);
    res.status(500).send("Error fetching discussion");
  }
});

router.post("/discussions/:id/comments", isLoggedIn, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).send("Discussion not found");
    }

    const comment = {
      user: req.user._id,
      content: req.body.content,
    };
    discussion.comments.push(comment);

    await discussion.save();

    res.redirect(`/discussions/${req.params.id}`);
  } catch (error) {
    logger.error("Error adding comment:", error);
    res.status(500).send("Error adding comment");
  }
});

module.exports = router;
