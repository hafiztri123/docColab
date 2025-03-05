// src/utils/tokenManager.ts
/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

/**
 * Clear tokens from localStorage
 */
export const clearTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

/**
 * Check if the user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};
