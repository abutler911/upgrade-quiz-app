const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Question = require("../models/Question");
const { capitalizeAndPunctuate } = require("../public/data/capitalizetext");

router.get("/questions/create", (req, res) => {
  res.render("questions/create", { categories: categories });
});

router.post("/questions/create", async (req, res) => {
  const { question, category, answer } = req.body;

  if (!question || !answer) {
    res
      .status(400)
      .json({ message: "Question and answer fields are required" });
    return;
  }
  const formattedQuestion = capitalizeAndPunctuate(question);
  const formattedAnswer = capitalizeAndPunctuate(answer);
  try {
    const categories = Array.isArray(category) ? category : [category];
    const newQuestion = new Question({
      question: formattedQuestion,
      category: categories,
      answer: formattedAnswer,
    });
    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating question" });
  }
});

// View all questions route
router.get("/view-questions", async (req, res) => {
  try {
    const questions = await Question.find();
    questions.sort((a, b) => a.category[0].localeCompare(b.category[0]));
    res.render("questions/view-questions", { questions });
  } catch (err) {
    console.log(err);
  }
});

//API route
router.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Edit and delete routes
router.get("/modify-questions", async (req, res) => {
  try {
    const questions = await Question.find();
    questions.sort((a, b) => a.category[0].localeCompare(b.category[0]));

    res.render("questions/modify-questions", { questions });
  } catch (err) {
    console.log(err);
  }
});

router.get("/modify-questions/:id/edit", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).send("Question not found");
    } else {
      res.render("questions/update", {
        question,
        categories,
        questionCategories: question.category,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/modify-questions/:id/edit", async (req, res) => {
  const { question, category, answer } = req.body;

  if (!question || !answer) {
    res
      .status(400)
      .json({ message: "Question and answer fields are required" });
    return;
  }

  try {
    let selectedCategories = category;
    if (!Array.isArray(category)) {
      selectedCategories = [category];
    }

    const updatedQuestion = {
      question,
      category: selectedCategories,
      answer,
    };

    await Question.findByIdAndUpdate(req.params.id, updatedQuestion, {
      new: true,
    });
    res.redirect("/modify-questions");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/modify-questions/:id/delete", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/modify-questions");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
