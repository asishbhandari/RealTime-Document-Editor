import { UserDocument, UserModel } from "../models/User.js";
import { CreateUserData } from "../types/createUserData.js";

export class UserRepository {
    async findByEmail(email: string): Promise<UserDocument | null>{
        return UserModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).exec();
    }

    async create(user: CreateUserData): Promise<UserDocument | null> {
        return UserModel.create(user);
    }
}