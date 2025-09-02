import Note from "../models/Note.js";

// GET /notes 
export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(notes);
};

// POST /notes 
export const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content required." });

  const note = await Note.create({ title, content, user: req.user._id });
  res.status(201).json(note);
};

// PATCH /notes/:id 
export const updateNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found." });
  res.json(note);
};

// DELETE /notes/:id 
export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found." });
  res.json({ message: "Note deleted successfully." });
};
