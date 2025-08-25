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
  MAX_HOUSING_RATIO: 28,
  
  // Property costs (percentage of home price)
  INSURANCE_RATE: 0.003, // 0.3% of home price
  
  // Fixed costs (in dollars)
  ESTIMATED_LEGAL_FEES: 1500,
  
  // Tax rates (percentage)
  PERCENTAGE_DIVISOR: 100,
  
  // Default completion percentages
  DEFAULT_COMPLETION_PERCENTAGE: 100,
  
  // Validation limits
  LIMITS: {
    MIN_INCOME: 10000,
    MAX_INCOME: 10000000,
    MIN_DEBT: 0,
    MAX_DEBT: 50000,
    MIN_INTEREST_RATE: 0.1,
    MAX_INTEREST_RATE: 25,
    MIN_DOWN_PAYMENT: 1000,
    MAX_DOWN_PAYMENT: 500000,
    MIN_HOME_PRICE: 50000,
    MAX_HOME_PRICE: 50000000,
    MIN_LOAN_TERM: 5,
    MAX_LOAN_TERM: 40,
  },
  
  // Ontario Land Transfer Tax brackets
  ONTARIO_LTT_BRACKETS: {
    BRACKET_1_LIMIT: 55000,
    BRACKET_1_RATE: 0.005,
    BRACKET_2_LIMIT: 250000,
    BRACKET_2_BASE: 275,
    BRACKET_2_RATE: 0.01,
    BRACKET_3_LIMIT: 400000,
    BRACKET_3_BASE: 2225,
    BRACKET_3_RATE: 0.015,
    BRACKET_4_BASE: 4475,
    BRACKET_4_RATE: 0.02,
  },
  
  // BC Property Transfer Tax brackets
  BC_PTT_BRACKETS: {
    BRACKET_1_LIMIT: 200000,
    BRACKET_1_RATE: 0.01,
    BRACKET_2_LIMIT: 2000000,
    BRACKET_2_BASE: 2000,
    BRACKET_2_RATE: 0.02,
    BRACKET_3_BASE: 38000,
    BRACKET_3_RATE: 0.03,
    FIRST_TIME_BUYER_LIMIT: 500000,
    FIRST_TIME_BUYER_EXEMPTION: 8000,
  },
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
  CELEBRATION_DELAY: 1000, // Delay before showing celebration
  
  // Component dimensions
  TOUCH_TARGET_MIN_SIZE: 44, // px - minimum touch target size
  
  // Loading states
  DEBOUNCE_DELAY: 300, // milliseconds
  
  // Form validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_EMAIL_LENGTH: 254,
  MAX_URL_LENGTH: 2048,
  MAX_PHONE_DIGITS_NA: 11, // North American phone numbers
  MIN_PHONE_DIGITS_NA: 10,
  
  // Screen breakpoints (pixels)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
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
  
  // Timing
  CELEBRATION_DELAY: 1000, // milliseconds
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
  RATE_LIMIT_WINDOW: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Input validation for API
  MAX_API_INPUT_LENGTH: 10000,
  
  // Security
  MIN_AUTH_SECRET_LENGTH: 32,
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