const express = require("express");
const router = new express.Router();
const categories = require("../public/data/categories");
const Category = require("../models/Categories");
const fs = require("fs");
const path = require("path");
const {
  capitalizeWords,
  nameToValue,
} = require("../public/data/capitalizetext");

router.get("/categories/create", (req, res) => {
  res.render("categories/create", { categories });
});

router.post("/categories/create", (req, res) => {
  const newName = capitalizeWords(req.body.name);

  if (newName && newName.trim()) {
    const newValue = nameToValue(newName);
    const newId = categories.length + 1;

    categories.push({ id: newId, name: newName, value: newValue });
    // Alphabetize the categories before writing to the file
    categories.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
    const categoriesPath = path.join(__dirname, "../public/data/categories.js");
    const fileContent = `const categories = ${JSON.stringify(
      categories,
      null,
      2
    )};\n\nmodule.exports = categories;`;

    fs.writeFile(categoriesPath, fileContent, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the new category");
      } else {
        res.redirect("/categories/create");
      }
    });
  } else {
    res.status(400).send("Category name cannot be empty");
  }
});

module.exports = router;
