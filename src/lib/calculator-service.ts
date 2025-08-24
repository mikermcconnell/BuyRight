/**
 * Calculator Service for Direct Supabase Operations
 * This service handles calculator operations directly with Supabase,
 * eliminating the need for API routes in mobile/static builds.
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
   * Save calculator session directly to Supabase
   */
  static async saveCalculation(data: CalculatorSaveData): Promise<{ success: boolean; error?: string; sessionId?: string }> {
    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        calculatorLogger.warn('Supabase not available - saving to localStorage');
        
        // Fallback to localStorage for demo mode
        const sessionId = `calc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const storageKey = `calculator_session_${sessionId}`;
        
        localStorage.setItem(storageKey, JSON.stringify({
          ...data,
          id: sessionId,
          created_at: new Date().toISOString(),
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
        // Keep only last 10 calculations
        localStorage.setItem(recentKey, JSON.stringify(recent.slice(0, 10)));
        
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
      
      // Save to Supabase
      const { data: savedSession, error: saveError } = await supabaseClient
        .from('calculator_sessions')
        .insert({
          user_id: user.id,
          calculator_type: data.calculatorType,
          input_data: data.inputData,
          results: data.results,
          saved: data.saved || false,
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
  static async getSavedCalculations(limit: number = 10): Promise<any[]> {
    try {
      if (!isSupabaseAvailable()) {
        // Return from localStorage
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