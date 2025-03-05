// src/services/documentService.ts
import api from './api';
import {
    Document,
    DocumentCreateRequest,
    DocumentUpdateRequest,
    DocumentListResponse,
    DocumentHistoryResponse,
    DocumentAnalyticsResponse
} from '../types/document.types';

export const getDocuments = async (
    page = 1,
    perPage = 20,
    sortBy = 'updated_at',
    sortDir = 'desc',
    searchQuery = ''
): Promise<DocumentListResponse> => {
    const params = { page, per_page: perPage, sort_by: sortBy, sort_dir: sortDir };

    if (searchQuery) {
        Object.assign(params, { q: searchQuery });
    }

    const response = await api.get<DocumentListResponse>('/documents', { params });
    return response.data;
};

export const getDocumentById = async (id: string): Promise<Document> => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
};

export const createDocument = async (documentData: DocumentCreateRequest): Promise<Document> => {
    const response = await api.post<Document>('/documents', documentData);
    return response.data;
};

export const updateDocument = async (id: string, documentData: DocumentUpdateRequest): Promise<Document> => {
    const response = await api.put<Document>(`/documents/${id}`, documentData);
    return response.data;
};

export const deleteDocument = async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
};

export const getDocumentHistory = async (
    id: string,
    page = 1,
    perPage = 20
): Promise<DocumentHistoryResponse> => {
    const response = await api.get<DocumentHistoryResponse>(`/documents/${id}/history`, {
        params: { page, per_page: perPage }
    });
    return response.data;
};

export const restoreDocumentVersion = async (id: string, version: number): Promise<Document> => {
    const response = await api.post<Document>(`/documents/${id}/history/${version}`);
    return response.data;
};

export const getDocumentAnalytics = async (
    id: string,
    period = 'month'
): Promise<DocumentAnalyticsResponse> => {
    const response = await api.get<DocumentAnalyticsResponse>(`/documents/${id}/analytics`, {
        params: { period }
    });
    return response.data;
};

export const shareDocument = async (
    id: string,
    userEmail: string,
    permission: 'read' | 'write'
): Promise<any> => {
    const response = await api.post(`/documents/${id}/share`, {
        user_email: userEmail,
        permission
    });
    return response.data;
};

export const updateCollaboratorPermission = async (
    documentId: string,
    userId: string,
    permission: 'read' | 'write'
): Promise<any> => {
    const response = await api.put(`/documents/${documentId}/share/${userId}`, {
        permission
    });
    return response.data;
};

export const removeCollaborator = async (
    documentId: string,
    userId: string
): Promise<void> => {
    await api.delete(`/documents/${documentId}/share/${userId}`);
};