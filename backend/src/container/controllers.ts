import { AuthController } from "../controllers/AuthController.js";
import { authService } from "./services.js";

export const authController = new AuthController(authService);