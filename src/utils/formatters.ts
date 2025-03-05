// src/utils/formatters.ts
/**
 * Format date to a more readable format (e.g., "Feb 15, 2025")
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Format time to a readable format (e.g., "2:30 PM")
 */
export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Format date and time together (e.g., "Feb 15, 2025 at 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

/**
 * Truncate text to a specified length and add ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};


