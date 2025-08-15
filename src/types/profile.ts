/**
 * Profile and User Types for BuyRight App
 */

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