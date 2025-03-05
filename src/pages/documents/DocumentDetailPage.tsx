// src/pages/documents/DocumentDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentEditor from '../../components/documents/DocumentEditor';
import ShareModal from '../../components/documents/ShareModal';
import { getDocumentById } from '../../services/documentService';
import { Document } from '../../types/document.types';

interface DocumentDetailPageProps {
    isNew?: boolean;
}

const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({ isNew = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNew) {
            return;
        }

        const fetchDocument = async () => {
            if (!id) return;

            try {
                const fetchedDocument = await getDocumentById(id);
                setDocument(fetchedDocument);
            } catch (err: any) {
                setError(err.message || 'Failed to load document');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [id, isNew]);

    const handleOpenShareModal = () => {
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleDocumentUpdated = (updatedDoc: Document) => {
        setDocument(updatedDoc);
    };

    const handleViewHistory = () => {
        if (id) {
            navigate(`/documents/${id}/history`);
        }
    };

    const handleViewAnalytics = () => {
        if (id) {
            navigate(`/documents/${id}/analytics`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error && !isNew) {
        return (
            <div className="bg-red-100 text-red-800 p-4 rounded-md my-4">
                <h3 className="text-lg font-medium">Error</h3>
                <p>{error}</p>
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
            {!isNew && document && (
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                        <button
                            onClick={handleViewHistory}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            History
                        </button>
                        <button
                            onClick={handleViewAnalytics}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Analytics
                        </button>
                        <button
                            onClick={handleOpenShareModal}
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            )}

            <DocumentEditor isNew={isNew} />

            {document && (
                <ShareModal
                    document={document}
                    isOpen={isShareModalOpen}
                    onClose={handleCloseShareModal}
                    onDocumentUpdated={handleDocumentUpdated}
                />
            )}
        </div>
    );
};

export default DocumentDetailPage;