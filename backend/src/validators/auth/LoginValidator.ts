import { z } from "zod";

export const LoginValidator ={
    body: z.object({
        email: z.string().trim().email().transform((value) => value.toLowerCase()),
        password: z.string().min(1, "Password is required"),
    }).strict(),
}