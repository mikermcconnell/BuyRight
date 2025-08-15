import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
        </ErrorBoundary>
        
        {/* Service Worker Registration for PWA */}
        <Script
          id="service-worker-registration"
          strategy="afterInteractive"
        >
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>
        
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