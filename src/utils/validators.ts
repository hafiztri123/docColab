// src/utils/validators.ts
/**
 * Email validation using regex
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

/**
 * Password validation (at least 8 characters, alphanumeric)
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

/**
 * Validate document title (not empty, reasonable length)
 */
export const isValidDocumentTitle = (title: string): boolean => {
    return title.trim().length > 0 && title.length <= 100;
};
