import { AppError } from "./AppError.js";

export class TooManyRequestsError extends AppError {
    constructor(
        message: string,
        code = "TOO_MANY_REQUEST"
    ){
        super(message, 429, code)
    }
}