'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  // Load remembered email on mount
  const [rememberedEmail, setRememberedEmail] = useState<string>('');
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('buyright_remembered_email');
    if (savedEmail) {
      setRememberedEmail(savedEmail);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true, // Default to checked
    },
  });

  // Set the remembered email when it's loaded
  useEffect(() => {
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
    }
  }, [rememberedEmail, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      // Save or clear email based on remember me checkbox
      if (data.rememberMe) {
        localStorage.setItem('buyright_remembered_email', data.email);
      } else {
        localStorage.removeItem('buyright_remembered_email');
      }

      // Pass rememberMe flag to signIn for extended session
      const result = await signIn(data.email, data.password, data.rememberMe);

      if (result.success) {
        // Redirect to the intended page or dashboard
        router.push(result.nextStep || redirectTo);
      } else {
        setApiError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="duolingo-container">
      <div className="duolingo-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="duolingo-title">Welcome back</h1>
          <p className="duolingo-subtitle">
            Continue your home buying journey
          </p>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="duolingo-error">{apiError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="duolingo-form-group">
            <label htmlFor="email" className="duolingo-label">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`duolingo-input ${
                errors.email ? 'error' : ''
              }`}
              placeholder="Enter your email"
              autoComplete="email"
              defaultValue={rememberedEmail}
            />
            {errors.email && (
              <p className="duolingo-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="duolingo-form-group">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="duolingo-label mb-0">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm duolingo-link"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-2">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`duolingo-input pr-12 ${
                  errors.password ? 'error' : ''
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="duolingo-error">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              type="checkbox"
              id="rememberMe"
              className="duolingo-checkbox"
            />
            <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-600">
              Remember my email and keep me signed in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="duolingo-button"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="duolingo-divider">
          <span>Or</span>
        </div>

        {/* Continue as Guest */}
        <div className="text-center space-y-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Continue as Guest
          </button>
          
          {/* Guest Mode Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>⚠️ Guest Mode:</strong> Your progress will be saved locally but won't sync across devices. 
              Create an account to save your progress in the cloud!
            </p>
          </div>

          <Link
            href="/register"
            className="duolingo-link text-sm block"
          >
            New to BuyRight? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="duolingo-container">
        <div className="duolingo-card">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}