'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/onboarding';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const result = await signUp(data.email, data.password);

      if (result.success) {
        if (result.needsConfirmation) {
          setNeedsConfirmation(true);
        } else {
          // Redirect to onboarding or specified page
          router.push(redirectTo);
        }
      } else {
        setApiError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show confirmation message if email verification is needed
  if (needsConfirmation) {
    return (
      <div className="duolingo-container">
        <div className="duolingo-card">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="duolingo-title">Check your email</h1>
            <p className="duolingo-subtitle mb-8">
              We've sent you a confirmation link. Please check your email and click the link to verify your account.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  className="duolingo-link"
                  onClick={() => setNeedsConfirmation(false)}
                >
                  try again
                </button>
              </p>
              
              <Link href="/login" className="duolingo-button block">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="duolingo-container">
      <div className="duolingo-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="duolingo-title">Create your account</h1>
          <p className="duolingo-subtitle">
            Start your home buying journey today
          </p>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="duolingo-error">{apiError}</p>
          </div>
        )}

        {/* Registration Form */}
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
            />
            {errors.email && (
              <p className="duolingo-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="duolingo-form-group">
            <label htmlFor="password" className="duolingo-label">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`duolingo-input pr-12 ${
                  errors.password ? 'error' : ''
                }`}
                placeholder="Create a password"
                autoComplete="new-password"
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
            <p className="mt-1 text-xs text-gray-500">
              Must contain at least 6 characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="duolingo-form-group">
            <label htmlFor="confirmPassword" className="duolingo-label">
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`duolingo-input pr-12 ${
                  errors.confirmPassword ? 'error' : ''
                }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="duolingo-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              {...register('terms')}
              type="checkbox"
              id="terms"
              className="duolingo-checkbox mt-1"
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="duolingo-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="duolingo-link">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="duolingo-error">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="duolingo-button"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div className="duolingo-divider">
          <span>Already have an account?</span>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="duolingo-link text-sm"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}