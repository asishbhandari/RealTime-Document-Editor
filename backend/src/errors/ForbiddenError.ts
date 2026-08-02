import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError {
    constructor(
        message: string,
        code = "FORBIDDEN"
    ){
        super(message, 403, code)
    }
}