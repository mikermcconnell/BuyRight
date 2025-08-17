'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  RegionCode, 
  RegionalContent, 
  RegionalInfo, 
  RegionalContextState,
  UserLocation
} from '@/types/regional';
import { 
  loadRegionalContent, 
  getAvailableRegions, 
  detectUserRegion,
  getRegionalInfo,
  isValidRegionCode
} from '@/lib/regional';
import { 
  loadRegionalContentOptimized,
  preloadCommonRegions,
  cacheUtils
} from '@/lib/regionalOptimized';
// Removed AuthContext dependency
import { FINANCIAL_CONSTANTS } from '@/lib/constants';

interface RegionalContextType extends RegionalContextState {
  // Actions
  changeRegion: (regionCode: RegionCode) => Promise<boolean>;
  refreshRegionalContent: () => Promise<void>;
  
  // Utilities
  formatCurrency: (amount: number) => string;
  getTaxRate: (taxType: string) => number;
  isRegionSupported: (code: string) => boolean;
  
  // Performance & Cache Management
  getCacheStats: () => any;
  preloadRegions: () => Promise<void>;
  clearCache: () => void;
}

const RegionalContext = createContext<RegionalContextType | undefined>(undefined);

interface RegionalProviderProps {
  children: ReactNode;
  defaultRegion?: RegionCode;
}

export function RegionalProvider({ children, defaultRegion }: RegionalProviderProps) {
  const [state, setState] = useState<RegionalContextState>({
    currentRegion: null,
    regionalContent: null,
    loading: true,
    error: null,
    availableRegions: getAvailableRegions(),
  });

  // Removed useAuth dependency - using mock data for demo

  // Initialize regional context
  useEffect(() => {
    initializeRegionalContext();
    
    // Preload common regions for better performance
    preloadCommonRegions().catch(error =>
      console.warn('Regional preloading failed:', error)
    );
  }, [defaultRegion]);

  const initializeRegionalContext = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Determine initial region
      let targetRegion: RegionCode;

      if (defaultRegion && isValidRegionCode(defaultRegion)) {
        targetRegion = defaultRegion;
      } else {
        // Use saved profile or default region for demo
        const savedProfile = localStorage.getItem('buyright_profile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile?.location && isValidRegionCode(profile.location)) {
            targetRegion = profile.location as RegionCode;
          } else {
            targetRegion = detectUserRegion();
          }
        } else {
          targetRegion = detectUserRegion();
        }
      }

      // Load regional content with optimized system
      const result = await loadRegionalContentOptimized(targetRegion);

      if (result.success && result.content) {
        setState(prev => ({
          ...prev,
          currentRegion: targetRegion,
          regionalContent: result.content!,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to load regional content',
        }));
      }
    } catch (error) {
      console.error('Error initializing regional context:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to initialize regional context',
      }));
    }
  };

  const changeRegion = async (regionCode: RegionCode): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await loadRegionalContentOptimized(regionCode);

      if (result.success && result.content) {
        setState(prev => ({
          ...prev,
          currentRegion: regionCode,
          regionalContent: result.content!,
          loading: false,
          error: null,
        }));

        // Update user profile with new location if user exists (demo mode)
        try {
          // In demo mode, we'll just save to localStorage
          const savedProfile = localStorage.getItem('buyright_profile');
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            profile.location = regionCode;
            localStorage.setItem('buyright_profile', JSON.stringify(profile));
          }
        } catch (profileError) {
          console.error('Failed to update user profile with new region:', profileError);
          // Don't fail the region change if profile update fails
        }

        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to load regional content',
        }));
        return false;
      }
    } catch (error) {
      console.error('Error changing region:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to change region',
      }));
      return false;
    }
  };

  const refreshRegionalContent = async (): Promise<void> => {
    if (!state.currentRegion) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await loadRegionalContentOptimized(state.currentRegion);

      if (result.success && result.content) {
        setState(prev => ({
          ...prev,
          regionalContent: result.content!,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Failed to refresh regional content',
        }));
      }
    } catch (error) {
      console.error('Error refreshing regional content:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh regional content',
      }));
    }
  };

  const formatCurrency = (amount: number): string => {
    if (!state.currentRegion) return amount.toString();

    const region = getRegionalInfo(state.currentRegion);
    const currency = region?.currency || 'CAD';
    const locale = region?.country === 'US' ? 'en-US' : 'en-CA';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getTaxRate = (taxType: string): number => {
    if (!state.currentRegion || !state.regionalContent) return 0;

    const region = state.regionalContent.region;
    return (region.taxSystem as any)[taxType] || 0;
  };

  const isRegionSupported = (code: string): boolean => {
    return isValidRegionCode(code);
  };

  // Performance and cache management functions
  const getCacheStats = () => {
    return cacheUtils.getStats();
  };

  const preloadRegions = async () => {
    try {
      await preloadCommonRegions();
      console.log('Regional preloading completed successfully');
    } catch (error) {
      console.error('Failed to preload regions:', error);
    }
  };

  const clearCache = () => {
    cacheUtils.clear();
  };

  const value: RegionalContextType = {
    ...state,
    changeRegion,
    refreshRegionalContent,
    formatCurrency,
    getTaxRate,
    isRegionSupported,
    getCacheStats,
    preloadRegions,
    clearCache,
  };

  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
}

