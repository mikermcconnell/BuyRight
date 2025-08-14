'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface UserProfile {
  id: string;
  email: string;
  location?: string;
  first_time_buyer?: boolean;
  budget_range?: string;
  timeline?: string;
  created_at: string;
  updated_at: string;
}

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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('buyright_demo_user');
        const storedProfile = localStorage.getItem('buyright_demo_profile');

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }

        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading demo auth data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in function (Demo - uses localStorage)
  const signIn = async (email: string, password: string) => {
    try {
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

      // Demo user creation
      const demoUser: AuthUser = {
        id: `demo-${Date.now()}`,
        email: trimmedEmail,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Check if user has an existing profile
      const existingProfile = localStorage.getItem('buyright_demo_profile');
      let nextStep = '/onboarding';

      if (existingProfile) {
        const profileData = JSON.parse(existingProfile);
        if (profileData.location) {
          nextStep = '/dashboard';
        }
      }

      // Store user data
      localStorage.setItem('buyright_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);

      return {
        success: true,
        nextStep,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Sign up function (Demo - uses localStorage)
  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
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

      // Create demo user
      const demoUser: AuthUser = {
        id: `demo-${Date.now()}`,
        email: trimmedEmail,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store user data
      localStorage.setItem('buyright_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);

      return {
        success: true,
        needsConfirmation: false,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Sign out function (Demo - clears localStorage)
  const signOut = async () => {
    try {
      localStorage.removeItem('buyright_demo_user');
      localStorage.removeItem('buyright_demo_profile');
      setUser(null);
      setProfile(null);

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const storedProfile = localStorage.getItem('buyright_demo_profile');
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    try {
      const existingProfile = profile || {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      };

      const updatedProfile = {
        ...existingProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('buyright_demo_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
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