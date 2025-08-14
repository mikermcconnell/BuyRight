import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          location: string;
          budget_max: number | null;
          timeline_preference: 'fast' | 'normal' | 'thorough';
          home_type_preference: 'single_family' | 'condo' | 'townhouse' | null;
          first_time_buyer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location: string;
          budget_max?: number | null;
          timeline_preference?: 'fast' | 'normal' | 'thorough';
          home_type_preference?: 'single_family' | 'condo' | 'townhouse' | null;
          first_time_buyer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          location?: string;
          budget_max?: number | null;
          timeline_preference?: 'fast' | 'normal' | 'thorough';
          home_type_preference?: 'single_family' | 'condo' | 'townhouse' | null;
          first_time_buyer?: boolean;
          updated_at?: string;
        };
      };
      journey_progress: {
        Row: {
          id: string;
          user_id: string;
          phase: string;
          step_id: string;
          completed: boolean;
          completed_at: string | null;
          notes: string | null;
          data: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phase: string;
          step_id: string;
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
          data?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          phase?: string;
          step_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
          data?: Record<string, any> | null;
          updated_at?: string;
        };
      };
      home_details: {
        Row: {
          id: string;
          user_id: string;
          purchase_date: string | null;
          home_type: 'single_family' | 'condo' | 'townhouse' | null;
          year_built: number | null;
          square_footage: number | null;
          climate_zone: string | null;
          address: string | null;
          purchase_price: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          purchase_date?: string | null;
          home_type?: 'single_family' | 'condo' | 'townhouse' | null;
          year_built?: number | null;
          square_footage?: number | null;
          climate_zone?: string | null;
          address?: string | null;
          purchase_price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          purchase_date?: string | null;
          home_type?: 'single_family' | 'condo' | 'townhouse' | null;
          year_built?: number | null;
          square_footage?: number | null;
          climate_zone?: string | null;
          address?: string | null;
          purchase_price?: number | null;
          updated_at?: string;
        };
      };
      home_components: {
        Row: {
          id: string;
          home_id: string;
          component_type: string;
          component_name: string | null;
          installation_date: string | null;
          last_maintenance: string | null;
          estimated_lifespan: number | null;
          maintenance_frequency: number | null;
          warranty_expiry: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          component_type: string;
          component_name?: string | null;
          installation_date?: string | null;
          last_maintenance?: string | null;
          estimated_lifespan?: number | null;
          maintenance_frequency?: number | null;
          warranty_expiry?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          component_type?: string;
          component_name?: string | null;
          installation_date?: string | null;
          last_maintenance?: string | null;
          estimated_lifespan?: number | null;
          maintenance_frequency?: number | null;
          warranty_expiry?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      calculator_sessions: {
        Row: {
          id: string;
          user_id: string;
          calculator_type: string;
          input_data: Record<string, any>;
          results: Record<string, any>;
          saved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          calculator_type: string;
          input_data: Record<string, any>;
          results: Record<string, any>;
          saved?: boolean;
          created_at?: string;
        };
        Update: {
          calculator_type?: string;
          input_data?: Record<string, any>;
          results?: Record<string, any>;
          saved?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Client-side Supabase client for browser
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Client component client
export function createSupabaseClientComponentClient() {
  return createClientComponentClient<Database>();
}

// Service role client for admin operations (server-side only)
export function createSupabaseServiceClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Service role key is required for admin operations');
  }
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Utility types for better TypeScript support
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type JourneyProgress = Database['public']['Tables']['journey_progress']['Row'];
export type JourneyProgressInsert = Database['public']['Tables']['journey_progress']['Insert'];
export type JourneyProgressUpdate = Database['public']['Tables']['journey_progress']['Update'];

export type HomeDetails = Database['public']['Tables']['home_details']['Row'];
export type HomeDetailsInsert = Database['public']['Tables']['home_details']['Insert'];
export type HomeDetailsUpdate = Database['public']['Tables']['home_details']['Update'];

export type CalculatorSession = Database['public']['Tables']['calculator_sessions']['Row'];
export type CalculatorSessionInsert = Database['public']['Tables']['calculator_sessions']['Insert'];

// Auth helpers
export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user: AuthUser;
  profile?: UserProfile;
}

// Database operations helpers
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabase = supabaseClient;
  }

  // User Profile operations
  async createOrUpdateProfile(userId: string, profileData: Partial<UserProfileInsert>): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }

    return data;
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  // Journey Progress operations
  async updateJourneyStep(
    userId: string,
    stepId: string,
    phase: string,
    completed: boolean,
    notes?: string,
    stepData?: Record<string, any>
  ): Promise<JourneyProgress | null> {
    const { data, error } = await this.supabase
      .from('journey_progress')
      .upsert({
        user_id: userId,
        step_id: stepId,
        phase: phase,
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null,
        notes: notes || null,
        data: stepData || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating journey step:', error);
      throw error;
    }

    return data;
  }

  async getJourneyProgress(userId: string): Promise<JourneyProgress[]> {
    const { data, error } = await this.supabase
      .from('journey_progress')
      .select('*')
      .eq('user_id', userId)
      .order('phase')
      .order('created_at');

    if (error) {
      console.error('Error fetching journey progress:', error);
      throw error;
    }

    return data || [];
  }

  async getJourneyProgressSummary(userId: string): Promise<any[]> {
    // This would require a more complex query or post-processing
    // For now, return the raw progress and let the frontend calculate summary
    const progress = await this.getJourneyProgress(userId);
    
    // Group by phase and calculate percentages
    const phaseMap = new Map();
    progress.forEach(step => {
      if (!phaseMap.has(step.phase)) {
        phaseMap.set(step.phase, { total: 0, completed: 0 });
      }
      const phaseData = phaseMap.get(step.phase);
      phaseData.total++;
      if (step.completed) {
        phaseData.completed++;
      }
    });

    return Array.from(phaseMap.entries()).map(([phase, data]) => ({
      phase,
      total_steps: data.total,
      completed_steps: data.completed,
      completion_percentage: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    }));
  }

  // Calculator Sessions
  async saveCalculatorSession(
    userId: string,
    calculatorType: string,
    inputData: Record<string, any>,
    results: Record<string, any>,
    saved: boolean = false
  ): Promise<CalculatorSession | null> {
    const { data, error } = await this.supabase
      .from('calculator_sessions')
      .insert({
        user_id: userId,
        calculator_type: calculatorType,
        input_data: inputData,
        results: results,
        saved: saved,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving calculator session:', error);
      throw error;
    }

    return data;
  }

  async getCalculatorSessions(userId: string, calculatorType?: string): Promise<CalculatorSession[]> {
    let query = this.supabase
      .from('calculator_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (calculatorType) {
      query = query.eq('calculator_type', calculatorType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching calculator sessions:', error);
      throw error;
    }

    return data || [];
  }
}

// Export a default service instance for client-side use
export const supabaseService = new SupabaseService(supabaseClient);

// Helper function to get the current user session
export async function getCurrentUser(supabaseClient: SupabaseClient<Database>): Promise<UserSession | null> {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Get user profile
  const service = new SupabaseService(supabaseClient);
  const profile = await service.getProfile(user.id);

  return {
    user: {
      id: user.id,
      email: user.email!,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    },
    profile: profile || undefined,
  };
}

// Auth error handling
export function isSupabaseAuthError(error: any): boolean {
  return error && typeof error === 'object' && 'message' in error && 'status' in error;
}

export function getSupabaseAuthErrorMessage(error: any): string {
  if (isSupabaseAuthError(error)) {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.';
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.';
      case 'Signup requires a valid password':
        return 'Please enter a valid password (minimum 6 characters).';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}