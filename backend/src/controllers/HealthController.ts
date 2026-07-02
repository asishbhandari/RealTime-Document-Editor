import { Request, Response } from "express";
import * as HealthService from "../services/HealthService.js"

export async function healthCheck(
    req: Request,
    res: Response,
){
    const response = await HealthService.check();
    return res.status(200).json(response);
}