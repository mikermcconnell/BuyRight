/**
 * Application Constants
 * Central place for all magic numbers and configuration values
 */

// Authentication & Security
export const AUTH_CONSTANTS = {
  DEFAULT_TOKEN_LENGTH: 32,
  SESSION_EXPIRY_CHECK_MINUTES: 60, // 1000 * 60 milliseconds
  PASSWORD_MIN_LENGTH: 6,
  HTTP_STATUS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
  },
} as const;

// Financial Calculations
export const FINANCIAL_CONSTANTS = {
  // Debt-to-Income Ratios (percentages)
  MAX_DEBT_TO_INCOME_RATIO: 36,
  
  // Property costs (percentage of home price)
  INSURANCE_RATE: 0.003, // 0.3% of home price
  
  // Fixed costs (in dollars)
  ESTIMATED_LEGAL_FEES: 1500,
  
  // Tax rates (percentage)
  PERCENTAGE_DIVISOR: 100,
  
  // Default completion percentages
  DEFAULT_COMPLETION_PERCENTAGE: 100,
} as const;

// User Interface
export const UI_CONSTANTS = {
  // Progress tracking
  ACHIEVEMENT_THRESHOLDS: {
    CRUSHING_IT: 5,
    GREAT_PROGRESS: 3,
    NICE_START: 1,
  },
  
  // Animation durations (milliseconds)
  PROGRESS_BAR_DURATION: 1000,
  BUTTON_TRANSITION_DURATION: 200,
  CARD_TRANSITION_DURATION: 300,
  
  // Component dimensions
  TOUCH_TARGET_MIN_SIZE: 44, // px - minimum touch target size
  
  // Loading states
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;

// Regional Configuration
export const REGIONAL_CONSTANTS = {
  // Default region fallbacks
  DEFAULT_REGION: 'ON',
  
  // Tax calculation defaults
  DEFAULT_TAX_RATE: 0,
  
  // Currency formatting
  DEFAULT_CURRENCY: 'CAD',
  CURRENCY_LOCALES: {
    CA: 'en-CA',
    US: 'en-US',
  },
} as const;

// Journey & Steps
export const JOURNEY_CONSTANTS = {
  // Step completion tracking
  MAX_UNLOCK_ITERATIONS: 20, // Safety limit for step unlocking
  
  // Step statuses
  STEP_STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
  },
  
  // Phase IDs (commonly used for navigation)
  PHASES: {
    PREPARATION: 'preparation',
    SEARCHING: 'searching', 
    BUYING: 'buying',
    MOVING: 'moving',
  },
} as const;

// Logging & Monitoring
export const LOGGING_CONSTANTS = {
  // Log retention
  MAX_LOGS_IN_MEMORY: 1000,
  
  // Log levels
  LOG_LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
} as const;

// API & Network
export const API_CONSTANTS = {
  // Timeouts (milliseconds)
  DEFAULT_TIMEOUT: 120000, // 2 minutes
  MAX_TIMEOUT: 600000, // 10 minutes
  
  // Retry attempts
  MAX_RETRY_ATTEMPTS: 3,
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// File & Data
export const DATA_CONSTANTS = {
  // File sizes
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  
  // Text limits
  MAX_NOTES_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Error Handling
export const ERROR_CONSTANTS = {
  // Error IDs
  ERROR_ID_PREFIX: 'buyright-error',
  
  // Retry delays (milliseconds)
  RETRY_DELAYS: [1000, 2000, 4000], // Exponential backoff
  
  // Error types
  ERROR_TYPES: {
    NETWORK: 'network',
    VALIDATION: 'validation',
    AUTHENTICATION: 'authentication',
    PERMISSION: 'permission',
    UNKNOWN: 'unknown',
  },
} as const;

// Export type definitions for TypeScript
export type AuthConstants = typeof AUTH_CONSTANTS;
export type FinancialConstants = typeof FINANCIAL_CONSTANTS;
export type UIConstants = typeof UI_CONSTANTS;
export type RegionalConstants = typeof REGIONAL_CONSTANTS;
export type JourneyConstants = typeof JOURNEY_CONSTANTS;
export type LoggingConstants = typeof LOGGING_CONSTANTS;
export type ApiConstants = typeof API_CONSTANTS;
export type DataConstants = typeof DATA_CONSTANTS;
export type ErrorConstants = typeof ERROR_CONSTANTS;