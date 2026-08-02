import { userRepository } from "./repositories.js";
import { PasswordService } from "../services/PasswordService.js";
import { AuthService } from "../services/AuthService.js";

export const passwordService = new PasswordService();

export const authService = new AuthService(
  userRepository,
  passwordService,
);