// Regional content types for BuyRight

export type RegionCode = 'ON' | 'BC' | 'US_CA' | 'US_NY' | 'US_TX' | 'US_FL';

export interface RegionalInfo {
  code: RegionCode;
  name: string;
  country: 'CA' | 'US';
  currency: 'CAD' | 'USD';
  taxSystem: {
    landTransferTax?: number; // percentage
    propertyTransferTax?: number; // percentage
    gst?: number; // percentage
    hst?: number; // percentage
    pst?: number; // percentage
    salesTax?: number; // percentage
  };
  regulations: {
    coolingOffPeriod?: number; // days
    inspectionPeriod?: number; // days
    financingPeriod?: number; // days
  };
}

export interface LegalRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  category: 'documentation' | 'inspection' | 'disclosure' | 'insurance' | 'tax';
  timeframe?: string;
  estimatedCost?: {
    min: number;
    max: number;
    currency: 'CAD' | 'USD';
  };
}

export interface RegionalCost {
  id: string;
  title: string;
  description: string;
  category: 'closing' | 'legal' | 'inspection' | 'financing' | 'insurance' | 'tax';
  amount?: {
    min: number;
    max: number;
    percentage?: number; // if cost is percentage of home price
    currency: 'CAD' | 'USD';
  };
  frequency?: 'one-time' | 'annual' | 'monthly';
  when: 'before-offer' | 'during-inspection' | 'at-closing' | 'post-closing';
}

export interface SeasonalConsideration {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'market' | 'inspection' | 'moving' | 'pricing';
}

export interface RegionalStep {
  id: string;
  title: string;
  description: string;
  category: 'planning' | 'searching' | 'financing' | 'inspection' | 'closing' | 'maintenance';
  estimatedDuration: string;
  prerequisites?: string[]; // other step ids
  resources: RegionalResource[];
  legalRequirements: string[]; // legal requirement ids
  costs: string[]; // regional cost ids
  tips: string[];
  warnings?: string[];
}

export interface RegionalResource {
  type: 'website' | 'document' | 'calculator' | 'contact';
  title: string;
  url?: string;
  description: string;
}

export interface RegionalContent {
  region: RegionalInfo;
  legalRequirements: LegalRequirement[];
  costs: RegionalCost[];
  seasonalConsiderations: SeasonalConsideration[];
  steps: RegionalStep[];
  resources: RegionalResource[];
  governmentPrograms: GovernmentProgram[];
}

export interface GovernmentProgram {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string;
  deadline?: string;
  website?: string;
  category: 'first-time-buyer' | 'tax-credit' | 'grant' | 'rebate' | 'insurance';
}

// Template interface for merging regional content
export interface RegionalTemplate {
  base: Partial<RegionalContent>;
  overrides: {
    [key in RegionCode]?: Partial<RegionalContent>;
  };
}

// User location preferences
export interface UserLocation {
  regionCode: RegionCode;
  specificLocation?: string; // city/province/state
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Regional context state
export interface RegionalContextState {
  currentRegion: RegionCode | null;
  regionalContent: RegionalContent | null;
  loading: boolean;
  error: string | null;
  availableRegions: RegionalInfo[];
}

// Regional content loading result
export interface RegionalContentResult {
  success: boolean;
  content?: RegionalContent;
  error?: string;
}

// Journey Progress Types
export interface JourneyPhase {
  id: string;
  title: string;
  description: string;
  order: number;
  steps: JourneyStep[];
  estimatedDuration: string;
  icon?: string;
}

export interface JourneyStep {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  order: number;
  category: 'planning' | 'searching' | 'financing' | 'inspection' | 'closing' | 'maintenance';
  estimatedDuration: string;
  prerequisites?: string[]; // other step ids
  resources: JourneyResource[];
  checklist: ChecklistItem[];
  tips: string[];
  warnings?: string[];
  isOptional?: boolean;
  regionalRequirements?: string[]; // links to regional legal requirements
  estimatedCosts?: string[]; // links to regional costs
}

export interface JourneyResource {
  type: 'website' | 'document' | 'calculator' | 'contact' | 'template';
  title: string;
  url?: string;
  description: string;
  category: 'government' | 'financial' | 'legal' | 'educational' | 'tool';
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  category: 'document' | 'action' | 'decision' | 'research';
  estimatedTime?: string;
  dependencies?: string[]; // other checklist item ids
}

// Journey Progress Tracking
export interface UserJourneyProgress {
  userId: string;
  currentPhaseId: string;
  currentStepId: string;
  completedSteps: string[];
  completedChecklist: string[];
  stepProgress: { [stepId: string]: StepProgress };
  startedAt: Date;
  lastUpdated: Date;
  regionCode: RegionCode;
}

export interface StepProgress {
  stepId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  completedChecklist: string[];
  notes?: string;
  timeSpent?: number; // minutes
}

// Journey Template for Regional Customization
export interface JourneyTemplate {
  basePhases: JourneyPhase[];
  regionalOverrides: {
    [key in RegionCode]?: {
      phases?: Partial<JourneyPhase>[];
      steps?: Partial<JourneyStep>[];
      additionalSteps?: JourneyStep[];
      hiddenSteps?: string[]; // step ids to hide for this region
    };
  };
}

// Journey Context State
export interface JourneyContextState {
  template: JourneyTemplate | null;
  userProgress: UserJourneyProgress | null;
  currentPhases: JourneyPhase[];
  loading: boolean;
  error: string | null;
}

// Journey Engine Actions
export type JourneyAction = 
  | { type: 'LOAD_JOURNEY'; payload: { template: JourneyTemplate; regionCode: RegionCode } }
  | { type: 'START_STEP'; payload: { stepId: string } }
  | { type: 'COMPLETE_STEP'; payload: { stepId: string; notes?: string } }
  | { type: 'COMPLETE_CHECKLIST_ITEM'; payload: { stepId: string; checklistItemId: string } }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserJourneyProgress> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };