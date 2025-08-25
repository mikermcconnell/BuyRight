'use client';

import Header from '@/components/navigation/Header';

export default function PrivacyPolicyPage() {
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              BuyRight ("we," "our," or "us") is a home buying guidance application designed to help first-time home buyers navigate the complex home purchasing process. We are committed to protecting your privacy and ensuring transparent data practices. This Privacy Policy explains how we collect, use, protect, and handle your information when you use our mobile application and related services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Account Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Email address (for authentication and account management)</li>
              <li>Encrypted password (handled securely by our authentication provider)</li>
              <li>Email verification status</li>
              <li>Account creation and last update timestamps</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Profile Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Location/Region (Ontario, British Columbia, or US states)</li>
              <li>Maximum budget preferences for home buying</li>
              <li>Timeline preferences (fast, normal, or thorough approach)</li>
              <li>Home type preferences (single family, condo, or townhouse)</li>
              <li>First-time buyer status</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Journey Progress Data</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Home buying steps you have completed</li>
              <li>Progress through different phases of the home buying journey</li>
              <li>Completion timestamps and notes</li>
              <li>Checklist items and step-specific data</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">2.4 Financial Calculator Data</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Mortgage calculator inputs and results</li>
              <li>Affordability calculator inputs and results</li>
              <li>Closing costs calculator inputs and results</li>
              <li>Saved calculator sessions for your reference</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">2.5 Technical Data</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Device information (mobile device type, operating system version)</li>
              <li>App usage data (features accessed, time spent in app)</li>
              <li>Session data and authentication tokens</li>
              <li>Local storage data for offline functionality</li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-900 mb-2">Financial Information We Do NOT Collect:</h4>
              <ul className="list-disc list-inside text-red-800 space-y-1">
                <li>Banking account numbers or financial account information</li>
                <li>Credit card details or payment information</li>
                <li>Social Security Numbers or Social Insurance Numbers</li>
                <li>Actual financial account data or balances</li>
                <li>Credit scores or credit report information</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Core App Functionality</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Provide personalized home buying guidance based on your location and preferences</li>
              <li>Save and track your progress through the home buying journey</li>
              <li>Deliver region-specific content, calculations, and legal requirements</li>
              <li>Enable offline functionality through local data storage</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Account Management</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Authenticate your identity and manage your account</li>
              <li>Remember your preferences and settings</li>
              <li>Provide customer support when requested</li>
              <li>Send important account-related communications</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 App Improvement</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Analyze app usage patterns to improve user experience</li>
              <li>Identify and fix technical issues</li>
              <li>Develop new features based on user needs</li>
              <li>Ensure app performance and reliability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Third-Party Service Providers</h3>
            <p className="text-gray-700 mb-4">We share information with the following trusted service providers who help us operate our app:</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Supabase (Database & Authentication)</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Stores user accounts, profiles, and app data securely</li>
                <li>Provides authentication and session management</li>
                <li>Data stored in secure cloud infrastructure (US/Singapore regions)</li>
                <li>Supabase Privacy Policy: <a href="https://supabase.com/privacy" className="underline">https://supabase.com/privacy</a></li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Vercel (Hosting & Deployment)</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Provides app hosting and content delivery</li>
                <li>Processes technical data for app performance</li>
                <li>Vercel Privacy Policy: <a href="https://vercel.com/legal/privacy-policy" className="underline">https://vercel.com/legal/privacy-policy</a></li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 We Do NOT Sell or Share Data For:</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Advertising or marketing purposes</li>
              <li>Data broking or commercial data sales</li>
              <li>Third-party marketing campaigns</li>
              <li>Unrelated business purposes</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">4.3 Legal Requirements</h3>
            <p className="text-gray-700 mb-4">We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">We implement comprehensive security measures to protect your information:</p>
            
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using industry-standard HTTPS/TLS encryption</li>
              <li><strong>Authentication:</strong> Secure authentication provided by Supabase with enterprise-grade security protocols</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Infrastructure Security:</strong> Data stored in secure, monitored cloud infrastructure</li>
              <li><strong>Regular Security Reviews:</strong> Ongoing security assessments and improvements</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> While we implement strong security measures, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your information using industry best practices.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention and Deletion</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 Data Retention</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion</li>
              <li><strong>Journey Progress:</strong> Stored to maintain your progress and provide continuous service</li>
              <li><strong>Calculator Data:</strong> Retained to provide historical calculations and insights</li>
              <li><strong>Technical Logs:</strong> May be retained for up to 90 days for security and debugging purposes</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 Account Deletion</h3>
            <p className="text-gray-700 mb-4">You have the right to delete your account and all associated data. When you request account deletion:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>All personal information and account data will be permanently deleted</li>
              <li>Journey progress and calculator sessions will be removed</li>
              <li>Profile information and preferences will be deleted</li>
              <li>Deletion will be completed within 30 days of your request</li>
              <li>Some anonymized, aggregated data may be retained for app improvement purposes</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">How to Delete Your Account:</h4>
              <p className="text-green-800 mb-2"><strong>Option 1 - In the App:</strong></p>
              <ol className="list-decimal list-inside text-green-800 mb-3 space-y-1">
                <li>Open the BuyRight app</li>
                <li>Go to your Profile or Settings</li>
                <li>Select "Delete Account"</li>
                <li>Follow the confirmation steps</li>
              </ol>
              <p className="text-green-800 mb-2"><strong>Option 2 - Email Request:</strong></p>
              <p className="text-green-800">Send an email to <a href="mailto:privacy@buyright.app" className="underline font-medium">privacy@buyright.app</a> with your account email and deletion request.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">7.1 Access and Portability</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Access your personal information through your account dashboard</li>
              <li>Request a copy of your data in a portable format</li>
              <li>View your journey progress and calculator history</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">7.2 Correction and Updates</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Update your profile information and preferences at any time</li>
              <li>Correct inaccurate information through your account settings</li>
              <li>Modify your location and home buying preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">7.3 Deletion and Opt-Out</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Delete your account and all associated data (see Section 6.2)</li>
              <li>Opt out of non-essential communications</li>
              <li>Disable certain app features through settings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              BuyRight is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal information from a child under 13, we will take steps to delete such information promptly.
            </p>
            <p className="text-gray-700">
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:privacy@buyright.app" className="text-blue-600 underline">privacy@buyright.app</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be stored and processed in countries other than your own. Our primary service provider, Supabase, operates data centers in the United States and Singapore. By using BuyRight, you consent to the transfer of your information to these countries, which may have different data protection laws than your country of residence.
            </p>
            <p className="text-gray-700">
              We ensure that appropriate safeguards are in place for international data transfers, including contractual protections and compliance with applicable data protection frameworks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. We will notify you of material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Posting the updated policy in the app with a new "Last Updated" date</li>
              <li>Sending you an email notification if you have an account with us</li>
              <li>Displaying a prominent notice in the app about the policy changes</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of BuyRight after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">BuyRight Privacy Team</h3>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:privacy@buyright.app" className="text-blue-600 underline">privacy@buyright.app</a></p>
              <p className="text-gray-700 mb-2"><strong>Data Protection Requests:</strong> <a href="mailto:data@buyright.app" className="text-blue-600 underline">data@buyright.app</a></p>
              <p className="text-gray-700 mb-2"><strong>Account Deletion:</strong> <a href="mailto:delete@buyright.app" className="text-blue-600 underline">delete@buyright.app</a></p>
              <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond to privacy-related inquiries within 5 business days.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Additional Information for California Residents</h2>
            <p className="text-gray-700 mb-4">
              Under the California Consumer Privacy Act (CCPA), California residents have additional rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Right to Know:</strong> Request information about the categories and specific pieces of personal information we collect</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information we have collected</li>
              <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your privacy rights</li>
              <li><strong>Right to Opt-Out:</strong> We do not sell personal information, so no opt-out is necessary</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact us at <a href="mailto:privacy@buyright.app" className="text-blue-600 underline">privacy@buyright.app</a> with "CCPA Request" in the subject line.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of August 25, 2025. BuyRight is committed to protecting your privacy and maintaining transparent data practices.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}