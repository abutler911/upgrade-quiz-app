const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
  employeeNumber: String,
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  questionRatings: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      rating: Number,
      lastSeen: {
        type: Date,
        default: Date.now,
      },
      interval: Number,
    },
  ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
