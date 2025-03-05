// src/components/dashboard/DocumentStats.tsx
import React from 'react';

interface DocumentStatsProps {
    totalDocuments: number;
    createdDocuments: number;
    collaboratedDocuments: number;
}

const DocumentStats: React.FC<DocumentStatsProps> = ({
    totalDocuments,
    createdDocuments,
    collaboratedDocuments
}) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Document Statistics</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Documents</span>
                    <span className="text-lg font-bold text-gray-900">{totalDocuments}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '100%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Created by You</span>
                    <span className="text-lg font-bold text-gray-900">{createdDocuments}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${(createdDocuments / totalDocuments) * 100}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Collaborations</span>
                    <span className="text-lg font-bold text-gray-900">{collaboratedDocuments}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(collaboratedDocuments / totalDocuments) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DocumentStats;