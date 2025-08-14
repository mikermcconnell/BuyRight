import { 
  RegionCode, 
  RegionalContent, 
  RegionalInfo, 
  RegionalContentResult,
  UserLocation,
  RegionalTemplate
} from '@/types/regional';

// Import regional data
import ontarioData from '@/data/regional/ontario.json';
import bcData from '@/data/regional/bc.json';
import usCaData from '@/data/regional/us-ca.json';

// Regional data cache to avoid repeated loading
const regionalDataCache = new Map<RegionCode, RegionalContent>();

// Available regions configuration
export const AVAILABLE_REGIONS: RegionalInfo[] = [
  {
    code: 'ON',
    name: 'Ontario',
    country: 'CA',
    currency: 'CAD',
    taxSystem: {
      landTransferTax: 2.0,
      hst: 13.0
    },
    regulations: {
      coolingOffPeriod: 0,
      inspectionPeriod: 5,
      financingPeriod: 30
    }
  },
  {
    code: 'BC',
    name: 'British Columbia',
    country: 'CA',
    currency: 'CAD',
    taxSystem: {
      propertyTransferTax: 1.0,
      gst: 5.0,
      pst: 7.0
    },
    regulations: {
      coolingOffPeriod: 3,
      inspectionPeriod: 7,
      financingPeriod: 21
    }
  },
  {
    code: 'US_CA',
    name: 'California, USA',
    country: 'US',
    currency: 'USD',
    taxSystem: {
      salesTax: 7.25
    },
    regulations: {
      coolingOffPeriod: 0,
      inspectionPeriod: 7,
      financingPeriod: 21
    }
  },
  {
    code: 'US_NY',
    name: 'New York, USA',
    country: 'US',
    currency: 'USD',
    taxSystem: {
      salesTax: 8.0
    },
    regulations: {
      coolingOffPeriod: 0,
      inspectionPeriod: 10,
      financingPeriod: 30
    }
  },
  {
    code: 'US_TX',
    name: 'Texas, USA', 
    country: 'US',
    currency: 'USD',
    taxSystem: {
      salesTax: 6.25
    },
    regulations: {
      coolingOffPeriod: 0,
      inspectionPeriod: 7,
      financingPeriod: 20
    }
  },
  {
    code: 'US_FL',
    name: 'Florida, USA',
    country: 'US',
    currency: 'USD',
    taxSystem: {
      salesTax: 6.0
    },
    regulations: {
      coolingOffPeriod: 3,
      inspectionPeriod: 15,
      financingPeriod: 30
    }
  }
];

/**
 * Load regional content for a specific region
 */
export async function loadRegionalContent(regionCode: RegionCode): Promise<RegionalContentResult> {
  try {
    // Check cache first
    if (regionalDataCache.has(regionCode)) {
      return {
        success: true,
        content: regionalDataCache.get(regionCode)!
      };
    }

    // Load regional data based on region code
    let regionalData: any;
    switch (regionCode) {
      case 'ON':
        regionalData = ontarioData;
        break;
      case 'BC':
        regionalData = bcData;
        break;
      case 'US_CA':
        regionalData = usCaData;
        break;
      // Add more regions as needed
      case 'US_NY':
      case 'US_TX':
      case 'US_FL':
        // For now, these will use a base template
        return {
          success: false,
          error: `Regional content for ${regionCode} is not yet implemented`
        };
      default:
        return {
          success: false,
          error: `Unsupported region: ${regionCode}`
        };
    }

    // Validate the data structure
    if (!regionalData || !regionalData.region) {
      return {
        success: false,
        error: 'Invalid regional data format'
      };
    }

    // Type cast to RegionalContent
    const content = regionalData as RegionalContent;
    
    // Cache the loaded content
    regionalDataCache.set(regionCode, content);

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('Error loading regional content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load regional content'
    };
  }
}

/**
 * Get regional information without full content
 */
export function getRegionalInfo(regionCode: RegionCode): RegionalInfo | null {
  return AVAILABLE_REGIONS.find(region => region.code === regionCode) || null;
}

/**
 * Get all available regions
 */
export function getAvailableRegions(): RegionalInfo[] {
  return AVAILABLE_REGIONS;
}

/**
 * Detect user's region based on various inputs
 */
export function detectUserRegion(userLocation?: UserLocation): RegionCode {
  // If user has explicitly set a region, use that
  if (userLocation?.regionCode) {
    return userLocation.regionCode;
  }

  // Try to detect from browser/IP (in a real app, you might use a geolocation service)
  if (typeof window !== 'undefined') {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Basic timezone-based detection
    if (timezone.includes('Toronto') || timezone.includes('Eastern')) {
      return 'ON';
    } else if (timezone.includes('Vancouver') || timezone.includes('Pacific')) {
      return 'BC';
    } else if (timezone.includes('Los_Angeles') || timezone.includes('America/Los_Angeles')) {
      return 'US_CA';
    }
  }

  // Default fallback
  return 'ON';
}

