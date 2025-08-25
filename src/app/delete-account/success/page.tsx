'use client';

import { useRouter } from 'next/navigation';
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function AccountDeletedSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Deleted Successfully</h1>
        
        <p className="text-gray-600 mb-8">
          Your BuyRight account and all associated data have been permanently deleted. 
          This process will be completed within 30 days as outlined in our Privacy Policy.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-3">What happens next:</h2>
          <ul className="text-left list-disc list-inside text-green-800 space-y-2">
            <li>All your personal data will be permanently removed</li>
            <li>Your journey progress and calculator sessions are deleted</li>
            <li>Account deletion will be completed within 30 days</li>
            <li>You will no longer receive any communications from us</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Changed your mind?</h2>
          <p className="text-blue-800 mb-4">
            If you decide you want to use BuyRight again in the future, you can create a new account. 
            However, your previous data cannot be recovered.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Return to Home Page
          </button>
          
          <button
            onClick={() => router.push('/register')}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Account
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Thank you for using BuyRight. We wish you the best in your home buying journey.
          </p>
        </div>
      </div>
    </div>
  );
}