
import Note from "../models/Note.js";

// GET /notes 
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

// POST /notes 
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required." });

    const note = await Note.create({ title, content, user: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:id 
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:id 
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    next(err);
  }
};
