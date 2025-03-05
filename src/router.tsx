// src/router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import FullWidthLayout from './components/layouts/FullWidthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main Pages
import DashboardPage from './components/dashboard/DashboardPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import DocumentHistoryPage from './pages/documents/DocumentHistoryPage';
import DocumentSettingsPage from './pages/documents/DocumentSettingsPage';
import DocumentAnalyticsPage from './pages/analytics/DocumentAnalyticsPage';
import UserAnalyticsPage from './pages/analytics/UserAnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Public Route Component (redirects to dashboard if logged in)
interface PublicRouteProps {
    children: React.ReactNode;
    restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (isAuthenticated && restricted) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

// App Router
const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes with Auth Layout */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute restricted>
                            <FullWidthLayout>
                                <LoginPage />
                            </FullWidthLayout>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute restricted>
                            <FullWidthLayout>
                                <RegisterPage />
                            </FullWidthLayout>
                        </PublicRoute>
                    }
                />

                {/* Protected Routes with Main Layout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DashboardPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents/new"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentDetailPage isNew />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentDetailPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents/:id/history"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentHistoryPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents/:id/settings"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentSettingsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents/:id/analytics"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DocumentAnalyticsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <UserAnalyticsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ProfilePage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Home route - redirect based on auth status */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Navigate to="/dashboard" replace />
                        </PublicRoute>
                    }
                />

                {/* 404 Page */}
                <Route
                    path="*"
                    element={
                        <FullWidthLayout>
                            <NotFoundPage />
                        </FullWidthLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;