import { RequestHandler } from "express";
import { ZodSchema } from "zod/v3";
import { ValidationError } from "../errors/ValidationError.js";


interface validationSchemas{
    body?: ZodSchema,
    params?: ZodSchema,
    query?: ZodSchema
}

export function validate( schemas: validationSchemas): RequestHandler{
    return async (req, res, next)=>{
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }

            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }

            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }

            next();
        } catch (error: any) {
            next(
                new ValidationError(
                    error.errors
                        ?.map((e: any) => e.message)
                        .join(", ") || "Validation Failed"
                )
            );
        }
    }
}