import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../utilites/asyncHandler.js";
import { AuthService } from "../services/AuthService.js";
import { RegisterUserDto } from "../dto/auth/RegisterUserDto.js";
import { created } from "../utilites/response.js";
import { UserMapper } from "../mappers/UserMapper.js";

export class AuthController {
    constructor(private readonly authService: AuthService){}

    public register: RequestHandler = asyncHandler(async (req, res) => {
        const dto = req.body as RegisterUserDto;

        const user = await this.authService.register(dto);

        created(
            res,
            UserMapper.toResponse(user),
            "User registered successfully",
        );
    })
}