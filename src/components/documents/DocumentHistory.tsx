// src/components/documents/DocumentHistory.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById, getDocumentHistory, restoreDocumentVersion } from '../../services/documentService';
import { Document, DocumentHistoryItem } from '../../types/document.types';
import { formatDate, formatTime } from '../../utils/formatters';
import markdownIt from 'markdown-it';

const DocumentHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<Document | null>(null);
    const [history, setHistory] = useState<DocumentHistoryItem[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRestoring, setIsRestoring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const md = React.useMemo(() => markdownIt(), []);

    // Fetch document data
    useEffect(() => {
        if (!id) {
            setError('Document ID is required');
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [documentData, historyData] = await Promise.all([
                    getDocumentById(id),
                    getDocumentHistory(id, currentPage, 10)
                ]);

                setDocument(documentData);
                setHistory(historyData.data);
                setTotalPages(historyData.pagination.total_pages);

                // Automatically select the most recent version for preview
                if (historyData.data.length > 0) {
                    const latestVersion = historyData.data[0].version;
                    setSelectedVersion(latestVersion);
                    setPreviewContent(historyData.data[0].content);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load document history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, currentPage]);

    // Handle version selection
    const handleVersionSelect = (version: number, content: string) => {
        setSelectedVersion(version);
        setPreviewContent(content);
    };

    // Handle version restore
    const handleRestore = async () => {
        if (!id || selectedVersion === null) return;

        if (!confirm(`Restore document "${document?.title}" to version ${selectedVersion}?`)) {
            return;
        }

        setIsRestoring(true);

        try {
            const updatedDoc = await restoreDocumentVersion(id, selectedVersion);
            setDocument(updatedDoc);
            alert(`Document restored to version ${selectedVersion}`);
            navigate(`/documents/${id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to restore document version');
        } finally {
            setIsRestoring(false);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                    onClick={() => navigate('/documents')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Back to Documents
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{document?.title} - Version History</h1>
                    <p className="text-sm text-gray-500">
                        View and restore previous versions of this document
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(`/documents/${id}`)}
                        className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                        Back to Document
                    </button>
                    <button
                        onClick={handleRestore}
                        disabled={isRestoring || selectedVersion === null}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRestoring ? 'Restoring...' : 'Restore Selected Version'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-12rem)]">
                {/* Versions list */}
                <div className="w-1/3 border-r overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {history.map((item) => (
                            <li
                                key={item.version}
                                className={`px-6 py-4 cursor-pointer ${selectedVersion === item.version ? 'bg-indigo-50' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => handleVersionSelect(item.version, item.content)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Version {item.version}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(item.updated_at)} at {formatTime(item.updated_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-xs text-gray-500">
                                            {item.updated_by.name}
                                        </div>
                                        {selectedVersion === item.version && (
                                            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-3 bg-gray-50 border-t">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Document preview */}
                <div className="w-2/3 p-6 overflow-y-auto">
                    {selectedVersion !== null ? (
                        <div>
                            <div className="pb-4 mb-6 border-b">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Version {selectedVersion} Preview
                                </h2>
                            </div>
                            <div
                                className="prose prose-indigo max-w-none"
                                dangerouslySetInnerHTML={{ __html: md.render(previewContent) }}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            Select a version to preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentHistory;