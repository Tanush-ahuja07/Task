import { z } from "zod";

export const todoSchema = z.object({
  task: z.string().min(1, "Title cannot be empty"),
  completed: z.boolean().optional()
});
