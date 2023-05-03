const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Question = require("../models/Question");
const { capitalizeAndPunctuate } = require("../public/data/capitalizetext");
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/questions/create", (req, res) => {
  res.render("questions/createQuestions", {
    title: "Create A Question",
    customCSS: "createQuestions.css",
    categories: categories,
  });
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
router.get("/view-questions", isLoggedIn, async (req, res) => {
  try {
    const questions = await Question.find();
    questions.sort((a, b) => a.category[0].localeCompare(b.category[0]));
    res.render("questions/viewQuestions", {
      title: "View Questions",
      customCSS: "viewQuestions.css",
      questions,
    });
  } catch (err) {
    console.log(err);
  }
});

// API route
router.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// router.get("/api/questions", async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const allQuestions = await Question.find();

//     if (userId) {
//       const user = await User.findById(userId).populate("questionRatings");

//       // Implement your spaced repetition algorithm here
//       // Example: sort questions based on user's ratings
//       const sortedQuestions = allQuestions.sort((a, b) => {
//         const ratingA =
//           user.questionRatings.find((qr) => qr.questionId.toString() === a.id)
//             ?.rating || 0;
//         const ratingB =
//           user.questionRatings.find((qr) => qr.questionId.toString() === b.id)
//             ?.rating || 0;
//         return ratingA - ratingB;
//       });

//       res.status(200).json({ questions: sortedQuestions });
//     } else {
//       res.status(200).json({ questions: allQuestions });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching questions" });
//   }
// });

// Edit and delete routes
router.get("/modify-questions", isLoggedIn, async (req, res) => {
  try {
    const questions = await Question.find();
    questions.sort((a, b) => a.category[0].localeCompare(b.category[0]));

    res.render("questions/modify-questions", {
      title: "Modify Questions",
      customCSS: "editquestions.css",
      questions,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/modify-questions/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).send("Question not found");
    } else {
      res.render("questions/update", {
        title: "Edit Question",
        customCSS: "editquestions.css",
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

router.post("/modify-questions/:id/delete", isLoggedIn, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/modify-questions");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
