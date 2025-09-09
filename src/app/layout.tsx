import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import { RegionalProvider } from '@/contexts/RegionalContext';
import { JourneyProvider } from '@/contexts/JourneyContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ComplexityProvider } from '@/components/common/ComplexityToggle';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | BuyRight',
    default: 'BuyRight - Your Home Buying Journey',
  },
  description: 'Mobile-first interactive home buying platform with step-by-step guidance for first-time home buyers in Ontario, BC, and major US states.',
  keywords: ['home buying', 'first-time home buyer', 'real estate', 'mortgage calculator', 'home maintenance'],
  authors: [{ name: 'BuyRight Team' }],
  creator: 'BuyRight',
  publisher: 'BuyRight',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-white font-bold text-2xl">🏠</span>
                </div>
                <p className="text-gray-600">Loading BuyRight...</p>
              </div>
            </div>
          }>
            <AuthProvider>
              <RegionalProvider>
                <JourneyProvider>
                  <ComplexityProvider>
                    <div className="min-h-screen">
                      {children}
                    </div>
                  </ComplexityProvider>
                </JourneyProvider>
              </RegionalProvider>
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>
        
        {/* Service Worker Registration for PWA - Production Only */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="service-worker-registration"
            strategy="afterInteractive"
          >
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  // Check if service worker file exists before registration
                  fetch('/sw.js', { method: 'HEAD' })
                    .then(function(response) {
                      if (response.ok) {
                        return navigator.serviceWorker.register('/sw.js');
                      } else {
                        throw new Error('Service worker file not found');
                      }
                    })
                    .then(function(registration) {
                      console.log('SW registered successfully: ', registration.scope);
                    })
                    .catch(function(registrationError) {
                      console.warn('SW registration failed: ', registrationError);
                    });
                });
              } else {
                console.warn('Service Worker not supported in this browser');
              }
            `}
          </Script>
        )}
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}