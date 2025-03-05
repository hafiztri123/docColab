// src/components/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserAnalytics } from '../../services/analyticsService';
import { getDocuments } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { UserAnalytics } from '../../types/analytics.types';
import { DocumentListItem } from '../../types/document.types';
import ActivityChart from './ActivityChart';
import DocumentStats from './DocumentStats';
import RecentDocuments from './RecentDocuments';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [recentDocuments, setRecentDocuments] = useState<DocumentListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [analyticsData, documentsData] = await Promise.all([
                    getUserAnalytics('month'),
                    getDocuments(1, 5, 'updated_at', 'desc')
                ]);

                setAnalytics(analyticsData);
                setRecentDocuments(documentsData.data);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleCreateDocument = () => {
        navigate('/documents/new');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-800 p-4 rounded-md my-4">
                <h3 className="text-lg font-medium">Error</h3>
                <p>{error}</p>
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
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={handleCreateDocument}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    New Document
                </button>
            </div>

            {/* Stats overview */}
            {analytics && (
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
                                    In the last 30 days
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
                                    In the last 30 days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Chart */}
            {analytics && (
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-medium text-gray-900">Activity Overview</h2>
                    </div>
                    <div className="p-6">
                        <ActivityChart data={analytics.activity.timeline} />
                    </div>
                </div>
            )}

            {/* Recent Documents & Most Active Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Documents */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
                        <Link to="/documents" className="text-sm text-indigo-600 hover:text-indigo-800">
                            View all
                        </Link>
                    </div>
                    <div>
                        {recentDocuments.length > 0 ? (
                            <RecentDocuments documents={recentDocuments} />
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No documents yet</p>
                                <button
                                    onClick={handleCreateDocument}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Create Your First Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Most Active Documents */}
                {analytics?.most_active_documents && analytics.most_active_documents.length > 0 && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900">Most Active Documents</h2>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {analytics.most_active_documents.slice(0, 5).map((doc) => (
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
                                            <span>{doc.views} views</span>
                                            <span>{doc.edits} edits</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;