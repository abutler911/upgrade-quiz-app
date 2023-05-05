const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Question = require("../models/Question");
const { capitalizeAndPunctuate } = require("../public/data/capitalizetext");
const { isLoggedIn } = require("../middleware/middlewares");
const User = require("../models/User");

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
// router.get("/api/questions", async (req, res) => {
//   try {
//     const questions = await Question.find();
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching questions" });
//   }
// });
// router.get("/api/questions", isLoggedIn, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     const userQuestionRatings = user.questionRatings || {};

//     const questions = await Question.find({}).lean();

//     // Update questions with user-specific ratings
//     questions.forEach((question) => {
//       const userRating = userQuestionRatings[question._id];
//       if (userRating) {
//         question.difficulty = userRating;
//       }
//     });
router.get("/api/questions", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "questionRatings.question"
    );

    // Create a Map for user-specific question ratings
    const userQuestionRatingsMap = new Map();
    user.questionRatings.forEach(({ question, rating, lastSeen }) => {
      userQuestionRatingsMap.set(question._id.toString(), { rating, lastSeen });
    });

    const questions = await Question.find({}).lean();

    // Update questions with user-specific ratings
    questions.forEach((question) => {
      if (question && question._id) {
        const userQuestionData = userQuestionRatingsMap.get(
          question._id.toString()
        );
        if (userQuestionData) {
          question.difficulty = userQuestionData.rating;
          question.lastSeen = userQuestionData.lastSeen;
        }
      } else {
        console.warn("Encountered a null or invalid quesiton: ", question);
      }
    });

    questions.sort((a, b) => {
      const now = new Date();
      const aLastSeenDays = (now - a.lastSeen) / (1000 * 60 * 60 * 24);
      const bLastSeenDays = (now - b.lastSeen) / (1000 * 60 * 60 * 24);
      const aDue = aLastSeenDays - a.interval;
      const bDue = bLastSeenDays - b.interval;

      return bDue - aDue;
    });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

router.post("/api/question/:id/seen", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Find the existing question rating
    const existingQuestionRating = user.questionRatings.find(
      (qr) => qr.question.toString() === id
    );

    if (existingQuestionRating) {
      // Update the lastSeen date for the question
      existingQuestionRating.lastSeen = new Date();
    } else {
      // Add a new entry to the user's questionRatings with the current date as lastSeen
      user.questionRatings.push({
        question: id,
        rating: 1, // Set a default rating if the user hasn't rated the question yet
        lastSeen: new Date(),
      });
    }

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating lastSeen for question:", error);
    res.status(500).send("Error updating lastSeen for question");
  }
});

//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching questions" });
//   }
// });

// router.post("/api/question/:id/difficulty", isLoggedIn, async (req, res) => {
//   const { id } = req.params;
//   const { difficulty } = req.body;
//   const userId = req.user._id;

//   try {
// await Question.findByIdAndUpdate(id, { difficulty });
// res.sendStatus(200);
//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         questionRatings: {
//           question: id,
//           rating: difficulty,
//         },
//       },
//     });
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error updating question difficulty:", error);
//     res.status(500).send("Error updating question difficulty");
//   }
// });
router.post("/api/question/:id/difficulty", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { difficulty, interval } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Find the existing question rating
    const existingQuestionRating = user.questionRatings.find(
      (qr) => qr.question.toString() === id
    );

    if (existingQuestionRating) {
      // Update the existing question rating
      existingQuestionRating.rating = difficulty;
      existingQuestionRating.interval = interval;
    } else {
      // Add a new question rating
      user.questionRatings.push({ question: id, rating: difficulty });
    }

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating question difficulty:", error);
    res.status(500).send("Error updating question difficulty");
  }
});

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

router.post("/api/question/:id/flagForReview", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    await Question.findByIdAndUpdate(id, { flaggedForReview: true });
    res.status(200).send("Question flagged for review successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to flag question for review");
  }
});

module.exports = router;
