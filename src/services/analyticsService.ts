// src/services/analyticsService.ts
import api from './api';
import { UserAnalytics, DocumentAnalytics } from '../types/analytics.types';

export const getUserAnalytics = async (
    period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<UserAnalytics> => {
    const response = await api.get<UserAnalytics>('/users/me/analytics', {
        params: { period }
    });
    return response.data;
};

export const getDocumentAnalytics = async (
    documentId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<DocumentAnalytics> => {
    const response = await api.get<DocumentAnalytics>(`/documents/${documentId}/analytics`, {
        params: { period }
    });
    return response.data;
};