const express = require("express");
const router = new express.Router();
const Question = require("../models/Question");

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

module.exports = router;
