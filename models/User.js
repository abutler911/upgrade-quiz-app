const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: String,
  employeeNumber: String,
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending",
  },
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
    },
  ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
