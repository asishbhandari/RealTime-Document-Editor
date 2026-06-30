import { NextFunction, Request, Response } from "express";
import { isAllowed } from "../services/redisRateLimiter.js";


export async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
){
    const ip= req.ip || req.socket.remoteAddress || "unknown";
    const key = `rate:ip:${ip}`;

    const result = await isAllowed(key);

    if(!result.allowed){
        return res.status(429).json({message: "Too many request"})
    }

    return next();
}