// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            setIsLoggingOut(true);
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                // Even if logout API fails, we still clear local state
                navigate('/login');
            } finally {
                setIsLoggingOut(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                <p className="text-gray-500">Manage your account settings and preferences</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal details.</p>
                </div>

                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Account created</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Preferences</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your application preferences.</p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="flex-grow flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Theme</span>
                            <span className="text-sm text-gray-500">
                                Switch between light and dark theme
                            </span>
                        </span>
                        <button
                            onClick={toggleTheme}
                            type="button"
                            className={`${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
                                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            aria-pressed={theme === 'dark'}
                        >
                            <span className="sr-only">Toggle theme</span>
                            <span
                                className={`${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            >
                                <span
                                    className={`${theme === 'dark'
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200'
                                        } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                    aria-hidden="true"
                                >
                                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                        <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span
                                    className={`${theme === 'dark'
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100'
                                        } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                    aria-hidden="true"
                                >
                                    <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <span className="flex-grow flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                                <span className="text-sm text-gray-500">
                                    Receive email notifications about document updates
                                </span>
                            </span>
                            <button
                                type="button"
                                className={`bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                <span className="sr-only">Toggle email notifications</span>
                                <span
                                    className={`translate-x-0 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                >
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-red-600">Account Actions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage your account actions.
                    </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        <svg
                            className="-ml-1 mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        {isLoggingOut ? 'Logging out...' : 'Sign out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;