// src/components/dashboard/ActivityChart.tsx
import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ActivityTimelineItem {
    date: string;
    views: number;
    edits: number;
}

interface ActivityChartProps {
    data: ActivityTimelineItem[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
    const [activeMetric, setActiveMetric] = useState<'all' | 'views' | 'edits'>('all');

    // Format the date for display in the tooltip
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Custom tooltip component
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

    return (
        <div>
            {/* Chart controls */}
            <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => setActiveMetric('all')}
                        className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${activeMetric === 'all'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All Activity
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMetric('views')}
                        className={`relative inline-flex items-center px-4 py-2 border-t border-b text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${activeMetric === 'views'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Views
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMetric('edits')}
                        className={`relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${activeMetric === 'edits'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Edits
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
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
                        {(activeMetric === 'all' || activeMetric === 'views') && (
                            <Line
                                type="monotone"
                                dataKey="views"
                                name="Views"
                                stroke="#4F46E5"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        )}
                        {(activeMetric === 'all' || activeMetric === 'edits') && (
                            <Line
                                type="monotone"
                                dataKey="edits"
                                name="Edits"
                                stroke="#10B981"
                                strokeWidth={2}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityChart;