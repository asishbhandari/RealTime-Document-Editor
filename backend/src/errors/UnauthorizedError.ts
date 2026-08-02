import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
    constructor(
        message: string,
        code = "UNAUTHORIZED"
    ){
        super(message, 401, code)
    }
}