// Custom hook to use regional context
export function useRegional(): RegionalContextType {
  const context = useContext(RegionalContext);
  if (context === undefined) {
    throw new Error('useRegional must be used within a RegionalProvider');
  }
  return context;
}

// Hook for accessing regional content with error handling
export function useRegionalContent() {
  const { regionalContent, currentRegion, loading, error } = useRegional();

  return {
    content: regionalContent,
    region: currentRegion,
    loading,
    error,
    hasContent: !!regionalContent,
  };
}

// Hook for regional calculations and utilities
export function useRegionalUtils() {
  const { formatCurrency, getTaxRate, isRegionSupported, currentRegion } = useRegional();

  const calculateClosingCosts = (homePrice: number) => {
    if (!currentRegion) return null;

    // This would use the regional calculation logic
    // For now, return a simple calculation
    const landTransferTax = homePrice * (getTaxRate('landTransferTax') / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR);
    const propertyTransferTax = homePrice * (getTaxRate('propertyTransferTax') / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR);
    const legalFees = FINANCIAL_CONSTANTS.ESTIMATED_LEGAL_FEES;
    const insurance = homePrice * FINANCIAL_CONSTANTS.INSURANCE_RATE;

    const total = landTransferTax + propertyTransferTax + legalFees + insurance;

    return {
      landTransferTax,
      propertyTransferTax,
      legalFees,
      insurance,
      total,
      formatted: {
        landTransferTax: formatCurrency(landTransferTax),
        propertyTransferTax: formatCurrency(propertyTransferTax),
        legalFees: formatCurrency(legalFees),
        insurance: formatCurrency(insurance),
        total: formatCurrency(total),
      },
    };
  };

  return {
    formatCurrency,
    getTaxRate,
    isRegionSupported,
    calculateClosingCosts,
    currentRegion,
  };
}

// Hook for regional step information
export function useRegionalSteps() {
  const { regionalContent, currentRegion } = useRegional();

  const getStepsByPhase = (phase: string) => {
    if (!regionalContent) return [];
    return regionalContent.steps.filter(step => step.category === phase);
  };

  const getStepById = (stepId: string) => {
    if (!regionalContent) return null;
    return regionalContent.steps.find(step => step.id === stepId) || null;
  };

  const getStepDependencies = (stepId: string) => {
    const step = getStepById(stepId);
    if (!step) return [];

    return step.prerequisites?.map(prereqId => getStepById(prereqId)).filter(Boolean) || [];
  };

  return {
    steps: regionalContent?.steps || [],
    getStepsByPhase,
    getStepById,
    getStepDependencies,
    currentRegion,
  };
}

// Hook for government programs and resources
export function useRegionalPrograms() {
  const { regionalContent, currentRegion } = useRegional();

  const getProgramsByCategory = (category: string) => {
    if (!regionalContent) return [];
    return regionalContent.governmentPrograms.filter(program => program.category === category);
  };

  const getFirstTimeBuyerPrograms = () => {
    return getProgramsByCategory('first-time-buyer');
  };

  return {
    programs: regionalContent?.governmentPrograms || [],
    resources: regionalContent?.resources || [],
    getProgramsByCategory,
    getFirstTimeBuyerPrograms,
    currentRegion,
  };
}