
import Note from "../models/note.js";
import { enhanceContent } from "../utils/geminiService.js";

// GET /notes 
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const responseNotes = notes.map(n => {
      const obj = n.toObject();
      obj.id = obj._id;
      delete obj._id;
      return obj;
    });
    res.json(responseNotes);
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
    const responseNote = { ...note.toObject(), id: note._id, _id: undefined };
    res.status(201).json(responseNote);
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
    const responseNote = { ...note.toObject(), id: note._id, _id: undefined };
    res.json(responseNote);
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

export const enhanceNoteWithAI = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (req.params.id == "new") {
      if (!content) return res.status(400).json({ message: "Content required." });
      const enhancedContent = await enhanceContent(content);
      const responseNote = { content: enhancedContent };
      res.status(201).json(responseNote);
    }
     const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found." });
    console.log("Original Content:", content?content:note.content);

    const enhancedContent = await enhanceContent(content?content:note.content);
    note.content = enhancedContent;
    const responseNote = { ...note.toObject(), id: note._id, _id: undefined };
    res.json(responseNote);

  } catch (err) {
    next(err);
  }
}
