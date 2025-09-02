import express from "express";
import { register, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { signupSchema , loginSchema } from "../validation/authSchema.js";
const router = express.Router();
import isValidate from "../middleware/validate.js";

router.post('/register', isValidate(signupSchema), register);
router.post('/login', isValidate(loginSchema), login);
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Protected profile route accessed',
    user: req.user
  });
});


export default router;