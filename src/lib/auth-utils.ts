import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, createSupabaseServerComponentClient } from '@/lib/supabase-server';

// Auth utilities for server components and API routes

export interface AuthenticatedUser {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get authenticated user in API routes
 * Returns null if user is not authenticated
 */
export async function getAuthenticatedUser(request?: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createSupabaseRouteHandlerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      email_verified: !!user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Get authenticated user in server components
 * Returns null if user is not authenticated
 */
export async function getServerAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = createSupabaseServerComponentClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      email_verified: !!user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  } catch (error) {
    console.error('Error getting server authenticated user:', error);
    return null;
  }
}

/**
 * Middleware helper to protect API routes
 * Returns authentication error response if user is not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      { status: 401 }
    );
  }

  return { user };
}

/**
 * HOC for protecting API route handlers
 */
export function withAuthHandler<T extends any[]>(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Authentication failed
    }

    return handler(request, authResult.user, ...args);
  };
}

/**
 * Email validation utility
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation utility
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let strength: PasswordValidation['strength'] = 'weak';

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password.length < 8) {
    errors.push('Password should be at least 8 characters for better security');
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password);

  let strengthScore = 0;
  if (hasLowerCase) strengthScore++;
  if (hasUpperCase) strengthScore++;
  if (hasNumbers) strengthScore++;
  if (hasSpecialChar) strengthScore++;
  if (password.length >= 8) strengthScore++;

  // Determine strength
  if (strengthScore >= 4) strength = 'strong';
  else if (strengthScore >= 3) strength = 'good';
  else if (strengthScore >= 2) strength = 'fair';

  // Add suggestions for stronger passwords
  if (!hasLowerCase || !hasUpperCase) {
    errors.push('Password should include both uppercase and lowercase letters');
  }
  if (!hasNumbers) {
    errors.push('Password should include at least one number');
  }
  if (!hasSpecialChar && strength !== 'strong') {
    errors.push('Password should include at least one special character for better security');
  }

  return {
    isValid: password.length >= 6,
    errors: errors.filter((_, index) => index < 3), // Limit to first 3 errors
    strength,
  };
}

/**
 * Rate limiting utilities (basic implementation)
 */
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

const attempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt || now > attempt.resetTime) {
    // First attempt or reset window
    attempts.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return true;
  }

  if (attempt.count >= config.maxAttempts) {
    return false; // Rate limit exceeded
  }

  attempt.count++;
  return true;
}

/**
 * Generate a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format user display name
 */
export function getUserDisplayName(user: AuthenticatedUser): string {
  if (user.email) {
    return user.email.split('@')[0]; // Use email username part
  }
  return 'User';
}

/**
 * Check if user email is verified
 */
export function requireEmailVerification(user: AuthenticatedUser): NextResponse | null {
  if (!user.email_verified) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Please verify your email address to continue',
        },
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Common error responses
 */
export const AuthErrors = {
  UNAUTHORIZED: {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
  },
  FORBIDDEN: {
    success: false,
    error: {
      code: 'FORBIDDEN',
      message: 'Access denied',
    },
  },
  EMAIL_NOT_VERIFIED: {
    success: false,
    error: {
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Please verify your email address',
    },
  },
  RATE_LIMITED: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many attempts. Please try again later.',
    },
  },
} as const;