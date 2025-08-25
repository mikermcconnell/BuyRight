'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedUserProfile, ProfileCompleteness } from '@/types/profile';
import { supabaseService } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { withPageErrorBoundary } from '@/components/ui/PageErrorBoundary';
import { 
  UserIcon, 
  ShieldCheckIcon, 
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
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };
      setEnhancedProfile(enhanced);
      calculateCompleteness(enhanced);
    }
  }, [user, profile]);

  const calculateCompleteness = (profileData: EnhancedUserProfile) => {
    const requiredFields = ['first_name'];
    const importantFields = ['last_name'];
    
    let score = 0;
    const missing: string[] = [];
    const suggestions: string[] = [];

    // Required fields (50 points)
    if (profileData.first_name) {
      score += 50;
    } else {
      missing.push('first_name');
    }

    // Important fields (50 points)
    if (profileData.last_name) {
      score += 50;
    } else {
      suggestions.push('last_name');
    }

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
          Basic information for your BuyRight profile.
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
            required
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
          <p className="mt-1 text-sm text-gray-500">
            Optional - defaults to your first name if not provided
          </p>
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
              {(user as any).created_at ? new Date((user as any).created_at).toLocaleDateString() : 'N/A'}
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

      {/* Privacy & Legal */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-medium text-gray-900">Privacy & Legal</h4>
        <div className="mt-4 space-y-3">
          <button 
            onClick={() => window.location.href = '/privacy'}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Privacy Policy
          </button>
          <br />
          <button className="text-sm text-primary-600 hover:text-primary-500">
            Download My Data
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-medium text-gray-900">Account Actions</h4>
        <div className="mt-4 space-y-3">
          <button className="text-sm text-primary-600 hover:text-primary-500">
            Change Password
          </button>
          <br />
          <button 
            onClick={() => window.location.href = '/delete-account'}
            className="text-sm text-red-600 hover:text-red-500"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default withPageErrorBoundary(ProfilePage, 'Profile');