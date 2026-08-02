import { RegisterUserDto } from "../dto/auth/RegisterUserDto.js";
import { ConflictError } from "../errors/ConflictError.js";
import { UserDocument } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { PasswordService } from "./PasswordService.js";

function isDuplicateKeyError(error: unknown): boolean{
    return (
        typeof error === "object" 
        && error !== null 
        && "code" in error 
        && error.code === 11000    
    );
}

export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService
    ){}

    async register(dto: RegisterUserDto): Promise<UserDocument> {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const existingUser = await this.userRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new ConflictError(
                "Email already exists",
                "EMAIL_ALREADY_EXISTS",
            );
        }

        const passwordHash = await this.passwordService.hash(dto.password);
        try {
            return await this.userRepository.create({
                name: dto.name.trim(),
                email: normalizedEmail,
                passwordHash,
            });
            } catch (error) {
            // MongoDB's unique index protects against concurrent registrations.
            if (isDuplicateKeyError(error)) {
                throw new ConflictError(
                "Email already exists",
                "EMAIL_ALREADY_EXISTS",
                );
            }

            throw error;
        }
    }
}