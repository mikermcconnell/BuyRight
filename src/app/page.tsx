export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          BuyRight - Minimal Test
        </h1>
        <p className="text-lg text-gray-600">
          Testing Vercel deployment with absolute minimal setup
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Build timestamp: {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}