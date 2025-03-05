
// src/utils/errorHandler.ts
/**
 * Format API error to human-readable message
 */
export const formatApiError = (error: any): string => {
    if (error.message) {
        return error.message;
    }

    if (error.response?.data?.error?.message) {
        return error.response.data.error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

/**
 * Convert API validation errors to form errors format
 */
export const apiErrorToFormErrors = (apiError: any): Record<string, string> => {
    const formErrors: Record<string, string> = {};

    if (apiError.details && typeof apiError.details === 'string') {
        // Example: "Key: 'UserRegistration.Email' Error:Field validation for 'Email' failed on the 'required' tag"
        const matches = apiError.details.match(/Key: '.*?\.(\w+)' Error:(.*)/);
        if (matches && matches.length > 2) {
            const field = matches[1].toLowerCase();
            const message = matches[2].trim();
            formErrors[field] = message;
        }
    }

    return formErrors;
};