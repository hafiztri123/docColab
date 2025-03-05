// src/pages/analytics/DocumentAnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById } from '../../services/documentService';
import { getDocumentAnalytics } from '../../services/analyticsService';
import { Document } from '../../types/document.types';
import { DocumentAnalytics } from '../../types/analytics.types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const DocumentAnalyticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);
    const [analytics, setAnalytics] = useState<DocumentAnalytics | null>(null);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Document ID is required');
                setIsLoading(false);
                return;
            }

            try {
                const [docData, analyticsData] = await Promise.all([
                    getDocumentById(id),
                    getDocumentAnalytics(id, period)
                ]);

                setDocument(docData);
                setAnalytics(analyticsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, period]);

    const handleBackToDocument = () => {
        if (id) {
            navigate(`/documents/${id}`);
        } else {
            navigate('/documents');
        }
    };

    const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month' | 'year') => {
        setPeriod(newPeriod);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                    <p className="font-medium text-gray-900">{formatDate(label)}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }

        return null;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !document || !analytics) {
        return (
            <div className="bg-red-100 text-red-800 p-4 rounded-md my-4">
                <h3 className="text-lg font-medium">Error</h3>
                <p>{error || 'Failed to load analytics data'}</p>
                <button
                    onClick={() => navigate('/documents')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Back to Documents
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center">
                <button
                    onClick={handleBackToDocument}
                    className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg
                        className="-ml-0.5 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Document
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Analytics: {document.title}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Views</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.views.total}</p>
                            <p className="text-sm text-gray-500">
                                {analytics.views.unique_users} unique viewers
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Edits</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.edits.total}</p>
                            <p className="text-sm text-gray-500">
                                By {analytics.edits.by_users.length} users
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Views timeline chart */}
            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Views Over Time</h2>
                </div>
                <div className="p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analytics.views.timeline}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Views"
                                    stroke="#4F46E5"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Edits timeline chart */}
            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Edits Over Time</h2>
                </div>
                <div className="p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analytics.edits.timeline}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Edits"
                                    stroke="#10B981"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Edits by user chart */}
            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Edits by User</h2>
                </div>
                <div className="p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analytics.edits.by_users}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="user_name"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Edits" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentAnalyticsPage;