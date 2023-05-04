const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Question = require("../models/Question");
const { capitalizeAndPunctuate } = require("../public/data/capitalizetext");

const { isLoggedIn } = require("../middleware/middlewares");

router.get("/quiz", isLoggedIn, async (req, res) => {
  try {
    const questions = await Question.find({});
    const currentQuestion = 0;
    res.render("quiz", {
      title: "QuizTime!",
      customCSS: "quiz.css",
      questions,
      currentQuestion,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving questions");
  }
});

module.exports = router;
