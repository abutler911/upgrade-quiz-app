const express = require("express");
const router = new express.Router();

const Note = require("../models/notes");
const { capitalizeWords } = require("../public/data/capitalizetext");
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/notes/view-notes", isLoggedIn, async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 });
    res.render("view-notes", { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving notes...");
  }
});

router.get("/notes/create", async (req, res) => {
  res.render("newNote");
});

router.post("/notes/create", async (req, res) => {
  try {
    const { title, content } = req.body;
    const capitalizedTItle = capitalizeWords(title);
    const note = new Note({
      title: capitalizedTItle,
      content,
    });
    await note.save();
    res.redirect("/notes/create");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating note");
  }
});

router.post("/notes/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const noteId = req.params.id;
    await Note.findByIdAndDelete(noteId);
    res.redirect("/notes/view-notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting note");
  }
});

module.exports = router;
