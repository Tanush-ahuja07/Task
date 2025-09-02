import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} from "../controllers/todoController.js";
import { todoSchema } from "../validation/todoSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isValidate from "../middleware/validate.js";
const router = express.Router();

router.route("/")
  .get(authMiddleware, getTodos)
  .post(authMiddleware, isValidate(todoSchema), createTodo);

router.route("/:id")
  .patch(authMiddleware, isValidate(todoSchema), updateTodo)
  .delete(authMiddleware, deleteTodo);

router.patch("/:id/toggle", authMiddleware, toggleTodo);

export default router;
