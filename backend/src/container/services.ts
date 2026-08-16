import { userRepository } from "./repositories.js";
import { AuthService } from "../services/AuthService.js";
import { PasswordService } from "../services/PasswordService.js";
import { TokenService } from "../services/TokenService.js";

export const passwordService = new PasswordService();
export const tokenService = new TokenService();

export const authService = new AuthService(
  userRepository,
  passwordService,
  tokenService,
);