// Optimized Regional Content Management System
// Implements advanced caching, lazy loading, and content merging

import { 
  RegionCode, 
  RegionalContent, 
  RegionalInfo, 
  RegionalContentResult,
  RegionalTemplate
} from '@/types/regional';

// Performance monitoring
interface PerformanceMetrics {
  loadTime: number;
  cacheHits: number;
  cacheMisses: number;
  validationErrors: number;
}

// Enhanced cache entry with metadata
interface CachedRegionalContent {
  content: RegionalContent;
  loadedAt: number;
  accessCount: number;
  lastAccessed: number;
  version: string;
}

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxEntries: 10,
  preloadRegions: ['ON', 'BC', 'US_CA'] as RegionCode[]
};

// Enhanced regional data cache with LRU and expiration
class RegionalContentCache {
  private cache = new Map<RegionCode, CachedRegionalContent>();
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    validationErrors: 0
  };

  set(regionCode: RegionCode, content: RegionalContent, version: string = '1.0.0'): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= CACHE_CONFIG.maxEntries) {
      this.evictLeastRecentlyUsed();
    }

    const cached: CachedRegionalContent = {
      content,
      loadedAt: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      version
    };

    this.cache.set(regionCode, cached);
  }

  get(regionCode: RegionCode): RegionalContent | null {
    const cached = this.cache.get(regionCode);
    
    if (!cached) {
      this.metrics.cacheMisses++;
      return null;
    }

    // Check if expired
    if (this.isExpired(cached)) {
      this.cache.delete(regionCode);
      this.metrics.cacheMisses++;
      return null;
    }

    // Update access metadata
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    this.metrics.cacheHits++;

    return cached.content;
  }

  has(regionCode: RegionCode): boolean {
    const cached = this.cache.get(regionCode);
    return cached !== undefined && !this.isExpired(cached);
  }

  private isExpired(cached: CachedRegionalContent): boolean {
    return Date.now() - cached.loadedAt > CACHE_CONFIG.maxAge;
  }

  private evictLeastRecentlyUsed(): void {
    let oldestEntry: [RegionCode, CachedRegionalContent] | null = null;
    let oldestTime = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (value.lastAccessed < oldestTime) {
        oldestTime = value.lastAccessed;
        oldestEntry = [key, value];
      }
    }

    if (oldestEntry) {
      this.cache.delete(oldestEntry[0]);
    }
  }

  clear(): void {
    this.cache.clear();
    this.resetMetrics();
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private resetMetrics(): void {
    this.metrics = {
      loadTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      validationErrors: 0
    };
  }

  // Get cache statistics for monitoring
  getStats() {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.metrics.cacheHits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests,
      metrics: this.metrics
    };
  }
}

// Global cache instance
const regionalCache = new RegionalContentCache();

// Base template for missing regions
const baseRegionalTemplate: Partial<RegionalContent> = {
  legalRequirements: [
    {
      id: 'home-inspection',
      title: 'Professional Home Inspection',
      description: 'Get a professional inspection of the property',
      mandatory: true,
      category: 'inspection',
      timeframe: 'During offer contingency period',
      estimatedCost: {
        min: 300,
        max: 800,
        currency: 'USD'
      }
    }
  ],
  costs: [
    {
      id: 'closing-costs',
      title: 'Closing Costs',
      description: 'Various fees associated with closing the home purchase',
      category: 'closing',
      amount: {
        min: 2000,
        max: 5000,
        currency: 'USD'
      },
      frequency: 'one-time',
      when: 'at-closing'
    }
  ],
  seasonalConsiderations: [
    {
      season: 'spring',
      title: 'Peak Buying Season',
      description: 'Most homes come on the market, but competition is highest',
      impact: 'neutral',
      category: 'market'
    }
  ],
  steps: [],
  resources: [],
  governmentPrograms: []
};

// Lazy loading functions for regional data
const loadRegionalDataLazy = async (regionCode: RegionCode): Promise<any> => {
  const startTime = performance.now();
  
  try {
    let module: any;
    
    switch (regionCode) {
      case 'ON':
        module = await import('@/data/regional/ontario.json');
        break;
      case 'BC':
        module = await import('@/data/regional/bc.json');
        break;
      case 'US_CA':
        module = await import('@/data/regional/us-ca.json');
        break;
      case 'US_NY':
      case 'US_TX':
      case 'US_FL':
        // Use base template with US-specific overrides
        return createBaseUSTemplate(regionCode);
      default:
        throw new Error(`Unsupported region: ${regionCode}`);
    }

    const loadTime = performance.now() - startTime;
    regionalCache.metrics.loadTime += loadTime;

    return module.default || module;
  } catch (error) {
    throw new Error(`Failed to load regional data for ${regionCode}: ${error}`);
  }
};

// Create base template for US states not yet implemented
const createBaseUSTemplate = (regionCode: RegionCode) => {
  const stateNames: Record<string, string> = {
    'US_NY': 'New York',
    'US_TX': 'Texas', 
    'US_FL': 'Florida'
  };

  return {
    region: {
      code: regionCode,
      name: stateNames[regionCode] || regionCode,
      country: 'US',
      currency: 'USD',
      taxSystem: {
        salesTax: 8.0 // Approximate average
      },
      regulations: {
        coolingOffPeriod: 0,
        inspectionPeriod: 7,
        financingPeriod: 30
      }
    },
    ...baseRegionalTemplate
  };
};

