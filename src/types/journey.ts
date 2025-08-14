// Journey management types for BuyRight

export type JourneyPhase = 'planning' | 'searching' | 'financing' | 'inspection' | 'closing' | 'maintenance';

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  phase: JourneyPhase;
  order: number;
  estimatedDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Dependencies
  prerequisites: string[]; // step ids that must be completed first
  optional: boolean;
  
  // Content
  content: {
    overview: string;
    instructions: JourneyInstruction[];
    resources: JourneyResource[];
    tips: string[];
    warnings?: string[];
  };
  
  // Regional customization
  regionalOverrides?: {
    [regionCode: string]: Partial<JourneyStep>;
  };
  
  // Progress tracking
  trackingData?: {
    completionCriteria: CompletionCriterion[];
    dataPoints: DataPoint[];
  };
}

export interface JourneyInstruction {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'information' | 'decision' | 'calculation';
  order: number;
  required: boolean;
  estimatedTime?: string;
  
  // For interactive elements
  component?: string; // component name to render
  data?: Record<string, any>;
}

export interface JourneyResource {
  id: string;
  title: string;
  type: 'website' | 'document' | 'calculator' | 'contact' | 'checklist' | 'form';
  url?: string;
  description: string;
  category: 'government' | 'legal' | 'financial' | 'educational' | 'tool';
  regional?: boolean; // if resource is region-specific
}

export interface CompletionCriterion {
  id: string;
  description: string;
  type: 'boolean' | 'numeric' | 'selection' | 'file_upload' | 'external_verification';
  required: boolean;
  
  // For different criterion types
  options?: string[]; // for selection type
  minValue?: number; // for numeric type
  maxValue?: number; // for numeric type
  fileTypes?: string[]; // for file_upload type
}

export interface DataPoint {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'selection' | 'file';
  required: boolean;
  description?: string;
  
  // Validation
  validation?: {
    pattern?: string; // regex pattern
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  
  // For selection types
  options?: { value: string; label: string }[];
  
  // Regional customization
  regionalVariations?: {
    [regionCode: string]: Partial<DataPoint>;
  };
}

// Journey progress tracking
export interface JourneyProgress {
  userId: string;
  stepId: string;
  phase: JourneyPhase;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped' | 'blocked';
  completedAt?: string;
  lastUpdated: string;
  
  // Completion data
  completionData?: {
    [criterionId: string]: any;
  };
  
  // User data collected during step
  userData?: {
    [dataPointId: string]: any;
  };
  
  // Notes and feedback
  notes?: string;
  rating?: number; // 1-5 satisfaction rating
  timeSpent?: number; // minutes
}

// Journey template definition
export interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  
  // User targeting
  targetAudience: {
    firstTimeBuyer?: boolean;
    regions?: string[];
    budgetRange?: {
      min?: number;
      max?: number;
    };
  };
  
  // Journey structure
  phases: JourneyPhaseDefinition[];
  steps: JourneyStep[];
  
  // Customization
  customizations: {
    timeline?: 'fast' | 'normal' | 'thorough';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface JourneyPhaseDefinition {
  id: JourneyPhase;
  title: string;
  description: string;
  order: number;
  estimatedDuration: string;
  icon?: string;
  color?: string;
}

// Journey engine state
export interface JourneyState {
  currentStep?: string;
  currentPhase?: JourneyPhase;
  completedSteps: string[];
  availableSteps: string[];
  blockedSteps: string[];
  progress: JourneyProgress[];
  
  // User preferences
  timeline: 'fast' | 'normal' | 'thorough';
  region: string;
  
  // Calculated metrics
  overallProgress: number; // 0-100 percentage
  phaseProgress: {
    [phase in JourneyPhase]: number;
  };
  estimatedCompletion?: string; // ISO date
}

// Journey customization options
export interface JourneyCustomization {
  timeline: 'fast' | 'normal' | 'thorough';
  skipOptionalSteps: boolean;
  focusAreas: JourneyPhase[];
  regionCode: string;
  
  // User profile influences
  firstTimeBuyer: boolean;
  budget?: number;
  homeType?: 'single_family' | 'condo' | 'townhouse';
}

// Journey analytics and insights
export interface JourneyInsight {
  type: 'suggestion' | 'warning' | 'milestone' | 'tip';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  stepId?: string;
  phaseId?: JourneyPhase;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
    component?: string;
  };
}