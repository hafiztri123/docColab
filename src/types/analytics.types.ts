// src/types/analytics.types.ts
export interface TimelineItem {
    date: string;
    views: number;
    edits: number;
}

export interface UserAnalytics {
    documents: {
        total: number;
        created: number;
        collaborated: number;
    };
    activity: {
        views: number;
        edits: number;
        timeline: TimelineItem[];
    };
    most_active_documents: {
        id: string;
        title: string;
        views: number;
        edits: number;
    }[];
}

export interface DocumentAnalytics {
    views: {
        total: number;
        unique_users: number;
        timeline: {
            date: string;
            count: number;
        }[];
    };
    edits: {
        total: number;
        by_users: {
            user_id: string;
            user_name: string;
            count: number;
        }[];
        timeline: {
            date: string;
            count: number;
        }[];
    };
}