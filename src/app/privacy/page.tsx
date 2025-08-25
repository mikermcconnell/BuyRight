'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <>
      <Header 
        title="Privacy Policy" 
        showLocation={false}
        showNotifications={false}
        showUserMenu={true}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
        <div className="prose prose-gray max-w-none">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">BuyRight Privacy Policy</h1>
          
          <p className="text-gray-600 text-sm mb-8">
            <strong>Effective Date:</strong> August 25, 2025<br />
            <strong>Last Updated:</strong> August 25, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Collect</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Account Info:</strong> Email address and encrypted password</li>
              <li><strong>Profile Info:</strong> Name, location, and home buying preferences</li>
              <li><strong>Progress Data:</strong> Journey steps completed and calculator results</li>
              <li><strong>Usage Data:</strong> How you use the app to improve our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide personalized home buying guidance</li>
              <li>Save your progress and calculator results</li>
              <li>Improve app features and user experience</li>
              <li>Send important account notifications (if enabled)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>We do not sell your personal information.</strong> We only share data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Supabase:</strong> Secure database hosting and authentication</li>
              <li><strong>Vercel:</strong> App hosting and delivery</li>
              <li><strong>Legal Requirements:</strong> Only when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Access:</strong> View your personal data anytime in your profile</li>
              <li><strong>Update:</strong> Change your information in account settings</li>
              <li><strong>Delete:</strong> Request account deletion through the app or email us</li>
              <li><strong>Withdraw Consent:</strong> Turn off notifications or delete your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We use industry-standard security measures including encryption, secure authentication, 
              and regular security updates to protect your information. Your data is stored securely 
              with Supabase, which provides enterprise-grade security and compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Deletion</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can delete your account at any time:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>In-app:</strong> Go to Profile → Security & Privacy → Delete Account</li>
              <li><strong>Email:</strong> Contact us at <a href="mailto:delete@buyright.app" className="text-primary-600 underline">delete@buyright.app</a></li>
              <li><strong>Timeline:</strong> All data permanently deleted within 30 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              BuyRight is not intended for users under 13 years old. We do not knowingly collect 
              personal information from children under 13. If we discover we have collected such 
              information, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about this privacy policy? Contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:privacy@buyright.app" className="text-primary-600 underline">privacy@buyright.app</a><br />
                <strong>Subject:</strong> Privacy Policy Question
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this policy occasionally. We'll notify you of significant changes 
              through the app or email. Continued use of BuyRight after changes means you 
              accept the updated policy.
            </p>
          </section>

          <div className="text-center mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-center text-gray-500 text-sm">
              This policy complies with Google Play Store requirements and applicable privacy laws.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}