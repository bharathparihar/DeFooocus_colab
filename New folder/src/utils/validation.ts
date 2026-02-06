/**
 * Form validation utilities
 */

export const validation = {
    /**
     * Validate email address
     */
    email: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    /**
     * Validate phone number (supports various formats)
     */
    phone: (phone: string): boolean => {
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, '');
        // Check if it has at least 10 digits
        return digitsOnly.length >= 10;
    },

    /**
     * Validate required field
     */
    required: (value: string): boolean => {
        return value.trim().length > 0;
    },

    /**
     * Validate URL
     */
    url: (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate price (must be positive number)
     */
    price: (price: number | string): boolean => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numPrice) && numPrice >= 0;
    },

    /**
     * Validate minimum length
     */
    minLength: (value: string, min: number): boolean => {
        return value.trim().length >= min;
    },

    /**
     * Validate maximum length
     */
    maxLength: (value: string, max: number): boolean => {
        return value.trim().length <= max;
    },

    /**
     * Validate WhatsApp number (must start with country code)
     */
    whatsapp: (number: string): boolean => {
        const digitsOnly = number.replace(/\D/g, '');
        // Should have country code + at least 10 digits
        return digitsOnly.length >= 11 && digitsOnly.length <= 15;
    },
};

/**
 * Get error message for validation failure
 */
export const getValidationError = (
    field: string,
    type: keyof typeof validation,
    ...args: any[]
): string => {
    const messages: Record<string, string> = {
        email: `Please enter a valid email address`,
        phone: `Please enter a valid phone number`,
        required: `${field} is required`,
        url: `Please enter a valid URL`,
        price: `Please enter a valid price`,
        minLength: `${field} must be at least ${args[0]} characters`,
        maxLength: `${field} must be at most ${args[0]} characters`,
        whatsapp: `Please enter a valid WhatsApp number with country code`,
    };

    return messages[type] || `Invalid ${field}`;
};
