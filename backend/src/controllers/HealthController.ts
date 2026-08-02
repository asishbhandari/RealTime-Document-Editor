import { Request, Response } from "express";
import * as HealthService from "../services/HealthService.js"
import { ok } from "../utilites/response.js";
import { SERVER_ID } from "../constants/server.js";

export async function healthCheck(
    req: Request,
    res: Response,
){
    const response = await HealthService.check();
    return ok(res,{status: "Healthy", server: SERVER_ID },"Health Check")
    // return res.status(200).json(response);
}