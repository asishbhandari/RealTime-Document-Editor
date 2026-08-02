import express from "express";
import { authController } from "../container/controllers.js";
import { validate } from "../middleware/validate.js";
import { RegisterValidator } from "../validators/auth/RegisterValidator.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(RegisterValidator),
  authController.register,
);

export default authRouter;