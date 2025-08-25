'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/navigation/Header';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE' || !user) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Sign out the user
        await signOut();
        
        // Redirect to confirmation page
        router.push('/delete-account/success');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header title="Delete Account" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Required</h1>
            <p className="text-gray-600 mb-6">You must be signed in to delete your account.</p>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Delete Account" />
      <div className="max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen">
        
        {!showConfirmation ? (
          <div>
            <div className="text-center mb-8">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Delete Your Account</h1>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-red-900 mb-4">What will be deleted:</h2>
              <ul className="list-disc list-inside text-red-800 space-y-2">
                <li>Your account and profile information</li>
                <li>All home buying journey progress</li>
                <li>Saved calculator sessions and results</li>
                <li>Preferences and settings</li>
                <li>All personal data associated with your account</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-yellow-900 mb-4">Before you delete your account:</h2>
              <ul className="list-disc list-inside text-yellow-800 space-y-2">
                <li>Download any calculator results you want to keep</li>
                <li>Save any important notes from your journey progress</li>
                <li>Consider if you might want to use BuyRight again in the future</li>
                <li>Review our Privacy Policy for data deletion details</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowConfirmation(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-4"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                I Want to Delete My Account
              </button>
              
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Confirmation</h1>
              <p className="text-gray-600">Please confirm you want to permanently delete your account</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account to be deleted:</h3>
              <p className="text-gray-700 font-medium">{user.email}</p>
            </div>

            <div className="mb-8">
              <label htmlFor="confirmText" className="block text-sm font-medium text-gray-900 mb-2">
                Type "DELETE" to confirm account deletion:
              </label>
              <input
                type="text"
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type DELETE here"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE' || isDeleting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Permanently Delete Account
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have questions about account deletion or need assistance, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Email: <a href="mailto:privacy@buyright.app" className="text-blue-600 underline">privacy@buyright.app</a>
              </p>
              <p className="text-sm text-gray-600">
                Account Deletion: <a href="mailto:delete@buyright.app" className="text-blue-600 underline">delete@buyright.app</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}