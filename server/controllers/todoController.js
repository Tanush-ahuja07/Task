
import Todo from "../models/Todo.js";

// GET /todos → List all todos for logged-in user
export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    const responseTodos = todos.map(n => {
  const obj = n.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});
    res.json(responseTodos);
  } catch (err) {
    next(err);
  }
};

// POST /todos → Create a new todo
export const createTodo = async (req, res, next) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).json({ message: "Task is required." });

    const todo = await Todo.create({ task, user: req.user._id });
    const respondTodo = { ...todo.toObject(), id: todo._id, _id: undefined };
    res.status(201).json(respondTodo);
  } catch (err) {
    next(err);
  }
};

// PATCH /todos/:id → Update title or completed status
export const updateTodo = async (req, res, next) => {
  try {
    const { task, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...(task && { task }), ...(completed !== undefined && { completed }) },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found." });
        const respondTodo = { ...todo.toObject(), id: todo._id, _id: undefined };

    res.json(respondTodo);
  } catch (err) {
    next(err);
  }
};

// PATCH /todos/:id/toggle → Flip completed status
export const toggleTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found." });

    todo.completed = !todo.completed;
    await todo.save();
    res.json({ id: todo._id, isCompleted: todo.completed });
  } catch (err) {
    next(err);
  }
};

// DELETE /todos/:id → Remove todo
export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found." });
    res.json({ message: "Todo deleted successfully." });
  } catch (err) {
    next(err);
  }
};
