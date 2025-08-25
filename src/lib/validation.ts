/**
 * Input validation and sanitization utilities for BuyRight application
 * Provides comprehensive security functions for user input handling
 */

import DOMPurify from 'isomorphic-dompurify';

// Configuration for DOMPurify
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [], // No HTML tags allowed by default
  ALLOWED_ATTR: [],
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
};

/**
 * Sanitizes text input by removing HTML tags and dangerous characters
 * @param input - Raw text input from user
 * @param options - Optional configuration for sanitization
 * @returns Sanitized text string
 */
export function sanitizeTextInput(
  input: string | null | undefined,
  options: {
    maxLength?: number;
    allowNewlines?: boolean;
    allowSpecialChars?: boolean;
  } = {}
): string {
  // Handle null/undefined inputs
  if (input == null) return '';
  
  // Convert to string if not already
  let sanitized = String(input);
  
  // Remove HTML tags using DOMPurify
  sanitized = DOMPurify.sanitize(sanitized, PURIFY_CONFIG);
  
  // Remove potentially dangerous characters
  if (!options.allowSpecialChars) {
    // Remove script-injection characters
    sanitized = sanitized.replace(/[<>'"&]/g, '');
    // Remove other potentially dangerous chars
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  }
  
  // Handle newlines
  if (!options.allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  }
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Apply length limit
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitizes email input to ensure valid email format
 * @param email - Email string to validate
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmailInput(email: string | null | undefined): string {
  if (email == null) return '';
  
  const sanitized = sanitizeTextInput(email, { maxLength: 254 });
  
  // Basic email regex validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes URL input to ensure safe URLs
 * @param url - URL string to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrlInput(url: string | null | undefined): string {
  if (url == null) return '';
  
  const sanitized = sanitizeTextInput(url, { maxLength: 2048 });
  
  // Only allow http/https URLs
  const urlRegex = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  
  return urlRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes numeric input and converts to number
 * @param input - Numeric input to sanitize
 * @param options - Validation options
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumericInput(
  input: string | number | null | undefined,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number | null {
  if (input == null) return null;
  
  let num: number;
  
  if (typeof input === 'string') {
    // Remove non-numeric characters except decimal point and minus
    const cleaned = input.replace(/[^\d.-]/g, '');
    num = parseFloat(cleaned);
  } else {
    num = input;
  }
  
  // Check if valid number
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  // Apply integer constraint
  if (options.integer) {
    num = Math.round(num);
  }
  
  // Apply min/max constraints
  if (options.min !== undefined && num < options.min) {
    return null;
  }
  if (options.max !== undefined && num > options.max) {
    return null;
  }
  
  return num;
}

/**
 * Sanitizes and validates phone number input
 * @param phone - Phone number string
 * @returns Sanitized phone number or empty string if invalid
 */
export function sanitizePhoneInput(phone: string | null | undefined): string {
  if (phone == null) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Basic North American phone number validation (10-11 digits)
  if (digits.length === 10) {
    return digits;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }
  
  return '';
}

/**
 * Sanitizes file path to prevent directory traversal attacks
 * @param path - File path to sanitize
 * @returns Safe file path or empty string if invalid
 */
export function sanitizeFilePathInput(path: string | null | undefined): string {
  if (path == null) return '';
  
  let sanitized = sanitizeTextInput(path, { maxLength: 255 });
  
  // Remove directory traversal patterns
  sanitized = sanitized.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[/\\]/g, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');
  
  return sanitized;
}

/**
 * Validates and sanitizes form data object
 * @param formData - Object containing form fields
 * @param schema - Validation schema
 * @returns Sanitized form data
 */
export function sanitizeFormData<T extends Record<string, any>>(
  formData: T,
  schema: {
    [K in keyof T]: {
      type: 'text' | 'email' | 'url' | 'number' | 'phone' | 'file';
      required?: boolean;
      maxLength?: number;
      min?: number;
      max?: number;
      integer?: boolean;
      allowNewlines?: boolean;
      allowSpecialChars?: boolean;
    };
  }
): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    const fieldSchema = schema[key as keyof T];
    
    if (!fieldSchema) {
      continue; // Skip unknown fields
    }
    
    let sanitizedValue: any;
    
    switch (fieldSchema.type) {
      case 'text':
        sanitizedValue = sanitizeTextInput(value, {
          maxLength: fieldSchema.maxLength,
          allowNewlines: fieldSchema.allowNewlines,
          allowSpecialChars: fieldSchema.allowSpecialChars,
        });
        break;
        
      case 'email':
        sanitizedValue = sanitizeEmailInput(value);
        break;
        
      case 'url':
        sanitizedValue = sanitizeUrlInput(value);
        break;
        
      case 'number':
        sanitizedValue = sanitizeNumericInput(value, {
          min: fieldSchema.min,
          max: fieldSchema.max,
          integer: fieldSchema.integer,
        });
        break;
        
      case 'phone':
        sanitizedValue = sanitizePhoneInput(value);
        break;
        
      case 'file':
        sanitizedValue = sanitizeFilePathInput(value);
        break;
        
      default:
        sanitizedValue = sanitizeTextInput(value);
    }
    
    // Check required fields
    if (fieldSchema.required && (sanitizedValue == null || sanitizedValue === '')) {
      throw new Error(`Field '${key}' is required and cannot be empty`);
    }
    
    // Only include non-empty values
    if (sanitizedValue != null && sanitizedValue !== '') {
      sanitized[key as keyof T] = sanitizedValue;
    }
  }
  
  return sanitized;
}

/**
 * Security validation for API route inputs
 * @param input - Input object to validate
 * @param allowedFields - Array of allowed field names
 * @returns Validated input object
 */
export function validateApiInput(
  input: Record<string, any>,
  allowedFields: string[]
): Record<string, any> {
  const validated: Record<string, any> = {};
  
  for (const field of allowedFields) {
    if (field in input) {
      // Basic sanitization for all API inputs
      validated[field] = sanitizeTextInput(input[field], {
        maxLength: 10000, // Generous limit for API data
        allowNewlines: true,
        allowSpecialChars: true,
      });
    }
  }
  
  return validated;
}

/**
 * Rate limiting helper for API routes
 */
export class RateLimiter {
  private requests = new Map<string, number[]>();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  /**
   * Check if request is within rate limit
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns True if within limit, false if rate limited
   */
  isWithinLimit(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Export a default rate limiter instance
export const defaultRateLimiter = new RateLimiter();

/**
 * Financial calculator validation functions
 * These functions validate common financial inputs and return validation results
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedValue?: number;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates income input
 */
export function validateIncome(income: number): ValidationResult {
  const sanitized = sanitizeNumericInput(income, {
    min: 10000,
    max: 10000000,
    integer: true,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Income must be between $10,000 and $10,000,000',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates debt amount input
 */
export function validateDebtAmount(debt: number): ValidationResult {
  const sanitized = sanitizeNumericInput(debt, {
    min: 0,
    max: 50000,
    integer: true,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Monthly debt must be between $0 and $50,000',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates interest rate input
 */
export function validateInterestRate(rate: number): ValidationResult {
  const sanitized = sanitizeNumericInput(rate, {
    min: 0.1,
    max: 25,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Interest rate must be between 0.1% and 25%',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates home price input
 */
export function validateHomePrice(price: number): ValidationResult {
  const sanitized = sanitizeNumericInput(price, {
    min: 50000,
    max: 50000000,
    integer: true,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Home price must be between $50,000 and $50,000,000',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates down payment input
 */
export function validateDownPayment(downPayment: number, homePrice?: number): ValidationResult {
  const sanitized = sanitizeNumericInput(downPayment, {
    min: 1000,
    max: 500000,
    integer: true,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Down payment must be between $1,000 and $500,000',
    };
  }

  // If home price is provided, validate down payment percentage
  if (homePrice && sanitized > homePrice) {
    return {
      valid: false,
      error: 'Down payment cannot exceed home price',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates loan term input
 */
export function validateLoanTerm(term: number): ValidationResult {
  const sanitized = sanitizeNumericInput(term, {
    min: 5,
    max: 40,
    integer: true,
  });

  if (sanitized === null) {
    return {
      valid: false,
      error: 'Loan term must be between 5 and 40 years',
    };
  }

  return {
    valid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates step ID format for journey steps
 */
export function validateStepId(stepId: string): ValidationResult {
  if (!stepId || typeof stepId !== 'string') {
    return {
      valid: false,
      error: 'Step ID must be a non-empty string',
    };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(stepId)) {
    return {
      valid: false,
      error: 'Step ID format is invalid. Only alphanumeric characters, hyphens, and underscores are allowed',
    };
  }

  return {
    valid: true,
    sanitizedValue: stepId as any, // Step ID is already a string, no numeric conversion needed
  };
}