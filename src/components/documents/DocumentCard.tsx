// src/components/documents/DocumentCard.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentListItem } from '../../types/document.types';
import { deleteDocument } from '../../services/documentService';
import { formatDate } from '../../utils/formatters';

interface DocumentCardProps {
    document: DocumentListItem;
    onDocumentDeleted: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDocumentDeleted }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = () => {
        navigate(`/documents/${document.id}`);
    };

    const handleHistory = () => {
        navigate(`/documents/${document.id}/history`);
    };

    const handleSettings = () => {
        navigate(`/documents/${document.id}/settings`);
    };

    const handleAnalytics = () => {
        navigate(`/documents/${document.id}/analytics`);
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            setIsDeleting(true);
            setError(null);

            try {
                await deleteDocument(document.id);
                onDocumentDeleted();
            } catch (err: any) {
                setError(err.message || 'Failed to delete document');
            } finally {
                setIsDeleting(false);
                setIsMenuOpen(false);
            }
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            <Link to={`/documents/${document.id}`} className="hover:text-indigo-600">
                                {document.title}
                            </Link>
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                            {document.snippet}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(document.updated_at)}</div>
                <div className="text-xs text-gray-500">Version {document.version}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {document.collaborators_count > 0 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {document.collaborators_count} {document.collaborators_count === 1 ? 'collaborator' : 'collaborators'}
                    </span>
                ) : (
                    <span className="text-sm text-gray-500">No collaborators</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <button
                    onClick={toggleMenu}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                >
                    <span className="sr-only">Open options</span>
                    <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <button
                            onClick={() => {
                                handleEdit();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                handleHistory();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Version History
                        </button>
                        <button
                            onClick={() => {
                                handleSettings();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Settings
                        </button>
                        <button
                            onClick={() => {
                                handleAnalytics();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Analytics
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="absolute right-0 mt-2 w-48 text-xs text-red-600 bg-red-50 p-2 rounded shadow">
                        {error}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default DocumentCard;