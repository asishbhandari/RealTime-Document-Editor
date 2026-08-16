import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export interface AuthenticatedUser {
    userId: string,
    email: string
}

interface AccessTokenPayload extends JWTPayload {
    email: string
}

export class TokenService {
    private readonly accessTokenSecret = new TextEncoder().encode(env.JWT_SECRET)
    
    async generateAccessToken(user: AuthenticatedUser): Promise<string> {
        return new SignJWT({ email: user.email })
            .setProtectedHeader({alg:"HS256"})
            .setSubject(user.userId)
            .setIssuedAt()
            .setExpirationTime(env.ACCESS_TOKEN_EXPIRY)
            .sign(this.accessTokenSecret)
    }

    async verifyAccessToken(token: string): Promise<AuthenticatedUser>{
        try {
            const { payload } = await jwtVerify<AccessTokenPayload>(
                token, 
                this.accessTokenSecret
            )

            if(!payload.sub || typeof payload.email !== "string"){
                throw new UnauthorizedError("Invalid access token", "INVALID_TOKEN");
            }

            return {
                userId: payload.sub,
                email: payload.email,
            }
            
        } catch (error) {
            if(error instanceof UnauthorizedError){
                throw error;
            }

            throw new UnauthorizedError("Invalid or expired access token", "INVALID_TOKEN");
        }
    }
}