/**
 * Parse location string to region code
 */
export function parseLocationToRegion(location: string): RegionCode | null {
  const locationLower = location.toLowerCase();
  
  // Canadian provinces
  if (locationLower.includes('ontario') || locationLower.includes('on')) {
    return 'ON';
  }
  if (locationLower.includes('british columbia') || locationLower.includes('bc')) {
    return 'BC';
  }
  
  // US states
  if (locationLower.includes('california') || locationLower.includes('ca')) {
    return 'US_CA';
  }
  if (locationLower.includes('new york') || locationLower.includes('ny')) {
    return 'US_NY';
  }
  if (locationLower.includes('texas') || locationLower.includes('tx')) {
    return 'US_TX';
  }
  if (locationLower.includes('florida') || locationLower.includes('fl')) {
    return 'US_FL';
  }
  
  return null;
}

/**
 * Validate region code
 */
export function isValidRegionCode(code: string): code is RegionCode {
  return AVAILABLE_REGIONS.some(region => region.code === code);
}

/**
 * Get currency for region
 */
export function getRegionCurrency(regionCode: RegionCode): 'CAD' | 'USD' {
  const region = getRegionalInfo(regionCode);
  return region?.currency || 'CAD';
}

/**
 * Format currency amount for region
 */
export function formatRegionalCurrency(
  amount: number, 
  regionCode: RegionCode, 
  options: Intl.NumberFormatOptions = {}
): string {
  const currency = getRegionCurrency(regionCode);
  const region = getRegionalInfo(regionCode);
  
  // Determine locale based on region
  let locale = 'en-CA'; // default
  if (region?.country === 'US') {
    locale = 'en-US';
  } else if (region?.code === 'BC') {
    locale = 'en-CA';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options
  }).format(amount);
}

/**
 * Get tax rate for a specific tax type in a region
 */
export function getRegionalTaxRate(
  regionCode: RegionCode, 
  taxType: 'landTransferTax' | 'propertyTransferTax' | 'gst' | 'hst' | 'pst' | 'salesTax'
): number {
  const region = getRegionalInfo(regionCode);
  return region?.taxSystem[taxType] || 0;
}

/**
 * Calculate estimated closing costs for region
 */
export function calculateRegionalClosingCosts(
  regionCode: RegionCode, 
  homePrice: number
): {
  taxes: number;
  legalFees: number;
  insurance: number;
  total: number;
  breakdown: Array<{
    name: string;
    amount: number;
    percentage?: number;
  }>;
} {
  const region = getRegionalInfo(regionCode);
  if (!region) {
    throw new Error(`Unknown region: ${regionCode}`);
  }

  const breakdown: Array<{
    name: string;
    amount: number;
    percentage?: number;
  }> = [];

  let taxes = 0;
  let legalFees = 0;
  let insurance = 0;

  // Calculate taxes
  if (region.taxSystem.landTransferTax) {
    const tax = homePrice * (region.taxSystem.landTransferTax / 100);
    taxes += tax;
    breakdown.push({
      name: 'Land Transfer Tax',
      amount: tax,
      percentage: region.taxSystem.landTransferTax
    });
  }

  if (region.taxSystem.propertyTransferTax) {
    const tax = homePrice * (region.taxSystem.propertyTransferTax / 100);
    taxes += tax;
    breakdown.push({
      name: 'Property Transfer Tax',
      amount: tax,
      percentage: region.taxSystem.propertyTransferTax
    });
  }

  // Estimate legal fees
  switch (regionCode) {
    case 'ON':
      legalFees = 1800; // Average
      break;
    case 'BC':
      legalFees = 1400; // Average
      break;
    case 'US_CA':
      legalFees = 2500; // Average
      break;
    default:
      legalFees = 2000; // Default estimate
  }

  breakdown.push({
    name: 'Legal Fees',
    amount: legalFees
  });

  // Estimate insurance (rough estimate based on home price)
  insurance = Math.max(1500, homePrice * 0.003);
  breakdown.push({
    name: 'Home Insurance',
    amount: insurance
  });

  const total = taxes + legalFees + insurance;

  return {
    taxes,
    legalFees,
    insurance,
    total,
    breakdown
  };
}

/**
 * Merge regional templates for advanced customization
 */
export function mergeRegionalTemplate(template: RegionalTemplate, regionCode: RegionCode): RegionalContent | null {
  const baseContent = template.base;
  const override = template.overrides[regionCode];
  
  if (!baseContent || !override) {
    return null;
  }

  // Deep merge logic would go here
  // For now, return a simple merge
  return {
    ...baseContent,
    ...override
  } as RegionalContent;
}

/**
 * Clear regional data cache
 */
export function clearRegionalCache(): void {
  regionalDataCache.clear();
}

/**
 * Pre-load regional content for better performance
 */
export async function preloadRegionalContent(regionCodes: RegionCode[]): Promise<void> {
  const loadPromises = regionCodes.map(code => loadRegionalContent(code));
  await Promise.all(loadPromises);
}