// Content validation schema
const validateRegionalContent = (content: any): string[] => {
  const errors: string[] = [];

  if (!content.region) {
    errors.push('Missing region information');
  } else {
    if (!content.region.code) errors.push('Missing region code');
    if (!content.region.name) errors.push('Missing region name');
    if (!content.region.currency) errors.push('Missing currency');
  }

  if (!Array.isArray(content.legalRequirements)) {
    errors.push('legalRequirements must be an array');
  }

  if (!Array.isArray(content.costs)) {
    errors.push('costs must be an array');
  }

  // Validate required fields in arrays
  content.legalRequirements?.forEach((req: any, index: number) => {
    if (!req.id) errors.push(`Legal requirement ${index} missing id`);
    if (!req.title) errors.push(`Legal requirement ${index} missing title`);
  });

  if (errors.length > 0) {
    regionalCache.metrics.validationErrors++;
  }

  return errors;
};

// Advanced content merging system
export class RegionalContentMerger {
  static mergeTemplate(
    base: Partial<RegionalContent>, 
    override: Partial<RegionalContent>
  ): RegionalContent {
    return {
      region: override.region || base.region!,
      legalRequirements: this.mergeLegalRequirements(
        base.legalRequirements || [], 
        override.legalRequirements || []
      ),
      costs: this.mergeCosts(
        base.costs || [], 
        override.costs || []
      ),
      seasonalConsiderations: override.seasonalConsiderations || base.seasonalConsiderations || [],
      steps: override.steps || base.steps || [],
      resources: this.mergeResources(
        base.resources || [], 
        override.resources || []
      ),
      governmentPrograms: override.governmentPrograms || base.governmentPrograms || []
    };
  }

  private static mergeLegalRequirements(base: any[], override: any[]): any[] {
    const merged = [...base];
    
    override.forEach(overrideReq => {
      const existingIndex = merged.findIndex(req => req.id === overrideReq.id);
      if (existingIndex >= 0) {
        // Merge existing requirement
        merged[existingIndex] = { ...merged[existingIndex], ...overrideReq };
      } else {
        // Add new requirement
        merged.push(overrideReq);
      }
    });

    return merged;
  }

  private static mergeCosts(base: any[], override: any[]): any[] {
    const merged = [...base];
    
    override.forEach(overrideCost => {
      const existingIndex = merged.findIndex(cost => cost.id === overrideCost.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...overrideCost };
      } else {
        merged.push(overrideCost);
      }
    });

    return merged;
  }

  private static mergeResources(base: any[], override: any[]): any[] {
    // Simply concatenate resources, allowing duplicates for now
    return [...base, ...override];
  }
}

// Main optimized loading function
export async function loadRegionalContentOptimized(
  regionCode: RegionCode
): Promise<RegionalContentResult> {
  try {
    // Check optimized cache first
    const cached = regionalCache.get(regionCode);
    if (cached) {
      return {
        success: true,
        content: cached
      };
    }

    // Lazy load regional data
    const regionalData = await loadRegionalDataLazy(regionCode);

    // Validate content structure
    const validationErrors = validateRegionalContent(regionalData);
    if (validationErrors.length > 0) {
      console.warn(`Regional content validation warnings for ${regionCode}:`, validationErrors);
      // Continue with warnings, don't fail completely
    }

    // Type cast to RegionalContent
    const content = regionalData as RegionalContent;
    
    // Cache the loaded content
    regionalCache.set(regionCode, content);

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('Error loading optimized regional content:', error);
    
    // Fallback to base template for unsupported regions
    if (regionCode.startsWith('US_')) {
      try {
        const fallbackData = createBaseUSTemplate(regionCode);
        const content = fallbackData as RegionalContent;
        regionalCache.set(regionCode, content);
        
        return {
          success: true,
          content
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: `Failed to load regional content and fallback for ${regionCode}`
        };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load regional content'
    };
  }
}

// Preload commonly used regions
export async function preloadCommonRegions(): Promise<void> {
  const preloadPromises = CACHE_CONFIG.preloadRegions.map(regionCode =>
    loadRegionalContentOptimized(regionCode).catch(error =>
      console.warn(`Failed to preload region ${regionCode}:`, error)
    )
  );

  await Promise.allSettled(preloadPromises);
  console.log('Regional content preloading complete');
}

// Cache management utilities
export const cacheUtils = {
  getStats: () => regionalCache.getStats(),
  clear: () => regionalCache.clear(),
  preload: preloadCommonRegions,
  
  // Prefetch specific region
  prefetch: (regionCode: RegionCode) => loadRegionalContentOptimized(regionCode),
  
  // Warm up cache with multiple regions
  warmUp: async (regionCodes: RegionCode[]) => {
    const promises = regionCodes.map(code => loadRegionalContentOptimized(code));
    await Promise.allSettled(promises);
  }
};

// Export the optimized version as default
export { loadRegionalContentOptimized as loadRegionalContent };

// Performance monitoring hook
export const useRegionalPerformance = () => {
  return {
    getMetrics: () => regionalCache.getMetrics(),
    getStats: () => regionalCache.getStats(),
    clearCache: () => regionalCache.clear()
  };
};