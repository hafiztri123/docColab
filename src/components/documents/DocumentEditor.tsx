// src/components/documents/DocumentEditor.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById, updateDocument, createDocument } from '../../services/documentService';
import { useWebSocket } from '../../services/websocketService';
import { Document, DocumentUpdateRequest } from '../../types/document.types';
import { debounce } from 'lodash';
import markdownIt from 'markdown-it';

interface DocumentEditorProps {
    isNew?: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ isNew = false }) => {
    const { id } = useParams<{ id: string }>();
    const [document, setDocument] = useState<Document | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [activeCursors, setActiveCursors] = useState<Record<string, any>>({});

    const contentRef = useRef<HTMLTextAreaElement>(null);
    const md = useRef(markdownIt());
    const navigate = useNavigate();

    // WebSocket connection for real-time collaboration (only for existing documents)
    const { status: wsStatus, onMessage, sendCursorPosition, sendDocumentUpdate } =
        useWebSocket(id || '');

    // Fetch document data if editing existing document
    useEffect(() => {
        if (isNew) {
            setTitle('Untitled Document');
            setContent('');
            setIsLoading(false);
            return;
        }

        if (!id) {
            setError('Document ID is required');
            setIsLoading(false);
            return;
        }

        const fetchDocument = async () => {
            try {
                const doc = await getDocumentById(id);
                setDocument(doc);
                setTitle(doc.title);
                setContent(doc.content || '');
                setCollaborators(doc.collaborators || []);
            } catch (err: any) {
                setError(err.message || 'Failed to load document');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [id, isNew]);

    // Handle real-time updates from other users
    useEffect(() => {
        if (isNew || !id) return;

        // Listen for document updates from other users
        const removeUpdateListener = onMessage('update', (message) => {
            if (message.document_id === id && message.user?.id !== document?.owner_id) {
                // Apply patches to document
                // In a real implementation, you would use something like json-patch or a CRDT library
                // For this example, we'll simply update the entire content
                if (message.patches && message.patches.length > 0) {
                    const contentPatch = message.patches.find((p: any) => p.path === '/content');
                    if (contentPatch && contentPatch.value !== content) {
                        setContent(contentPatch.value);
                    }
                }
            }
        });

        // Listen for cursor position updates from other users
        const removeCursorListener = onMessage('cursor', (message) => {
            if (message.document_id === id && message.user?.id !== document?.owner_id) {
                setActiveCursors((prev) => ({
                    ...prev,
                    [message.user.id]: {
                        position: message.position,
                        user: message.user,
                        timestamp: new Date().getTime()
                    }
                }));
            }
        });

        return () => {
            removeUpdateListener();
            removeCursorListener();
        };
    }, [id, isNew, document, content, onMessage]);

    // Clean up cursors after inactivity
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            setActiveCursors((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((userId) => {
                    // Remove cursor after 10 seconds of inactivity
                    if (now - updated[userId].timestamp > 10000) {
                        delete updated[userId];
                    }
                });
                return updated;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Save document (debounced to prevent too many requests)
    const saveDocument = useCallback(
        debounce(async (docTitle: string, docContent: string) => {
            if (isNew && !id) {
                setIsSaving(true);
                try {
                    const newDoc = await createDocument({
                        title: docTitle,
                        content: docContent,
                        is_public: false
                    });
                    setDocument(newDoc);
                    setLastSavedAt(new Date());
                    // Redirect to the edit page for the new document
                    navigate(`/documents/${newDoc.id}`, { replace: true });
                } catch (err: any) {
                    setError(err.message || 'Failed to create document');
                } finally {
                    setIsSaving(false);
                }
            } else if (id) {
                setIsSaving(true);
                try {
                    const updateData: DocumentUpdateRequest = {
                        title: docTitle,
                        content: docContent
                    };

                    const updatedDoc = await updateDocument(id, updateData);
                    setDocument(updatedDoc);
                    setLastSavedAt(new Date());

                    // Send update to collaborators
                    if (document) {
                        sendDocumentUpdate(updatedDoc.version, [
                            {
                                op: 'replace',
                                path: '/content',
                                value: docContent
                            }
                        ]);
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to save document');
                } finally {
                    setIsSaving(false);
                }
            }
        }, 1000),
        [id, isNew, document, navigate, sendDocumentUpdate]
    );

    // Handle content changes
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        saveDocument(title, newContent);

        // Send cursor position for collaboration
        if (!isNew && id && contentRef.current) {
            const textarea = contentRef.current;
            const cursorPosition = {
                line: textarea.value.substr(0, textarea.selectionStart).split('\n').length - 1,
                column: textarea.selectionStart - textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) - 1
            };
            sendCursorPosition(cursorPosition);
        }
    };

    // Handle title changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        saveDocument(newTitle, content);
    };

    // Toggle between edit and preview modes
    const togglePreviewMode = () => {
        setPreviewMode(!previewMode);
    };

    // Render collaborator cursors (simplified - in a real implementation, you would calculate exact positions)
    const renderCollaboratorCursors = () => {
        return Object.values(activeCursors).map((cursor) => (
            <div
                key={cursor.user.id}
                className="absolute pointer-events-none"
                style={{
                    top: `${cursor.position.line * 24}px`,
                    left: `${cursor.position.column * 8}px`
                }}
            >
                <div
                    className="w-2 h-5 animate-pulse"
                    style={{ backgroundColor: cursor.user.color || '#4287f5' }}
                ></div>
                <div
                    className="absolute top-0 left-2 px-2 py-1 text-xs text-white rounded-sm whitespace-nowrap"
                    style={{ backgroundColor: cursor.user.color || '#4287f5' }}
                >
                    {cursor.user.name}
                </div>
            </div>
        ));
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-full">
            {/* Editor Header */}
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
                <div className="flex-1">
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full text-xl font-bold border-0 focus:outline-none focus:ring-0 bg-transparent"
                        placeholder="Document Title"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    {/* Collaboration status */}
                    <div className="text-sm text-gray-500">
                        {!isNew && wsStatus === 'connected' ? (
                            <span className="flex items-center text-green-600">
                                <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                                Collaborating
                            </span>
                        ) : !isNew && wsStatus === 'connecting' ? (
                            <span className="flex items-center text-yellow-600">
                                <span className="h-2 w-2 bg-yellow-600 rounded-full mr-2"></span>
                                Connecting...
                            </span>
                        ) : !isNew ? (
                            <span className="flex items-center text-red-600">
                                <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                                Offline
                            </span>
                        ) : null}
                    </div>

                    {/* Last saved status */}
                    <div className="text-sm text-gray-500">
                        {isSaving ? (
                            <span>Saving...</span>
                        ) : lastSavedAt ? (
                            <span>
                                Saved at {lastSavedAt.toLocaleTimeString()}
                            </span>
                        ) : null}
                    </div>

                    {/* Preview toggle */}
                    <button
                        onClick={togglePreviewMode}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${previewMode
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </div>

            {/* Document content */}
            <div className="relative p-6 h-[calc(100vh-12rem)] overflow-auto">
                {previewMode ? (
                    <div
                        className="prose prose-indigo max-w-none h-full"
                        dangerouslySetInnerHTML={{ __html: md.current.render(content) }}
                    />
                ) : (
                    <div className="relative h-full">
                        <textarea
                            ref={contentRef}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Start writing your document here... (Markdown is supported)"
                            className="w-full h-full px-4 py-3 font-mono text-gray-800 border-0 focus:outline-none focus:ring-0 resize-none"
                            spellCheck="true"
                        />
                        {/* Render collaborator cursors */}
                        {renderCollaboratorCursors()}
                    </div>
                )}
            </div>

            {/* Collaborators list */}
            {!isNew && collaborators.length > 0 && (
                <div className="border-t px-6 py-3 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Collaborators
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {collaborators.map((collaborator) => (
                            <div
                                key={collaborator.id}
                                className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                            >
                                <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-1">
                                    {collaborator.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{collaborator.user.name}</span>
                                <span className="ml-1 text-gray-500">({collaborator.permission})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentEditor;