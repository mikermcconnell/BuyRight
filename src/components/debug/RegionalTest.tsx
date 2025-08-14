'use client';

import React, { useState } from 'react';
import { useRegional } from '@/contexts/RegionalContext';
import { useJourney } from '@/contexts/JourneyContext';
import { RegionCode } from '@/types/regional';

export function RegionalTest() {
  const { 
    currentRegion, 
    availableRegions, 
    changeRegion, 
    loading,
    getCacheStats,
    clearCache,
    preloadRegions
  } = useRegional();
  
  const { 
    phases, 
    progressPercentage,
    completedStepsCount,
    totalStepsCount 
  } = useJourney();

  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleRegionChange = async (regionCode: RegionCode) => {
    const success = await changeRegion(regionCode);
    if (success) {
      console.log(`Successfully changed to region: ${regionCode}`);
    } else {
      console.error(`Failed to change to region: ${regionCode}`);
    }
  };

  const handleGetCacheStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
    console.log('Cache Stats:', stats);
  };

  const handleClearCache = () => {
    clearCache();
    setCacheStats(null);
    console.log('Cache cleared');
  };

  const handlePreloadRegions = async () => {
    setIsPreloading(true);
    try {
      await preloadRegions();
      console.log('Regions preloaded successfully');
    } catch (error) {
      console.error('Preloading failed:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">Loading regional test...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🧪 Regional Customization Test</h2>
      
      {/* Current Region Info */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Current Region</h3>
        <p className="text-lg">
          <strong>{currentRegion}</strong> - {availableRegions.find(r => r.code === currentRegion)?.name}
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Journey Progress: {progressPercentage.toFixed(1)}%</p>
          <p>Completed Steps: {completedStepsCount}/{totalStepsCount}</p>
          <p>Available Phases: {phases.length}</p>
        </div>
      </div>

      {/* Region Selection */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Test Different Regions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableRegions.map(region => (
            <button
              key={region.code}
              onClick={() => handleRegionChange(region.code)}
              className={`
                p-2 rounded-lg text-sm font-medium transition-colors
                ${region.code === currentRegion
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {region.code}
              <br />
              <span className="text-xs opacity-75">{region.currency}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Journey Steps Preview */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Journey Steps for {currentRegion}</h3>
        <div className="max-h-40 overflow-y-auto">
          {phases.map(phase => (
            <div key={phase.id} className="mb-2">
              <p className="font-medium text-gray-800">
                {phase.icon} {phase.title} ({phase.steps.length} steps)
              </p>
              <ul className="ml-4 text-sm text-gray-600">
                {phase.steps.slice(0, 2).map(step => (
                  <li key={step.id} className="truncate">
                    • {step.title}
                  </li>
                ))}
                {phase.steps.length > 2 && (
                  <li className="text-gray-400">
                    ... and {phase.steps.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Overrides Test */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Regional-Specific Steps</h3>
        <div className="text-sm">
          {currentRegion === 'ON' && (
            <div className="p-2 bg-green-50 rounded border-green-200 border">
              <p className="text-green-800">
                <strong>Ontario Specific:</strong> Region-specific customizations active
              </p>
            </div>
          )}
          {currentRegion === 'BC' && (
            <div className="p-2 bg-blue-50 rounded border-blue-200 border">
              <p className="text-blue-800">
                <strong>BC Specific:</strong> Property Transfer Tax information should be included
              </p>
            </div>
          )}
          {currentRegion?.startsWith('US_') && (
            <div className="p-2 bg-purple-50 rounded border-purple-200 border">
              <p className="text-purple-800">
                <strong>US Specific:</strong> Using base US template with state-specific regulations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Performance & Caching</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={handleGetCacheStats}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Get Cache Stats
          </button>
          <button
            onClick={handleClearCache}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Clear Cache
          </button>
          <button
            onClick={handlePreloadRegions}
            disabled={isPreloading}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isPreloading ? 'Preloading...' : 'Preload Regions'}
          </button>
        </div>
        
        {cacheStats && (
          <div className="text-sm bg-gray-50 p-2 rounded">
            <p><strong>Cache Size:</strong> {cacheStats.size} regions</p>
            <p><strong>Hit Rate:</strong> {cacheStats.hitRate}%</p>
            <p><strong>Total Requests:</strong> {cacheStats.totalRequests}</p>
            <p><strong>Cache Hits:</strong> {cacheStats.metrics.cacheHits}</p>
            <p><strong>Cache Misses:</strong> {cacheStats.metrics.cacheMisses}</p>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Open browser console to see detailed logs of region changes and caching behavior.
      </div>
    </div>
  );
}