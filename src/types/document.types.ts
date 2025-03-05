// src/types/document.types.ts
export interface DocumentListItem {
    id: string;
    title: string;
    snippet: string;
    version: number;
    is_public: boolean;
    owner_id: string;
    collaborators_count: number;
    created_at: string;
    updated_at: string;
}

export interface Collaborator {
    id: string;
    document_id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    permission: 'read' | 'write';
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    title: string;
    content: string;
    version: number;
    is_public: boolean;
    owner_id: string;
    created_at: string;
    updated_at: string;
    collaborators?: Collaborator[];
}

export interface DocumentCreateRequest {
    title: string;
    content?: string;
    is_public?: boolean;
}

export interface DocumentUpdateRequest {
    title?: string;
    content?: string;
    is_public?: boolean;
}

export interface DocumentHistoryItem {
    version: number;
    content: string;
    updated_by: {
        id: string;
        name: string;
    };
    updated_at: string;
}

export interface DocumentHistoryResponse {
    data: DocumentHistoryItem[];
    pagination: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
    };
}

export interface DocumentListResponse {
    data: DocumentListItem[];
    pagination: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
    };
}