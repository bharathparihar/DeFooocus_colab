import { useState } from 'react';
import { validation, getValidationError } from '@/utils/validation';

export interface ValidationErrors {
    [key: string]: string;
}

/**
 * Custom hook for form validation
 */
export function useFormValidation() {
    const [errors, setErrors] = useState<ValidationErrors>({});

    /**
     * Validate a single field
     */
    const validateField = (
        fieldName: string,
        value: any,
        rules: {
            type?: 'email' | 'phone' | 'url' | 'price' | 'whatsapp';
            required?: boolean;
            minLength?: number;
            maxLength?: number;
            custom?: (value: any) => boolean;
            customMessage?: string;
        }
    ): boolean => {
        // Check required
        if (rules.required && !validation.required(String(value))) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: getValidationError(fieldName, 'required'),
            }));
            return false;
        }

        // Check type-specific validation
        if (rules.type && value) {
            const isValid = validation[rules.type](value);
            if (!isValid) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: getValidationError(fieldName, rules.type!),
                }));
                return false;
            }
        }

        // Check minLength
        if (rules.minLength && !validation.minLength(String(value), rules.minLength)) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: getValidationError(fieldName, 'minLength', rules.minLength),
            }));
            return false;
        }

        // Check maxLength
        if (rules.maxLength && !validation.maxLength(String(value), rules.maxLength)) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: getValidationError(fieldName, 'maxLength', rules.maxLength),
            }));
            return false;
        }

        // Check custom validation
        if (rules.custom && !rules.custom(value)) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: rules.customMessage || `Invalid ${fieldName}`,
            }));
            return false;
        }

        // Clear error if valid
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });

        return true;
    };

    /**
     * Validate multiple fields at once
     */
    const validateForm = (
        fields: {
            name: string;
            value: any;
            rules: Parameters<typeof validateField>[2];
        }[]
    ): boolean => {
        let isValid = true;
        const newErrors: ValidationErrors = {};

        fields.forEach(field => {
            const fieldValid = validateField(field.name, field.value, field.rules);
            if (!fieldValid) {
                isValid = false;
            }
        });

        return isValid;
    };

    /**
     * Clear all errors
     */
    const clearErrors = () => {
        setErrors({});
    };

    /**
     * Clear error for specific field
     */
    const clearError = (fieldName: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    /**
     * Set custom error
     */
    const setError = (fieldName: string, message: string) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: message,
        }));
    };

    return {
        errors,
        validateField,
        validateForm,
        clearErrors,
        clearError,
        setError,
        hasErrors: Object.keys(errors).length > 0,
    };
}
