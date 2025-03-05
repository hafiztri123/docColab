// src/components/dashboard/RecentDocuments.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentListItem } from '../../types/document.types';
import { formatDate } from '../../utils/formatters';

interface RecentDocumentsProps {
    documents: DocumentListItem[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
    return (
        <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
                <li key={doc.id} className="p-4 hover:bg-gray-50">
                    <Link to={`/documents/${doc.id}`} className="block">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                        {doc.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(doc.updated_at)}
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                        {doc.snippet}
                                    </p>
                                    <div className="flex items-center">
                                        {doc.is_public && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                Public
                                            </span>
                                        )}
                                        {doc.collaborators_count > 0 && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {doc.collaborators_count} {doc.collaborators_count === 1 ? 'collaborator' : 'collaborators'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default RecentDocuments;