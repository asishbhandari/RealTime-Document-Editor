export interface CreateUserData{
    name: string,
    email: string,
    passwordHash: string;
    avatarUrl?: string;
}