// src/pages/analytics/UserAnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import { getUserAnalytics } from '../../services/analyticsService';
import { UserAnalytics } from '../../types/analytics.types';
import ActivityChart from '../../components/dashboard/ActivityChart';
import { Link } from 'react-router-dom';

const UserAnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const analyticsData = await getUserAnalytics(period);
                setAnalytics(analyticsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [period]);

    const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month' | 'year') => {
        setPeriod(newPeriod);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="bg-red-100 text-red-800 p-4 rounded-md my-4">
                <h3 className="text-lg font-medium">Error</h3>
                <p>{error || 'Failed to load analytics data'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Analytics</h1>
                <p className="text-gray-500">Track your document activity and engagement</p>
            </div>

            {/* Period selector */}
            <div className="mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePeriodChange('day')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${period === 'day'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => handlePeriodChange('week')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${period === 'week'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => handlePeriodChange('month')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${period === 'month'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => handlePeriodChange('year')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${period === 'year'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* Overview stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Documents</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.documents.total}</p>
                            <p className="text-sm text-gray-500">
                                {analytics.documents.created} created, {analytics.documents.collaborated} shared
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Views</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.activity.views}</p>
                            <p className="text-sm text-gray-500">
                                In the last {period}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Edits</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.activity.edits}</p>
                            <p className="text-sm text-gray-500">
                                In the last {period}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Activity Overview</h2>
                </div>
                <div className="p-6">
                    <ActivityChart data={analytics.activity.timeline} />
                </div>
            </div>

            {/* Most Active Documents */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Most Active Documents</h2>
                </div>
                {analytics.most_active_documents && analytics.most_active_documents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {analytics.most_active_documents.map((doc) => (
                            <li key={doc.id} className="p-4 hover:bg-gray-50">
                                <Link to={`/documents/${doc.id}`} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {doc.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-col items-end text-sm text-gray-500">
                                        <div className="flex space-x-4">
                                            <span className="flex items-center">
                                                <svg className="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {doc.views}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                {doc.edits}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No document activity data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAnalyticsPage;