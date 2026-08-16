import { RequestHandler } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../errors/ValidationError.js";

interface ValidationSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return async (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as typeof req.params;
      }

      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as typeof req.query;
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => {
            const path = issue.path.join(".");
            return path ? `${path}: ${issue.message}` : issue.message;
          })
          .join(", ");

        return next(new ValidationError(message));
      }

      next(error);
    }
  };
}