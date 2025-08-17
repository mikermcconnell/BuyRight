/**
 * Profile and User Types for BuyRight App
 */

// Enhanced user profile matching Supabase schema
export interface EnhancedUserProfile {
  // Basic Information
  id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
  bio?: string;
  
  // Location & Preferences
  location: string; // Region code (ON, BC, US_CA, etc.)
  timezone?: string;
  language_preference?: string;
  
  // Communication Preferences
  preferred_communication?: 'email' | 'phone' | 'sms';
  notifications_enabled?: boolean;
  marketing_emails?: boolean;
  
  // Employment & Financial
  employment_status?: 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'student';
  annual_income?: number;
  credit_score_range?: 'poor' | 'fair' | 'good' | 'very_good' | 'excellent';
  
  // Home Buying Preferences
  budget_max?: number;
  timeline_preference?: 'fast' | 'normal' | 'thorough';
  home_type_preference?: 'single_family' | 'condo' | 'townhouse';
  first_time_buyer?: boolean;
  
  // Current Living Situation
  current_living_situation?: 'renting' | 'living_with_family' | 'owned' | 'other';
  current_rent_amount?: number;
  
  // Property Preferences
  preferred_bedrooms?: number;
  preferred_bathrooms?: number;
  max_commute_time?: number; // in minutes
  has_pets?: boolean;
  pet_restrictions?: string;
  accessibility_needs?: string;
  special_requirements?: string;
  
  // Professional Services
  real_estate_agent_name?: string;
  real_estate_agent_contact?: string;
  
  // Mortgage & Financing
  mortgage_pre_approved?: boolean;
  pre_approval_amount?: number;
  pre_approval_expiry?: string;
  lender_name?: string;
  down_payment_saved?: number;
  down_payment_percentage?: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Legacy interface for backwards compatibility
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timeline: 'immediate' | '3months' | '6months' | '1year' | 'exploring';
  budget?: number;
  preApproved: boolean;
  preApprovalAmount?: number;
  hasRealtor: boolean;
  realtorName?: string;
  realtorContact?: string;
  currentlyRenting: boolean;
  currentRentAmount?: number;
  preferredAreas: string[];
  houseType: 'detached' | 'townhouse' | 'condo' | 'any';
  bedroomsMin: number;
  bathroomsMin: number;
  parkingRequired: boolean;
  yardRequired: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// User preferences for granular settings
export interface UserPreference {
  id?: string;
  user_id: string;
  preference_category: string;
  preference_key: string;
  preference_value: any;
  created_at?: string;
  updated_at?: string;
}

// User activity log
export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Saved property searches
export interface SavedSearch {
  id?: string;
  user_id: string;
  search_name: string;
  search_criteria: Record<string, any>;
  notifications_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

// User documents
export interface UserDocument {
  id?: string;
  user_id: string;
  document_type: string;
  document_name: string;
  document_url?: string;
  file_size?: number;
  upload_date?: string;
  expiry_date?: string;
  is_verified?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Profile completion status
export interface ProfileCompleteness {
  percentage: number;
  missing_fields: string[];
  suggestions: string[];
}

// Account settings interface
export interface AccountSettings {
  profile: EnhancedUserProfile;
  preferences: UserPreference[];
  security: {
    last_login?: string;
    login_count?: number;
    two_factor_enabled: boolean;
    backup_email?: string;
  };
  privacy: {
    profile_visibility: 'private' | 'public' | 'contacts';
    data_sharing_consent: boolean;
    analytics_consent: boolean;
  };
}

export interface DashboardInsights {
  maxBudget?: number;
  monthlyPayment?: number;
  totalClosingCosts?: number;
  totalCashRequired?: number;
  downPayment?: number;
  readyToBuy: boolean;
  recommendations: string[];
  lastUpdated?: Date;
}

export interface RegionalTaxRates {
  propertyTax: number; // Annual percentage
  landTransferTax: number; // Percentage of purchase price
  salesTax?: number; // For certain fees/services
}

export interface CalculatorInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  amortizationYears: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees?: number;
  pmi?: number;
}

export interface CalculatorResults {
  monthlyPayment: number;
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA?: number;
  monthlyPMI?: number;
  totalMonthlyHousing: number;
  totalInterestPaid: number;
  payoffDate: Date;
}

export interface AffordabilityInputs {
  annualIncome: number;
  monthlyDebts: number;
  downPaymentAmount: number;
  interestRate: number;
  propertyTaxRate: number;
  insuranceRate: number;
  debtToIncomeRatio: number; // Max ratio (e.g., 0.43 for 43%)
}

export interface AffordabilityResults {
  maxHomePrice: number;
  maxMonthlyPayment: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  totalMonthlyHousing: number;
  cashToClose: number;
  recommendations: string[];
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}