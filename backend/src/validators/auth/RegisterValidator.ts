import { z } from "zod";

export const RegisterValidator = {

    body: z.object({

        name: z
            .string()
            .trim()
            .min(2)
            .max(100),

        email: z
            .email()
            .transform(v => v.toLowerCase()),

        password: z
            .string()
            .min(8),

    }),

};