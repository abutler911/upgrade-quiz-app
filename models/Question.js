const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],

  answer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
  flaggedForReview: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
