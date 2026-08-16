import express from "express";
import { authController } from "../container/controllers.js";
import { validate } from "../middleware/validate.js";
import { RegisterValidator } from "../validators/auth/RegisterValidator.js";
import { LoginValidator } from "../validators/auth/LoginValidator.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(RegisterValidator),
  authController.register,
);

authRouter.post(
  "/login",
  validate(LoginValidator),
  authController.login,
)

export default authRouter;