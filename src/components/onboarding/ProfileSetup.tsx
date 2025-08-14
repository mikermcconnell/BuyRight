'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const profileSchema = z.object({
  budgetMax: z.number().min(50000, 'Budget must be at least $50,000').optional().or(z.literal('')),
  timelinePreference: z.enum(['fast', 'normal', 'thorough']),
  homeTypePreference: z.enum(['single_family', 'condo', 'townhouse']).optional(),
  firstTimeBuyer: z.boolean(),
  currentSituation: z.enum(['renting', 'living_with_family', 'own_home', 'other']).optional(),
  preapprovalStatus: z.enum(['none', 'shopping', 'have_preapproval', 'not_sure']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const budgetOptions = [
  { value: '', label: 'Not sure yet' },
  { value: 100000, label: 'Under $100K' },
  { value: 250000, label: '$100K - $250K' },
  { value: 500000, label: '$250K - $500K' },
  { value: 750000, label: '$500K - $750K' },
  { value: 1000000, label: '$750K - $1M' },
  { value: 1500000, label: '$1M - $1.5M' },
  { value: 2000000, label: '$1.5M+' },
];

const timelineOptions = [
  {
    value: 'fast',
    label: 'Fast Track',
    description: 'I want to buy within 3-6 months',
    icon: '⚡',
  },
  {
    value: 'normal',
    label: 'Standard',
    description: 'I plan to buy within 6-12 months',
    icon: '🎯',
  },
  {
    value: 'thorough',
    label: 'Take My Time',
    description: 'I want to learn everything first',
    icon: '📚',
  },
];

const homeTypeOptions = [
  {
    value: 'single_family',
    label: 'Single Family Home',
    description: 'Detached house with yard',
    icon: '🏠',
  },
  {
    value: 'condo',
    label: 'Condominium',
    description: 'Apartment-style with shared amenities',
    icon: '🏢',
  },
  {
    value: 'townhouse',
    label: 'Townhouse',
    description: 'Multi-level attached home',
    icon: '🏘️',
  },
];

interface ProfileSetupProps {
  onSubmit: (data: ProfileFormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<ProfileFormData>;
}

export default function ProfileSetup({
  onSubmit,
  onBack,
  isSubmitting = false,
  initialData = {},
}: ProfileSetupProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      timelinePreference: 'normal',
      firstTimeBuyer: true,
      ...initialData,
    },
  });

  const firstTimeBuyer = watch('firstTimeBuyer');

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Budget Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's your budget range?</h3>
            <p className="text-sm text-gray-600 mt-1">
              This helps us customize your journey and recommendations.
            </p>
          </div>

          <Controller
            name="budgetMax"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {budgetOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="budgetMax"
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.budgetMax && (
            <p className="text-sm text-red-600">{errors.budgetMax.message}</p>
          )}
        </div>

        {/* Timeline Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's your timeline?</h3>
            <p className="text-sm text-gray-600 mt-1">
              This affects how we pace your learning and preparation.
            </p>
          </div>

          <Controller
            name="timelinePreference"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {timelineOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      field.value === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="timelinePreference"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Home Type Preference */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What type of home interests you?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Optional - you can always change this later.
            </p>
          </div>

          <Controller
            name="homeTypePreference"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {homeTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      field.value === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="homeTypePreference"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
                
                {/* None Selected Option */}
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    !field.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="homeTypePreference"
                      value=""
                      checked={!field.value}
                      onChange={() => field.onChange(undefined)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🤔</span>
                      <div>
                        <p className="font-semibold text-gray-900">I'm not sure yet</p>
                        <p className="text-sm text-gray-600">I want to explore all options</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            )}
          />
        </div>

        {/* First Time Buyer */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you a first-time home buyer?</h3>
            <p className="text-sm text-gray-600 mt-1">
              First-time buyers often qualify for special programs and incentives.
            </p>
          </div>

          <Controller
            name="firstTimeBuyer"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="firstTimeBuyer"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Yes, this is my first home purchase
                  </span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="firstTimeBuyer"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    No, I've owned a home before
                  </span>
                </label>
              </div>
            )}
          />
        </div>

        {/* First-time buyer benefits callout */}
        {firstTimeBuyer && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">Great news!</h4>
                <p className="mt-1 text-sm text-green-700">
                  As a first-time buyer, you may qualify for special programs, grants, 
                  and tax benefits. We'll help you discover all available options.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col space-y-3 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="duolingo-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="loading-spinner w-5 h-5 mr-3" />
                Setting up your profile...
              </div>
            ) : (
              'Continue to Dashboard'
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full py-3 px-4 font-bold text-gray-700 border-2 border-gray-300 rounded-lg transition-all duration-200 text-base text-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Location
          </button>
        </div>
      </form>
    </div>
  );
}