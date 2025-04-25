// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
    sub: string;  // Biasanya ID user
    email: string;
}  