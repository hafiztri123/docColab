// src/types/auth.types.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    created_at: string;
}



