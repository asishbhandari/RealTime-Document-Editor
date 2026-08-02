import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const userSchema= new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        avatarUrl: {
            type: String,
            default: null,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export type User= InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel= model<User>("User", userSchema);