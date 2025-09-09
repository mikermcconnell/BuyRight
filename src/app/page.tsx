import Link from 'next/link';

export default function Home() {

  return (
    <div className="duolingo-container">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">🏠</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            The free, fun, and effective way to
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-12 leading-tight" style={{ color: 'var(--duolingo-green)' }}>
            buy a home!
          </h2>
        </header>

        {/* Main Content Card */}
        <div className="duolingo-card max-w-md mx-auto">
          <div className="space-y-4">
            <Link 
              href="/onboarding"
              className="duolingo-button block text-center"
            >
              GET STARTED
            </Link>
            
            <Link 
              href="/dashboard"
              className="block w-full py-3 px-4 font-bold text-gray-700 border-2 border-gray-300 rounded-lg transition-all duration-200 text-base text-center hover:border-gray-400"
            >
              VIEW DASHBOARD
            </Link>
            
            <Link 
              href="/calculators"
              className="block w-full py-3 px-4 font-bold text-gray-700 border-2 border-gray-300 rounded-lg transition-all duration-200 text-base text-center hover:border-gray-400"
            >
              MORTGAGE CALCULATORS
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-bold text-green-500">10,000+</div>
              <div className="text-sm text-gray-600">Happy Homeowners</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-lg font-bold text-green-500">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}