const express = require("express");
const router = new express.Router();
const Question = require("../models/Question");
const QuestionRating = require("../models/QuestionRating");

router.post("/question/:questionId/rating", async (req, res) => {
  const { questionId } = req.params;
  const { userId, rating } = req.body;

  try {
    let questionRating = await QuestionRating.findOne({ questionId, userId });

    if (questionRating) {
      questionRating.rating = rating;
    } else {
      questionRating = new QuestionRating({ questionId, userId, rating });
    }

    await questionRating.save();

    res
      .status(200)
      .json({ message: "Rating saved successfully", questionRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/ratings", async (req, res) => {
  const { questionIds } = req.body;
  try {
    const ratings = await QuestionRating.find({
      questionId: { $in: questionIds },
      // userId: "dummyUserId", // Uncomment and replace this with the actual user ID if you want to fetch ratings per user
    }).select("questionId rating -_id");

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Error fetching ratings" });
  }
});

module.exports = router;
