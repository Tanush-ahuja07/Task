import Todo from "../models/Todo.js";

// GET /todos → List all todos for logged-in user
export const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(todos);
};

// POST /todos → Create a new todo
export const createTodo = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required." });

  const todo = await Todo.create({ title, user: req.user._id });
  res.status(201).json(todo);
};

// PATCH /todos/:id → Update title or completed status
export const updateTodo = async (req, res) => {
  const { title, completed } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { ...(title && { title }), ...(completed !== undefined && { completed }) },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found." });
  res.json(todo);
};

// PATCH /todos/:id/toggle → Flip completed status
export const toggleTodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
  if (!todo) return res.status(404).json({ message: "Todo not found." });

  todo.completed = !todo.completed;
  await todo.save();
  res.json({ id: todo._id, isCompleted: todo.completed });
};

// DELETE /todos/:id → Remove todo
export const deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!todo) return res.status(404).json({ message: "Todo not found." });
  res.json({ message: "Todo deleted successfully." });
};
