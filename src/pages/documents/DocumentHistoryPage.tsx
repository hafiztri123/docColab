// src/pages/documents/DocumentHistoryPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentHistory from '../../components/documents/DocumentHistory';

const DocumentHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleBackToDocument = () => {
        if (id) {
            navigate(`/documents/${id}`);
        } else {
            navigate('/documents');
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Document History</h1>
            </div>

            <DocumentHistory />
        </div>
    );
};

export default DocumentHistoryPage; 