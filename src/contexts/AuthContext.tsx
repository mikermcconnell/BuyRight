'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseClient, supabaseService, UserProfile, getSupabaseAuthErrorMessage, isSupabaseAvailable } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const authLogger = logger.createDomainLogger('auth');

interface AuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; nextStep?: string }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        authLogger.info('Initializing auth state');
        
        // Check if Supabase is available
        if (!isSupabaseAvailable()) {
          authLogger.warn('Supabase not configured - running in demo mode');
          setLoading(false);
          return;
        }
        
        // Get current session
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          authLogger.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          const supabaseUser = session.user;
          const authUser: AuthUser = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            email_verified: !!supabaseUser.email_confirmed_at,
            created_at: supabaseUser.created_at,
            updated_at: supabaseUser.updated_at || supabaseUser.created_at,
          };
          
          setUser(authUser);
          
          // Load user profile
          try {
            const userProfile = await supabaseService.getProfile(supabaseUser.id);
            setProfile(userProfile);
            authLogger.info('User session restored', { userId: supabaseUser.id });
          } catch (profileError) {
            authLogger.error('Error loading profile:', profileError);
          }
        }
      } catch (error) {
        authLogger.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        authLogger.info('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const supabaseUser = session.user;
          const authUser: AuthUser = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            email_verified: !!supabaseUser.email_confirmed_at,
            created_at: supabaseUser.created_at,
            updated_at: supabaseUser.updated_at || supabaseUser.created_at,
          };
          
          setUser(authUser);
          
          // Load or create user profile
          try {
            let userProfile = await supabaseService.getProfile(supabaseUser.id);
            if (!userProfile) {
              // Create default profile if none exists
              userProfile = await supabaseService.createOrUpdateProfile(supabaseUser.id, {
                location: 'ON', // Default to Ontario
                first_time_buyer: true,
              });
            }
            setProfile(userProfile);
          } catch (profileError) {
            authLogger.error('Error handling profile on sign in:', profileError);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function using Supabase
  const signIn = async (email: string, password: string) => {
    try {
      authLogger.info('Attempting sign in', { email });
      
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        return {
          success: false,
          error: 'Authentication service temporarily unavailable - Demo mode active',
        };
      }
      
      // Basic validation
      const trimmedEmail = email.toLowerCase().trim();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      if (!password || password.length < 1) {
        return {
          success: false,
          error: 'Password is required',
        };
      }

      // Sign in with Supabase
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        authLogger.error('Sign in error:', error);
        return {
          success: false,
          error: getSupabaseAuthErrorMessage(error),
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Sign in failed - no user returned',
        };
      }

      // Check if user has completed onboarding
      const userProfile = await supabaseService.getProfile(data.user.id);
      const nextStep = userProfile?.location ? '/dashboard' : '/onboarding';

      authLogger.info('Sign in successful', { userId: data.user.id, nextStep });
      
      return {
        success: true,
        nextStep,
      };
    } catch (error) {
      authLogger.error('Unexpected sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Sign up function using Supabase
  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      authLogger.info('Attempting sign up', { email });
      
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        return {
          success: false,
          error: 'Registration service temporarily unavailable - Demo mode active',
        };
      }
      
      // Basic validation
      const trimmedEmail = email.toLowerCase().trim();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      if (!password || password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters',
        };
      }

      // Sign up with Supabase
      const { data, error } = await supabaseClient.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        authLogger.error('Sign up error:', error);
        return {
          success: false,
          error: getSupabaseAuthErrorMessage(error),
        };
      }

      const needsConfirmation = !data.session && data.user && !data.user.email_confirmed_at;
      
      authLogger.info('Sign up successful', { 
        userId: data.user?.id, 
        needsConfirmation 
      });

      return {
        success: true,
        needsConfirmation,
      };
    } catch (error) {
      authLogger.error('Unexpected sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Sign out function using Supabase
  const signOut = async () => {
    try {
      authLogger.info('Attempting sign out');
      
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        authLogger.error('Sign out error:', error);
        return {
          success: false,
          error: getSupabaseAuthErrorMessage(error),
        };
      }

      // Clear local state (will be handled by auth state change listener)
      setUser(null);
      setProfile(null);
      
      authLogger.info('Sign out successful');

      return { success: true };
    } catch (error) {
      authLogger.error('Unexpected sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Refresh profile from Supabase
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      authLogger.info('Refreshing profile', { userId: user.id });
      const userProfile = await supabaseService.getProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      authLogger.error('Error refreshing profile:', error);
    }
  };

  // Update profile in Supabase
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    try {
      authLogger.info('Updating profile', { userId: user.id, updates });
      
      const updatedProfile = await supabaseService.createOrUpdateProfile(user.id, updates);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        authLogger.info('Profile updated successfully');
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Failed to update profile',
        };
      }
    } catch (error) {
      authLogger.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      );
    }
    
    if (!user) {
      // In a real app, you'd redirect to login here
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Authentication Required</h1>
            <p className="mt-2 text-gray-600">Please sign in to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

// Hook for checking if user has completed onboarding
export function useOnboardingStatus() {
  const { user, profile, loading } = useAuth();
  
  const needsOnboarding = user && (!profile || !profile.location);
  const isOnboarded = user && profile && profile.location;
  
  return {
    needsOnboarding,
    isOnboarded,
    loading,
  };
}