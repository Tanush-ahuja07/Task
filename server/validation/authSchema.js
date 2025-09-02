import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Name should be at least 3 characters long"),
  email: z.string().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});
