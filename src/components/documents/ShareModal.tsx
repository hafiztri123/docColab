// src/components/documents/ShareModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    shareDocument,
    updateCollaboratorPermission,
    removeCollaborator
} from '../../services/documentService';
import { Document } from '../../types/document.types';

interface ShareModalProps {
    document: Document;
    isOpen: boolean;
    onClose: () => void;
    onDocumentUpdated: (updatedDoc: Document) => void;
}

interface ShareFormInputs {
    email: string;
    permission: 'read' | 'write';
}

const ShareModal: React.FC<ShareModalProps> = ({
    document,
    isOpen,
    onClose,
    onDocumentUpdated
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ShareFormInputs>({
        defaultValues: {
            permission: 'read'
        }
    });

    // Handle share form submission
    const onSubmit = async (data: ShareFormInputs) => {
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        try {
            const result = await shareDocument(document.id, data.email, data.permission);

            // Update the local document with the new collaborator
            const updatedDoc = {
                ...document,
                collaborators: [...(document.collaborators || []), result]
            };

            onDocumentUpdated(updatedDoc);
            setSuccessMessage(`Document shared with ${data.email}`);
            reset({ email: '', permission: 'read' });
        } catch (error: any) {
            setApiError(error.message || 'Failed to share document');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle permission change for a collaborator
    const handlePermissionChange = async (collaboratorId: string, userId: string, newPermission: 'read' | 'write') => {
        try {
            const result = await updateCollaboratorPermission(document.id, userId, newPermission);

            // Update the local document with the updated collaborator
            const updatedCollaborators = document.collaborators?.map(c =>
                c.id === collaboratorId ? result : c
            );

            const updatedDoc = {
                ...document,
                collaborators: updatedCollaborators
            };

            onDocumentUpdated(updatedDoc);
            setSuccessMessage(`Permission updated for ${result.user.email}`);
        } catch (error: any) {
            setApiError(error.message || 'Failed to update permission');
        }
    };

    // Handle removing a collaborator
    const handleRemoveCollaborator = async (collaboratorId: string, userId: string, userName: string) => {
        if (!confirm(`Remove ${userName} from this document?`)) {
            return;
        }

        try {
            await removeCollaborator(document.id, userId);

            // Update the local document by removing the collaborator
            const updatedCollaborators = document.collaborators?.filter(c => c.id !== collaboratorId);

            const updatedDoc = {
                ...document,
                collaborators: updatedCollaborators
            };

            onDocumentUpdated(updatedDoc);
            setSuccessMessage(`${userName} removed from document`);
        } catch (error: any) {
            setApiError(error.message || 'Failed to remove collaborator');
        }
    };

    // Copy shareable link
    const handleCopyLink = () => {
        const link = `${window.location.origin}/documents/view/${document.id}`;
        navigator.clipboard.writeText(link);
        setSuccessMessage('Link copied to clipboard');
    };

    // Toggle public access
    const handleTogglePublic = () => {
        // This would typically be handled via an API call to update the document
        alert('In a real implementation, this would toggle public access.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" onClick={onClose}></div>

                {/* Modal panel */}
                <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Share "{document.title}"
                                </h3>

                                {/* Status messages */}
                                {apiError && (
                                    <div className="mt-2 p-2 text-sm text-red-800 bg-red-100 rounded">
                                        {apiError}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="mt-2 p-2 text-sm text-green-800 bg-green-100 rounded">
                                        {successMessage}
                                    </div>
                                )}

                                {/* Share form */}
                                <div className="mt-4">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex items-end space-x-2">
                                            <div className="flex-1">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                                    placeholder="colleague@example.com"
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Invalid email address'
                                                        }
                                                    })}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="permission" className="block text-sm font-medium text-gray-700">
                                                    Permission
                                                </label>
                                                <select
                                                    id="permission"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    {...register('permission')}
                                                >
                                                    <option value="read">Can view</option>
                                                    <option value="write">Can edit</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sharing...' : 'Share'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Public access toggle */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="flex-grow flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">Public access</span>
                                            <span className="text-sm text-gray-500">
                                                Anyone with the link can {document.is_public ? 'view' : 'not access'} this document
                                            </span>
                                        </span>
                                        <button
                                            onClick={handleTogglePublic}
                                            type="button"
                                            className={`${document.is_public ? 'bg-indigo-600' : 'bg-gray-200'
                                                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                            aria-pressed={document.is_public}
                                        >
                                            <span className="sr-only">Toggle public access</span>
                                            <span
                                                className={`${document.is_public ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                            >
                                                <span
                                                    className={`${document.is_public
                                                            ? 'opacity-0 ease-out duration-100'
                                                            : 'opacity-100 ease-in duration-200'
                                                        } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                                    aria-hidden="true"
                                                >
                                                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                        <path
                                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <span
                                                    className={`${document.is_public
                                                            ? 'opacity-100 ease-in duration-200'
                                                            : 'opacity-0 ease-out duration-100'
                                                        } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                                    aria-hidden="true"
                                                >
                                                    <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                    </svg>
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Link sharing */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="flex-grow flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">Get shareable link</span>
                                        </span>
                                        <button
                                            onClick={handleCopyLink}
                                            type="button"
                                            className="inline-flex justify-center px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>

                                {/* Collaborators list */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900">People with access</h4>
                                    <ul className="mt-3 divide-y divide-gray-100">
                                        {/* Document owner */}
                                        <li className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
                                                        {document.owner_id.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">You (Owner)</p>
                                                    <p className="text-sm text-gray-500">Full access</p>
                                                </div>
                                            </div>
                                        </li>

                                        {/* Collaborators */}
                                        {document.collaborators?.map((collaborator) => (
                                            <li key={collaborator.id} className="py-3 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium text-sm">
                                                            {collaborator.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{collaborator.user.name}</p>
                                                        <p className="text-sm text-gray-500">{collaborator.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={collaborator.permission}
                                                        onChange={(e) =>
                                                            handlePermissionChange(
                                                                collaborator.id,
                                                                collaborator.user.id,
                                                                e.target.value as 'read' | 'write'
                                                            )
                                                        }
                                                        className="block border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option value="read">Can view</option>
                                                        <option value="write">Can edit</option>
                                                    </select>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveCollaborator(
                                                                collaborator.id,
                                                                collaborator.user.id,
                                                                collaborator.user.name
                                                            )
                                                        }
                                                        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                                                    >
                                                        <span className="sr-only">Remove user</span>
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;