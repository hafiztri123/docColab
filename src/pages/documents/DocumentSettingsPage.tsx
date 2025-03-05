// src/pages/documents/DocumentSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById, updateDocument, deleteDocument } from '../../services/documentService';
import { DocumentUpdateRequest } from '../../types/document.types';
import ShareModal from '../../components/documents/ShareModal';

const DocumentSettingsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            if (!id) {
                setError('Document ID is required');
                setIsLoading(false);
                return;
            }

            try {
                const doc = await getDocumentById(id);
                setDocument(doc);
                setTitle(doc.title);
                setIsPublic(doc.is_public);
            } catch (err: any) {
                setError(err.message || 'Failed to load document');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updateData: DocumentUpdateRequest = {
                title,
                is_public: isPublic
            };

            const updatedDoc = await updateDocument(id, updateData);
            setDocument(updatedDoc);
            setSuccessMessage('Document settings saved successfully');
        } catch (err: any) {
            setError(err.message || 'Failed to save document settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await deleteDocument(id);
            navigate('/documents');
        } catch (err: any) {
            setError(err.message || 'Failed to delete document');
            setIsDeleting(false);
        }
    };

    const handleOpenShareModal = () => {
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleDocumentUpdated = (updatedDoc: any) => {
        setDocument(updatedDoc);
    };

    const handleBackToDocument = () => {
        if (id) {
            navigate(`/documents/${id}`);
        } else {
            navigate('/documents');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error && !document) {
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
                <h1 className="text-2xl font-bold text-gray-900">Document Settings</h1>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
                    {successMessage}
                </div>
            )}

            {error && document && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage your document's basic settings.
                    </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Document Title
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_public"
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_public" className="ml-3 block text-sm font-medium text-gray-700">
                                Make document public
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Sharing</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage who has access to this document.
                    </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <button
                        type="button"
                        onClick={handleOpenShareModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                        Manage Collaborators
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-red-600">Danger Zone</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Destructive actions that cannot be undone.
                    </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        {isDeleting ? 'Deleting...' : 'Delete this document'}
                    </button>
                </div>
            </div>

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

export default DocumentSettingsPage;