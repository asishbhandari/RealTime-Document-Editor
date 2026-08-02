import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { logger } from "../logger/logger.js";



export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
){
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code
        });
    }

    logger.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    })
}