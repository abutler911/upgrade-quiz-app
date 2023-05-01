const express = require("express");
const router = new express.Router();

const Note = require("../models/notes");
const { capitalizeWords } = require("../public/data/capitalizetext");
const { isLoggedIn } = require("../middleware/middlewares");

router.get("/notes/view-notes", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.render("view-notes", {
      title: "Notes",
      customCSS: "view-notes.css",
      notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving notes...");
  }
});

router.get("/notes/create", async (req, res) => {
  res.render("newNote", { title: "Create Note", customCSS: "new-note.css" });
});

router.post("/notes/create", async (req, res) => {
  try {
    const { title, content } = req.body;
    const capitalizedTitle = capitalizeWords(title);

    // Get the user's ID from the logged-in user (how you do this depends on how you handle user authentication)
    const userId = req.user._id;

    const note = new Note({
      title: capitalizedTitle,
      content,
      user: userId, // Add the user's ID to the note
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
