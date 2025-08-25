/**
 * Environment variable validation and configuration for BuyRight application
 * Uses Zod schema for runtime validation of environment variables
 */

import { z } from 'zod';

// Define the schema for environment variables
const EnvSchema = z.object({
  // Node.js environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Next.js configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  PORT: z.string().optional().transform(val => val ? parseInt(val, 10) : 3000),
  
  // Supabase configuration (optional for demo mode)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Google Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_VERIFICATION: z.string().optional(),
  
  // Database configuration (optional - falls back to Supabase)
  DATABASE_URL: z.string().url().optional(),
  
  // Authentication secrets
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  
  // External API keys (optional)
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  
  // Monitoring and logging (optional)
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Feature flags
  ENABLE_ANALYTICS: z.string().optional().transform(val => val === 'true'),
  ENABLE_ERROR_REPORTING: z.string().optional().transform(val => val === 'true'),
  ENABLE_DEBUG_MODE: z.string().optional().transform(val => val === 'true'),
});

// Export the inferred type
export type Env = z.infer<typeof EnvSchema>;

// Cache for validated environment
let validatedEnv: Env | null = null;

/**
 * Validates and returns environment variables
 * Throws error if required variables are missing or invalid
 */
export function validateEnv(): Env {
  // Return cached validation if available
  if (validatedEnv) {
    return validatedEnv;
  }
  
  try {
    // Parse and validate environment variables
    validatedEnv = EnvSchema.parse(process.env);
    
    // Additional validation logic
    validateSupabaseConfig(validatedEnv);
    validateProductionConfig(validatedEnv);
    
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      console.error('❌ Environment validation failed:');
      errorMessages.forEach(msg => console.error(`  - ${msg}`));
      
      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}`
      );
    }
    
    throw error;
  }
}

/**
 * Validates Supabase configuration consistency
 */
function validateSupabaseConfig(env: Env): void {
  const hasUrl = !!env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If one is provided, both should be provided
  if (hasUrl && !hasAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required when NEXT_PUBLIC_SUPABASE_URL is provided');
  }
  
  if (!hasUrl && hasAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required when NEXT_PUBLIC_SUPABASE_ANON_KEY is provided');
  }
  
  // Warn if neither is provided (demo mode)
  if (!hasUrl && !hasAnonKey) {
    console.warn('⚠️  Supabase not configured - running in demo mode');
    console.warn('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for full functionality');
  }
}

/**
 * Validates production-specific requirements
 */
function validateProductionConfig(env: Env): void {
  if (env.NODE_ENV === 'production') {
    // In production, we should have basic configuration
    if (!env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
      console.warn('⚠️  NEXT_PUBLIC_APP_URL should be set to production URL');
    }
    
    // Recommend Supabase for production
    if (!env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('⚠️  Supabase configuration recommended for production deployments');
    }
    
    // Security recommendations
    if (!env.NEXTAUTH_SECRET && env.NEXTAUTH_URL) {
      console.warn('⚠️  NEXTAUTH_SECRET should be set in production');
    }
  }
}

/**
 * Gets a validated environment variable by key
 * Provides type safety and ensures validation has occurred
 */
export function getEnvVar<K extends keyof Env>(key: K): Env[K] {
  const env = validateEnv();
  return env[key];
}

/**
 * Checks if the application is running in production
 */
export function isProduction(): boolean {
  return getEnvVar('NODE_ENV') === 'production';
}

/**
 * Checks if the application is running in development
 */
export function isDevelopment(): boolean {
  return getEnvVar('NODE_ENV') === 'development';
}

/**
 * Checks if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const env = validateEnv();
  return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Gets the application URL with fallback
 */
export function getAppUrl(): string {
  return getEnvVar('NEXT_PUBLIC_APP_URL');
}

/**
 * Gets database connection info
 */
export function getDatabaseConfig() {
  const env = validateEnv();
  
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    isConfigured: isSupabaseConfigured(),
  };
}

/**
 * Gets feature flag values
 */
export function getFeatureFlags() {
  const env = validateEnv();
  
  return {
    analytics: env.ENABLE_ANALYTICS || false,
    errorReporting: env.ENABLE_ERROR_REPORTING || false,
    debugMode: env.ENABLE_DEBUG_MODE || isDevelopment(),
  };
}

/**
 * Gets logging configuration
 */
export function getLogConfig() {
  const env = validateEnv();
  
  return {
    level: env.LOG_LEVEL,
    enableConsole: isDevelopment() || env.ENABLE_DEBUG_MODE,
  };
}

/**
 * Validates environment on module load
 * This ensures validation happens early in the application lifecycle
 */
if (typeof window === 'undefined') {
  // Only validate on server-side to avoid hydration issues
  try {
    validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed on startup:', error);
    
    // In production, this should probably exit the process
    if (isProduction()) {
      process.exit(1);
    }
  }
}

// Export the validated environment (will be validated on first access)
export const env = new Proxy({} as Env, {
  get(_, key) {
    return getEnvVar(key as keyof Env);
  }
});

export default env;