const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Question = require("../models/Question");
const { capitalizeAndPunctuate } = require("../public/data/capitalizetext");

router.get("/quiz", async (req, res) => {
  try {
    const questions = await Question.find({});
    const currentQuestion = 0;
    res.render("quiz", { questions, currentQuestion, categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving questions");
  }
});

module.exports = router;