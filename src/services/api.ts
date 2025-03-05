// src/services/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { refreshTokens } from './authService';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest?.headers['X-Retry']) {
            try {
                // Get new tokens using refresh token
                await refreshTokens();

                // Retry the original request with new token
                if (originalRequest) {
                    originalRequest.headers['X-Retry'] = 'true';
                    const token = localStorage.getItem('access_token');
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is invalid, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Format error response
        let errorMessage = 'An unexpected error occurred';
        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return Promise.reject({
            status: error.response?.status,
            message: errorMessage,
            code: error.response?.data?.error?.code || 'unknown_error',
            details: error.response?.data?.error?.details || null,
        });
    }
);

export default api;