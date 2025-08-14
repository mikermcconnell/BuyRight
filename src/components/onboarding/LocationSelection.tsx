'use client';

import React, { useState, useEffect } from 'react';
import { MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { RegionCode, RegionalInfo } from '@/types/regional';
import { getAvailableRegions, getRegionalInfo } from '@/lib/regional';
import { useRegional } from '@/contexts/RegionalContext';

interface LocationOption extends RegionalInfo {
  description: string;
  flag?: string;
  popular?: boolean;
  comingSoon?: boolean;
}

// Enhanced location options with regional data integration
const getLocationOptions = (): LocationOption[] => {
  const availableRegions = getAvailableRegions();
  
  const locationDescriptions: Record<RegionCode, string> = {
    'ON': 'Toronto, Ottawa, Hamilton, and more',
    'BC': 'Vancouver, Victoria, Surrey, and more', 
    'US_CA': 'Los Angeles, San Francisco, San Diego, and more',
    'US_NY': 'NYC, Albany, Buffalo, and more',
    'US_TX': 'Houston, Dallas, Austin, and more',
    'US_FL': 'Miami, Orlando, Tampa, and more',
  };

  const locationFlags: Record<string, string> = {
    'CA': '🇨🇦',
    'US': '🇺🇸',
  };

  const popularRegions: RegionCode[] = ['ON', 'BC', 'US_CA', 'US_NY'];
  const comingSoonRegions: RegionCode[] = ['US_TX', 'US_FL']; // Regions not yet fully implemented

  return availableRegions.map((region): LocationOption => ({
    ...region,
    description: locationDescriptions[region.code] || 'Major cities and surrounding areas',
    flag: locationFlags[region.country],
    popular: popularRegions.includes(region.code),
    comingSoon: comingSoonRegions.includes(region.code),
  }));
};

interface LocationSelectionProps {
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  className?: string;
  showRegionalInfo?: boolean; // Show additional regional info like currency, taxes
}

export default function LocationSelection({
  selectedLocation,
  onLocationSelect,
  className = '',
  showRegionalInfo = false,
}: LocationSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const { currentRegion, changeRegion, loading: regionalLoading } = useRegional();

  // Initialize location options
  useEffect(() => {
    const options = getLocationOptions();
    setLocationOptions(options);
  }, []);

  // Filter locations based on search query
  const filteredLocations = locationOptions.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort locations: popular first, then alphabetically
  const sortedLocations = filteredLocations.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.name.localeCompare(b.name);
  });

  // Handle location selection with regional context integration
  const handleLocationSelect = async (regionCode: RegionCode) => {
    // Update parent component
    onLocationSelect(regionCode);
    
    // Update regional context
    const success = await changeRegion(regionCode);
    if (!success) {
      console.error('Failed to change region context');
    }
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPinIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Search for your location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Popular Locations Label */}
      {!searchQuery && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Locations</h3>
        </div>
      )}

      {/* Location Options */}
      <div className="space-y-3">
        {sortedLocations.map((location) => (
          <button
            key={location.code}
            onClick={() => !location.comingSoon && handleLocationSelect(location.code)}
            disabled={location.comingSoon || regionalLoading}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              selectedLocation === location.code
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : location.comingSoon
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Flag */}
                <div className="text-2xl">{location.flag}</div>
                
                {/* Location Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{location.name}</h4>
                    {location.popular && !searchQuery && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                        Popular
                      </span>
                    )}
                    {location.comingSoon && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  
                  {/* Additional Regional Info */}
                  {showRegionalInfo && !location.comingSoon && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{location.currency}</span>
                      {location.taxSystem.landTransferTax && (
                        <span>LTT: {location.taxSystem.landTransferTax}%</span>
                      )}
                      {location.taxSystem.propertyTransferTax && (
                        <span>PTT: {location.taxSystem.propertyTransferTax}%</span>
                      )}
                      {(location.regulations.coolingOffPeriod ?? 0) > 0 && (
                        <span>Cooling-off: {location.regulations.coolingOffPeriod} days</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              <div className="ml-4">
                {regionalLoading && selectedLocation === location.code ? (
                  <div className="w-6 h-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : selectedLocation === location.code ? (
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : location.comingSoon ? (
                  <div className="w-6 h-6 rounded-full bg-gray-300" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* No Results Message */}
      {searchQuery && filteredLocations.length === 0 && (
        <div className="text-center py-8">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No locations found</h3>
          <p className="mt-2 text-gray-500">
            We couldn't find any locations matching "{searchQuery}". Try a different search term.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary-600 hover:text-primary-500 font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Why do we need your location?</h4>
            <p className="mt-1 text-sm text-blue-700">
              Home buying processes, costs, and regulations vary significantly by region. 
              We customize your journey based on local requirements and market conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Locations Info */}
      {!searchQuery && sortedLocations.some(loc => loc.comingSoon) && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don't see your location?{' '}
            <a href="mailto:support@buyright.app" className="text-primary-600 hover:text-primary-500">
              Let us know
            </a>{' '}
            and we'll prioritize adding it.
          </p>
        </div>
      )}
    </div>
  );
}