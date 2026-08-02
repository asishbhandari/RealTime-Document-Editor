import { UserResponseDto } from "../dto/responses/UserResponseDto.js";
import { UserDocument } from "../models/User.js";

export class UserMapper{
    static toResponse(user: UserDocument): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
        }
    }
}