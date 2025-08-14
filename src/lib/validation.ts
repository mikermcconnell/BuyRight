// Comprehensive validation utilities for BuyRight application

// Email validation using a robust regex pattern
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

// Password strength validation
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Financial input validation
export interface FinancialValidationResult {
  valid: boolean;
  error?: string;
  sanitizedValue?: number;
}

export const validateHomePrice = (price: number | string): FinancialValidationResult => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Please enter a valid home price' };
  }
  
  if (numPrice <= 0) {
    return { valid: false, error: 'Home price must be greater than $0' };
  }
  
  if (numPrice < 1000) {
    return { valid: false, error: 'Home price must be at least $1,000' };
  }
  
  if (numPrice > 50000000) {
    return { valid: false, error: 'Home price cannot exceed $50,000,000' };
  }
  
  return { valid: true, sanitizedValue: Math.round(numPrice * 100) / 100 };
};

export const validateDownPayment = (downPayment: number | string, homePrice: number): FinancialValidationResult => {
  const numDownPayment = typeof downPayment === 'string' ? parseFloat(downPayment) : downPayment;
  
  if (isNaN(numDownPayment)) {
    return { valid: false, error: 'Please enter a valid down payment amount' };
  }
  
  if (numDownPayment < 0) {
    return { valid: false, error: 'Down payment cannot be negative' };
  }
  
  if (numDownPayment >= homePrice) {
    return { valid: false, error: 'Down payment cannot equal or exceed home price' };
  }
  
  // Check minimum down payment requirements
  const downPaymentPercent = (numDownPayment / homePrice) * 100;
  if (homePrice <= 500000 && downPaymentPercent < 5) {
    return { valid: false, error: 'Minimum 5% down payment required for homes under $500,000' };
  }
  
  if (homePrice > 500000 && homePrice <= 1000000) {
    const requiredMinimum = (500000 * 0.05) + ((homePrice - 500000) * 0.10);
    if (numDownPayment < requiredMinimum) {
      return { 
        valid: false, 
        error: `Minimum down payment required: $${requiredMinimum.toLocaleString()}` 
      };
    }
  }
  
  if (homePrice > 1000000 && downPaymentPercent < 20) {
    return { valid: false, error: 'Minimum 20% down payment required for homes over $1,000,000' };
  }
  
  return { valid: true, sanitizedValue: Math.round(numDownPayment * 100) / 100 };
};

export const validateInterestRate = (rate: number | string): FinancialValidationResult => {
  const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  
  if (isNaN(numRate)) {
    return { valid: false, error: 'Please enter a valid interest rate' };
  }
  
  if (numRate <= 0) {
    return { valid: false, error: 'Interest rate must be greater than 0%' };
  }
  
  if (numRate > 30) {
    return { valid: false, error: 'Interest rate cannot exceed 30%' };
  }
  
  return { valid: true, sanitizedValue: Math.round(numRate * 1000) / 1000 };
};

export const validateLoanTerm = (term: number | string): FinancialValidationResult => {
  const numTerm = typeof term === 'string' ? parseInt(term) : term;
  
  if (isNaN(numTerm)) {
    return { valid: false, error: 'Please enter a valid loan term' };
  }
  
  if (numTerm <= 0) {
    return { valid: false, error: 'Loan term must be greater than 0 years' };
  }
  
  if (numTerm > 50) {
    return { valid: false, error: 'Loan term cannot exceed 50 years' };
  }
  
  return { valid: true, sanitizedValue: numTerm };
};

export const validateIncome = (income: number | string): FinancialValidationResult => {
  const numIncome = typeof income === 'string' ? parseFloat(income) : income;
  
  if (isNaN(numIncome)) {
    return { valid: false, error: 'Please enter a valid annual income' };
  }
  
  if (numIncome < 0) {
    return { valid: false, error: 'Income cannot be negative' };
  }
  
  if (numIncome > 10000000) {
    return { valid: false, error: 'Income cannot exceed $10,000,000' };
  }
  
  return { valid: true, sanitizedValue: Math.round(numIncome * 100) / 100 };
};

export const validateDebtAmount = (debt: number | string): FinancialValidationResult => {
  const numDebt = typeof debt === 'string' ? parseFloat(debt) : debt;
  
  if (isNaN(numDebt)) {
    return { valid: false, error: 'Please enter a valid debt amount' };
  }
  
  if (numDebt < 0) {
    return { valid: false, error: 'Debt amount cannot be negative' };
  }
  
  if (numDebt > 5000000) {
    return { valid: false, error: 'Debt amount cannot exceed $5,000,000' };
  }
  
  return { valid: true, sanitizedValue: Math.round(numDebt * 100) / 100 };
};

// Step ID validation to prevent injection attacks
export const validateStepId = (stepId: string): boolean => {
  // Only allow alphanumeric characters, hyphens, and underscores
  const stepIdRegex = /^[a-zA-Z0-9_-]+$/;
  return stepIdRegex.test(stepId) && stepId.length <= 50;
};

// Regional code validation
export const validateRegionCode = (regionCode: string): boolean => {
  const validRegions = ['ON', 'BC', 'US_CA', 'US_NY', 'US_TX', 'US_FL'];
  return validRegions.includes(regionCode);
};

// Sanitize text input to prevent XSS
export const sanitizeTextInput = (input: string, maxLength: number = 1000): string => {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Validation error handling
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}