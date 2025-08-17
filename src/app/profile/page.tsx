'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedUserProfile, ProfileCompleteness } from '@/types/profile';
import { supabaseService } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { withPageErrorBoundary } from '@/components/ui/PageErrorBoundary';
import { 
  UserIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const profileLogger = logger.createDomainLogger('profile');

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedUserProfile | null>(null);
  const [completeness, setCompleteness] = useState<ProfileCompleteness>({ 
    percentage: 0, 
    missing_fields: [], 
    suggestions: [] 
  });
  const [notifications, setNotifications] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (user && profile) {
      // Map existing profile to enhanced profile format
      const enhanced: EnhancedUserProfile = {
        user_id: user.id,
        first_name: user.email?.split('@')[0] || '',
        email: user.email,
        location: profile.location || 'ON',
        timeline_preference: profile.timeline_preference,
        home_type_preference: profile.home_type_preference || undefined,
        first_time_buyer: profile.first_time_buyer,
        budget_max: profile.budget_max || undefined,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };
      setEnhancedProfile(enhanced);
      calculateCompleteness(enhanced);
    }
  }, [user, profile]);

  const calculateCompleteness = (profileData: EnhancedUserProfile) => {
    const requiredFields = ['first_name', 'location', 'timeline_preference'];
    const importantFields = ['phone', 'budget_max', 'annual_income', 'employment_status', 'home_type_preference'];
    const optionalFields = ['last_name', 'bio', 'preferred_bedrooms', 'real_estate_agent_name'];
    
    let score = 0;
    const missing: string[] = [];
    const suggestions: string[] = [];

    // Required fields (20 points each)
    requiredFields.forEach(field => {
      if (profileData[field as keyof EnhancedUserProfile]) {
        score += 20;
      } else {
        missing.push(field);
      }
    });

    // Important fields (10 points each)
    importantFields.forEach(field => {
      if (profileData[field as keyof EnhancedUserProfile]) {
        score += 10;
      } else {
        suggestions.push(field);
      }
    });

    // Cap at 100%
    score = Math.min(score, 100);

    setCompleteness({
      percentage: score,
      missing_fields: missing,
      suggestions: suggestions
    });
  };

  const handleSaveProfile = async (updatedProfile: Partial<EnhancedUserProfile>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await supabaseService.createOrUpdateProfile(user.id, updatedProfile);
      await refreshProfile();
      setNotifications({ type: 'success', message: 'Profile updated successfully!' });
      profileLogger.info('Profile updated', { userId: user.id });
    } catch (error) {
      profileLogger.error('Error updating profile:', error as Error);
      setNotifications({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'preferences', name: 'Home Preferences', icon: CogIcon },
    { id: 'financial', name: 'Financial Info', icon: DocumentTextIcon },
    { id: 'security', name: 'Security & Privacy', icon: ShieldCheckIcon },
  ];

  if (!user || !enhancedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                  Your Profile
                </h1>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex md:ml-4 md:mt-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div className="flex items-center">
                        {completeness.percentage >= 80 ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="ml-1 text-sm text-gray-600">
                          {completeness.percentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Profile Completeness */}
            <div className="mt-8 rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-900">Profile Completeness</h3>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completeness.percentage}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {completeness.percentage}% of your profile is complete
                </p>
              </div>
              {completeness.suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600">Consider adding:</p>
                  <ul className="mt-1 text-xs text-gray-500">
                    {completeness.suggestions.slice(0, 3).map((field) => (
                      <li key={field}>• {field.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white shadow">
              {/* Notifications */}
              {notifications && (
                <div className={`rounded-t-lg p-4 ${
                  notifications.type === 'success' ? 'bg-green-50 text-green-800' :
                  notifications.type === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  <p className="text-sm">{notifications.message}</p>
                  <button 
                    onClick={() => setNotifications(null)}
                    className="ml-2 text-xs underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'personal' && (
                  <PersonalInfoTab 
                    profile={enhancedProfile} 
                    onSave={handleSaveProfile}
                    loading={loading}
                  />
                )}
                {activeTab === 'preferences' && (
                  <PreferencesTab 
                    profile={enhancedProfile} 
                    onSave={handleSaveProfile}
                    loading={loading}
                  />
                )}
                {activeTab === 'financial' && (
                  <FinancialTab 
                    profile={enhancedProfile} 
                    onSave={handleSaveProfile}
                    loading={loading}
                  />
                )}
                {activeTab === 'security' && (
                  <SecurityTab 
                    user={user}
                    profile={enhancedProfile} 
                    onSave={handleSaveProfile}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Information Tab Component
function PersonalInfoTab({ profile, onSave, loading }: { 
  profile: EnhancedUserProfile; 
  onSave: (updates: Partial<EnhancedUserProfile>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    display_name: profile.display_name || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    emergency_contact_name: profile.emergency_contact_name || '',
    emergency_contact_phone: profile.emergency_contact_phone || '',
    emergency_contact_relationship: profile.emergency_contact_relationship || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          This information helps us personalize your home buying experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="How you'd like to be addressed"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us a bit about yourself and your home buying goals..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-medium text-gray-900">Emergency Contact</h4>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Relationship</label>
            <select
              value={formData.emergency_contact_relationship}
              onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse/Partner</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// Home Preferences Tab Component
function PreferencesTab({ profile, onSave, loading }: { 
  profile: EnhancedUserProfile; 
  onSave: (updates: Partial<EnhancedUserProfile>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    timeline_preference: profile.timeline_preference || 'normal',
    home_type_preference: profile.home_type_preference || 'single_family',
    preferred_bedrooms: profile.preferred_bedrooms || 2,
    preferred_bathrooms: profile.preferred_bathrooms || 2,
    max_commute_time: profile.max_commute_time || 30,
    has_pets: profile.has_pets || false,
    pet_restrictions: profile.pet_restrictions || '',
    accessibility_needs: profile.accessibility_needs || '',
    special_requirements: profile.special_requirements || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Home Buying Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Help us find the perfect home by telling us your preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Buying Timeline</label>
          <select
            value={formData.timeline_preference}
            onChange={(e) => setFormData({ ...formData, timeline_preference: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="fast">Fast (0-3 months)</option>
            <option value="normal">Normal (3-6 months)</option>
            <option value="thorough">Thorough (6+ months)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Home Type</label>
          <select
            value={formData.home_type_preference}
            onChange={(e) => setFormData({ ...formData, home_type_preference: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="single_family">Single Family Home</option>
            <option value="condo">Condominium</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <select
            value={formData.preferred_bedrooms}
            onChange={(e) => setFormData({ ...formData, preferred_bedrooms: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}+ Bedroom{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <select
            value={formData.preferred_bathrooms}
            onChange={(e) => setFormData({ ...formData, preferred_bathrooms: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value={1}>1+ Bathroom</option>
            <option value={1.5}>1.5+ Bathrooms</option>
            <option value={2}>2+ Bathrooms</option>
            <option value={2.5}>2.5+ Bathrooms</option>
            <option value={3}>3+ Bathrooms</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Maximum Commute Time (minutes)
          </label>
          <input
            type="number"
            value={formData.max_commute_time}
            onChange={(e) => setFormData({ ...formData, max_commute_time: parseInt(e.target.value) })}
            min="5"
            max="120"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.has_pets}
              onChange={(e) => setFormData({ ...formData, has_pets: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              I have pets
            </label>
          </div>
          {formData.has_pets && (
            <textarea
              rows={2}
              value={formData.pet_restrictions}
              onChange={(e) => setFormData({ ...formData, pet_restrictions: e.target.value })}
              placeholder="Describe your pets and any specific requirements..."
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Accessibility Needs
          </label>
          <textarea
            rows={2}
            value={formData.accessibility_needs}
            onChange={(e) => setFormData({ ...formData, accessibility_needs: e.target.value })}
            placeholder="Any accessibility requirements or modifications needed..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Special Requirements
          </label>
          <textarea
            rows={3}
            value={formData.special_requirements}
            onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
            placeholder="Any other specific requirements or preferences..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
}

// Financial Information Tab Component
function FinancialTab({ profile, onSave, loading }: { 
  profile: EnhancedUserProfile; 
  onSave: (updates: Partial<EnhancedUserProfile>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    employment_status: profile.employment_status || 'employed',
    annual_income: profile.annual_income || 0,
    credit_score_range: profile.credit_score_range || 'good',
    budget_max: profile.budget_max || 0,
    current_living_situation: profile.current_living_situation || 'renting',
    current_rent_amount: profile.current_rent_amount || 0,
    down_payment_saved: profile.down_payment_saved || 0,
    down_payment_percentage: profile.down_payment_percentage || 10,
    mortgage_pre_approved: profile.mortgage_pre_approved || false,
    pre_approval_amount: profile.pre_approval_amount || 0,
    pre_approval_expiry: profile.pre_approval_expiry || '',
    lender_name: profile.lender_name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Financial Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          This information helps us provide accurate affordability estimates. All information is kept confidential.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Status</label>
          <select
            value={formData.employment_status}
            onChange={(e) => setFormData({ ...formData, employment_status: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="employed">Employed</option>
            <option value="self_employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={formData.annual_income}
              onChange={(e) => setFormData({ ...formData, annual_income: parseFloat(e.target.value) || 0 })}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="75,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credit Score Range</label>
          <select
            value={formData.credit_score_range}
            onChange={(e) => setFormData({ ...formData, credit_score_range: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="poor">Poor (300-579)</option>
            <option value="fair">Fair (580-669)</option>
            <option value="good">Good (670-739)</option>
            <option value="very_good">Very Good (740-799)</option>
            <option value="excellent">Excellent (800+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Budget</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={formData.budget_max}
              onChange={(e) => setFormData({ ...formData, budget_max: parseFloat(e.target.value) || 0 })}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="500,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Living Situation</label>
          <select
            value={formData.current_living_situation}
            onChange={(e) => setFormData({ ...formData, current_living_situation: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="renting">Renting</option>
            <option value="living_with_family">Living with Family</option>
            <option value="owned">Currently Own</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.current_living_situation === 'renting' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Rent Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.current_rent_amount}
                onChange={(e) => setFormData({ ...formData, current_rent_amount: parseFloat(e.target.value) || 0 })}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="2,000"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Down Payment Saved</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={formData.down_payment_saved}
              onChange={(e) => setFormData({ ...formData, down_payment_saved: parseFloat(e.target.value) || 0 })}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="50,000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Down Payment Percentage</label>
          <select
            value={formData.down_payment_percentage}
            onChange={(e) => setFormData({ ...formData, down_payment_percentage: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={25}>25%</option>
          </select>
        </div>
      </div>

      {/* Mortgage Pre-approval Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.mortgage_pre_approved}
            onChange={(e) => setFormData({ ...formData, mortgage_pre_approved: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-900">
            I have mortgage pre-approval
          </label>
        </div>

        {formData.mortgage_pre_approved && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pre-approval Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={formData.pre_approval_amount}
                  onChange={(e) => setFormData({ ...formData, pre_approval_amount: parseFloat(e.target.value) || 0 })}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="500,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                value={formData.pre_approval_expiry}
                onChange={(e) => setFormData({ ...formData, pre_approval_expiry: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Lender Name</label>
              <input
                type="text"
                value={formData.lender_name}
                onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., TD Bank, RBC, etc."
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Financial Info'}
        </button>
      </div>
    </form>
  );
}

// Security & Privacy Tab Component
function SecurityTab({ user, profile, onSave, loading }: { 
  user: { id: string; email: string; email_verified: boolean };
  profile: EnhancedUserProfile; 
  onSave: (updates: Partial<EnhancedUserProfile>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    notifications_enabled: profile.notifications_enabled ?? true,
    marketing_emails: profile.marketing_emails ?? false,
    preferred_communication: profile.preferred_communication || 'email',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Security & Privacy Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and privacy preferences.
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
            <dd className="text-sm text-gray-900">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
            <dd className="text-sm text-gray-900">
              {user.email_verified ? 'Yes' : 'No'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Communication Preferences */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-base font-medium text-gray-900">Communication Preferences</h4>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
              <select
                value={formData.preferred_communication}
                onChange={(e) => setFormData({ ...formData, preferred_communication: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">Text Message (SMS)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications_enabled}
                  onChange={(e) => setFormData({ ...formData, notifications_enabled: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable notifications for important updates
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.marketing_emails}
                  onChange={(e) => setFormData({ ...formData, marketing_emails: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Receive marketing emails and newsletters
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Account Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-medium text-gray-900">Account Actions</h4>
        <div className="mt-4 space-y-3">
          <button className="text-sm text-primary-600 hover:text-primary-500">
            Change Password
          </button>
          <br />
          <button className="text-sm text-primary-600 hover:text-primary-500">
            Download My Data
          </button>
          <br />
          <button className="text-sm text-red-600 hover:text-red-500">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default withPageErrorBoundary(ProfilePage, 'Profile');