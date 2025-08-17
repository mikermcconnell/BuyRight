'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import LocationSelection from '@/components/onboarding/LocationSelection';
import ProfileSetup from '@/components/onboarding/ProfileSetup';
import BuyRightLogo from '@/components/ui/BuyRightLogo';
import { withPageErrorBoundary } from '@/components/ui/PageErrorBoundary';

type OnboardingStep = 'location' | 'profile';

const stepTitles: Record<OnboardingStep, string> = {
  location: 'Choose Your Location',
  profile: 'Tell Us About Yourself',
};

const stepDescriptions: Record<OnboardingStep, string> = {
  location: 'We customize your home buying journey based on your location\'s unique market conditions and regulations.',
  profile: 'Help us personalize your experience and provide the most relevant guidance for your situation.',
};

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('location');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({ email: 'demo@example.com' });

  const router = useRouter();

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleLocationContinue = () => {
    if (selectedLocation) {
      setCurrentStep('profile');
    }
  };

  const handleProfileSubmit = async (profileData: {
    budgetMax?: number | "";
    timelinePreference: "fast" | "normal" | "thorough";
    homeTypePreference?: "single_family" | "condo" | "townhouse";
    firstTimeBuyer: boolean;
    currentSituation?: "renting" | "living_with_family" | "own_home" | "other";
    preapprovalStatus?: "none" | "shopping" | "have_preapproval" | "not_sure";
  }) => {
    setIsSubmitting(true);
    
    try {
      // Simulate saving profile data locally or to mock API
      const profileDataToSave = {
        location: selectedLocation!,
        budget_max: profileData.budgetMax || null,
        timeline_preference: profileData.timelinePreference,
        home_type_preference: profileData.homeTypePreference || null,
        first_time_buyer: profileData.firstTimeBuyer,
      };
      
      // Store in localStorage for demo purposes
      localStorage.setItem('buyright_profile', JSON.stringify(profileDataToSave));
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Profile submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'profile') {
      setCurrentStep('location');
    }
  };

  const progressPercentage = currentStep === 'location' ? 50 : 100;

  return (
    <div className="duolingo-container">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          {/* BuyRight Branding */}
          <div className="mb-8">
            <BuyRightLogo size="xl" className="justify-center" />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            {currentStep === 'profile' && (
              <button
                onClick={handleBack}
                className="absolute left-0 p-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}
            
            <div>
              <h1 className="duolingo-title">
                {stepTitles[currentStep]}
              </h1>
              <p className="duolingo-subtitle">
                Step {currentStep === 'location' ? '1' : '2'} of 2
              </p>
            </div>

            {/* Skip Link (only on location step) */}
            {currentStep === 'location' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="absolute right-0 text-sm duolingo-link"
              >
                Skip for now
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: 'var(--duolingo-green)'
              }}
            />
          </div>

          {/* Step Description */}
          <p className="text-gray-600 text-sm mb-8">
            {stepDescriptions[currentStep]}
          </p>
        </div>

        {/* Content Card */}
        <div className="duolingo-card">
          {/* Step Content */}
          {currentStep === 'location' && (
            <div>
              <LocationSelection
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />

              {/* Continue Button */}
              <div className="mt-8">
                <button
                  onClick={handleLocationContinue}
                  disabled={!selectedLocation}
                  className="duolingo-button"
                >
                  Continue to Profile Setup
                </button>
              </div>
            </div>
          )}

          {currentStep === 'profile' && (
            <ProfileSetup
              onSubmit={handleProfileSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Welcome Message */}
        <div className="text-center mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm font-medium text-gray-800">
            Welcome to BuyRight! 👋
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Let's get you set up for your home buying journey
          </p>
        </div>
      </div>
    </div>
  );
}

export default withPageErrorBoundary(OnboardingPage, 'Onboarding');