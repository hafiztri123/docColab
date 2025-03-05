// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, isAuthenticated, login, logout, register } from '../services/authService';
import { LoginRequest, RegisterRequest, UserProfile } from '../types/auth.types';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);

            try {
                if (isAuthenticated()) {
                    const userProfile = await getUserProfile();
                    setUser(userProfile);
                }
            } catch (err: any) {
                console.error('Authentication check failed:', err);
                // Clear invalid auth state
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(credentials);
            const userProfile = await getUserProfile();
            setUser(userProfile);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (userData: RegisterRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await register(userData);
            // Automatically log in after registration
            await login({
                email: userData.email,
                password: userData.password
            });
            const userProfile = await getUserProfile();
            setUser(userProfile);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (err: any) {
            console.error('Logout error:', err);
            // Still clear user state even if API call fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};