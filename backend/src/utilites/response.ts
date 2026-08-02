import { Response } from "express";
import { ApiResponse } from "../types/api.js";

export function ok<T>(
    res:Response,
    data: T,
    message= "Success"
){
    const response: ApiResponse<T> ={
        success:true,
        message,
        data,
    }
    return res.status(200).json(response)
}

export function created<T>(
    res: Response,
    data: T,
    message = "Created"
){
    const response: ApiResponse<T>={
        success: true,
        message,
        data,
    }
    return res.status(201).json(response)
}

export function noContent(res: Response) {
    return res.status(204).send();
}

export function fail(
    res: Response,
    status: number,
    message: string
) {
    const response: ApiResponse={
        success: false,
        message,
    }
    return res.status(status).json(response)
}