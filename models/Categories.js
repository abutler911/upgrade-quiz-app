const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  value: String,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
