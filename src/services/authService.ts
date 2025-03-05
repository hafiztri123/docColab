// src/services/authService.ts
import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '../types/auth.types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Store tokens in localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
};

export const register = async (userData: RegisterRequest): Promise<UserProfile> => {
    const response = await api.post<UserProfile>('/auth/register', userData);
    return response.data;
};

export const logout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
        try {
            await api.post('/auth/logout', { refresh_token: refreshToken });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    // Clear tokens regardless of API response
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const refreshTokens = async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken
    });

    // Update tokens in localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
};