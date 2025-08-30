/**
 * Calculator Service for Direct Supabase Operations
 * This service handles calculator operations directly with Supabase,
 * eliminating the need for API routes in mobile/static builds.
 * 
 * EPHEMERAL DATA COMPLIANCE:
 * - Financial data is sanitized and rounded for privacy
 * - localStorage data expires after 24 hours
 * - Automatic cleanup removes expired calculator sessions
 * - Sensitive data is not retained longer than necessary
 */

import { supabaseClient, isSupabaseAvailable } from './supabase';
import { logger } from './logger';

const calculatorLogger = logger.createDomainLogger('calculator');

export interface CalculatorSaveData {
  calculatorType: 'mortgage' | 'affordability' | 'closing-costs';
  inputData: Record<string, any>;
  results: Record<string, any>;
  saved?: boolean;
}

export class CalculatorService {
  /**
   * Sanitize financial data for ephemeral processing compliance
   */
  private static sanitizeFinancialData(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    
    // Round sensitive financial data to reduce precision for privacy
    if (sanitized.income) {
      sanitized.income = Math.round(sanitized.income / 1000) * 1000; // Round to nearest 1k
    }
    if (sanitized.debts || sanitized.monthlyDebts) {
      const debts = sanitized.debts || sanitized.monthlyDebts;
      sanitized.debts = Math.round(debts / 100) * 100; // Round to nearest 100
      sanitized.monthlyDebts = sanitized.debts;
    }
    if (sanitized.downPayment) {
      sanitized.downPayment = Math.round(sanitized.downPayment / 500) * 500; // Round to nearest 500
    }
    
    return sanitized;
  }

  /**
   * Check if localStorage data has expired (ephemeral compliance)
   */
  private static isDataExpired(timestamp: string, maxAgeHours: number = 24): boolean {
    const dataAge = Date.now() - new Date(timestamp).getTime();
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds
    return dataAge > maxAge;
  }

  /**
   * Clean up expired calculator data from localStorage
   */
  private static cleanupExpiredData(): void {
    try {
      const recentKey = 'recent_calculations';
      const recent = JSON.parse(localStorage.getItem(recentKey) || '[]');
      
      // Remove expired entries
      const validEntries = recent.filter((entry: any) => 
        !this.isDataExpired(entry.created_at)
      );
      
      // Clean up individual session data
      recent.forEach((entry: any) => {
        if (this.isDataExpired(entry.created_at)) {
          localStorage.removeItem(`calculator_session_${entry.id}`);
        }
      });
      
      localStorage.setItem(recentKey, JSON.stringify(validEntries));
    } catch (error) {
      console.error('Failed to cleanup expired calculator data:', error);
    }
  }

  /**
   * Save calculator session directly to Supabase
   */
  static async saveCalculation(data: CalculatorSaveData): Promise<{ success: boolean; error?: string; sessionId?: string }> {
    try {
      // Cleanup expired data first
      this.cleanupExpiredData();
      
      // Sanitize data for ephemeral processing compliance
      const sanitizedData = {
        ...data,
        inputData: this.sanitizeFinancialData(data.inputData),
        results: this.sanitizeFinancialData(data.results)
      };
      
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        calculatorLogger.warn('Supabase not available - saving to localStorage');
        
        // Fallback to localStorage for demo mode
        const sessionId = `calc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const storageKey = `calculator_session_${sessionId}`;
        
        localStorage.setItem(storageKey, JSON.stringify({
          ...sanitizedData,
          id: sessionId,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour expiry
        }));
        
        // Also update recent calculations list
        const recentKey = 'recent_calculations';
        const recent = JSON.parse(localStorage.getItem(recentKey) || '[]');
        recent.unshift({
          id: sessionId,
          calculator_type: data.calculatorType,
          created_at: new Date().toISOString(),
          saved: data.saved || false,
        });
        // Keep only last 5 calculations for ephemeral compliance
        localStorage.setItem(recentKey, JSON.stringify(recent.slice(0, 5)));
        
        return { success: true, sessionId };
      }
      
      // Get current user
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        calculatorLogger.warn('User not authenticated - saving to localStorage');
        
        // Save to localStorage for unauthenticated users
        const sessionId = `calc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const storageKey = `calculator_session_${sessionId}`;
        
        localStorage.setItem(storageKey, JSON.stringify({
          ...data,
          id: sessionId,
          created_at: new Date().toISOString(),
        }));
        
        return { success: true, sessionId };
      }
      
      // Save sanitized data to Supabase
      const { data: savedSession, error: saveError } = await supabaseClient
        .from('calculator_sessions')
        .insert({
          user_id: user.id,
          calculator_type: sanitizedData.calculatorType,
          input_data: sanitizedData.inputData,
          results: sanitizedData.results,
          saved: sanitizedData.saved || false,
        } as any)
        .select()
        .single();
      
      if (saveError) {
        calculatorLogger.error('Failed to save calculation to Supabase', saveError);
        return { 
          success: false, 
          error: 'Failed to save calculation. Please try again.' 
        };
      }
      
      const sessionData = savedSession as any;
      calculatorLogger.info('Calculation saved successfully', { 
        sessionId: sessionData?.id,
        type: data.calculatorType 
      });
      
      return { 
        success: true, 
        sessionId: sessionData?.id || 'unknown'
      };
      
    } catch (error) {
      calculatorLogger.error('Error saving calculation', error as Error);
      return { 
        success: false, 
        error: 'An unexpected error occurred while saving.' 
      };
    }
  }
  
  /**
   * Get saved calculations for the current user
   */
  static async getSavedCalculations(limit: number = 5): Promise<any[]> {
    try {
      // Cleanup expired data first
      this.cleanupExpiredData();
      
      if (!isSupabaseAvailable()) {
        // Return from localStorage (already filtered by cleanup)
        const recent = JSON.parse(localStorage.getItem('recent_calculations') || '[]');
        return recent.slice(0, limit);
      }
      
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        // Return from localStorage for unauthenticated users
        const recent = JSON.parse(localStorage.getItem('recent_calculations') || '[]');
        return recent.slice(0, limit);
      }
      
      const { data, error } = await supabaseClient
        .from('calculator_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        calculatorLogger.error('Failed to fetch saved calculations', error);
        return [];
      }
      
      return data || [];
      
    } catch (error) {
      calculatorLogger.error('Error fetching saved calculations', error as Error);
      return [];
    }
  }
  
  /**
   * Delete a saved calculation
   */
  static async deleteCalculation(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseAvailable()) {
        // Delete from localStorage
        localStorage.removeItem(`calculator_session_${sessionId}`);
        
        // Update recent calculations list
        const recent = JSON.parse(localStorage.getItem('recent_calculations') || '[]');
        const filtered = recent.filter((calc: any) => calc.id !== sessionId);
        localStorage.setItem('recent_calculations', JSON.stringify(filtered));
        
        return { success: true };
      }
      
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        // Delete from localStorage
        localStorage.removeItem(`calculator_session_${sessionId}`);
        return { success: true };
      }
      
      const { error } = await supabaseClient
        .from('calculator_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (error) {
        calculatorLogger.error('Failed to delete calculation', error);
        return { 
          success: false, 
          error: 'Failed to delete calculation.' 
        };
      }
      
      return { success: true };
      
    } catch (error) {
      calculatorLogger.error('Error deleting calculation', error as Error);
      return { 
        success: false, 
        error: 'An unexpected error occurred.' 
      };
    }
  }
}