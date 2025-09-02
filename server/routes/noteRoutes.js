import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/noteController.js";
import { noteSchema } from "../validation/notesSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isValidate from "../middleware/validate.js";

const router = express.Router();

router.route("/")
  .get(authMiddleware, getNotes)
  .post(authMiddleware, isValidate(noteSchema), createNote);

router.route("/:id")
  .patch(authMiddleware, isValidate(noteSchema), updateNote)
  .delete(authMiddleware, deleteNote);

export default router;

