import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override"
import errorHandler from "./middleware/errorHandler.js";
// Route imports
import userRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/todos", todoRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => console.error("MongoDB connection error:", err));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  app.use(errorHandler);