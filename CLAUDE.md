# Claude Code Project Context - BuyRight App

## Project Overview
**BuyRight** is a mobile-first interactive home buying and maintenance platform that guides first-time buyers through the complex process with region-specific step-by-step instructions, progress tracking, and financial calculators.

**Current Status**: 🚀 ACTIVE DEVELOPMENT - Phase 3 Partial  
**Current Task**: Ongoing UI/UX Improvements & Calculator Enhancement

## Tech Stack & Architecture
- **Frontend**: React 18 + Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS with Duolingo-inspired design system (green theme #58CC02)
- **State Management**: React Context + useReducer (UserContext, JourneyContext, RegionalContext, ComplexityContext)
- **Database**: PostgreSQL (planned - currently using localStorage for demo)
- **Hosting**: Vercel (planned)  
- **PWA**: Service Worker + Web App Manifest
- **Financial Tools**: Mortgage, affordability, and closing cost calculators with regional tax integration

## Key Design Principles
- **Mobile-First**: Touch-friendly interface, 44px minimum touch targets
- **Duolingo-Inspired**: Green (#58CC02) primary color, progress-centric, friendly animations
- **Gamification Removed**: User requested clean, minimal design without gamification
- **Accessibility**: WCAG AA compliance, high contrast, screen reader support
- **Regional Content**: Location-specific content for Ontario, BC, major US states

## Current Development Status

### ✅ Completed (Phases 1-2 Partial)
- [x] Next.js setup with TypeScript and Tailwind
- [x] Duolingo-inspired design system implementation
- [x] Authentication simplified (localStorage demo, no backend auth)
- [x] Onboarding flow with location selection
- [x] Regional data structure and context
- [x] Dashboard with progress visualization
- [x] Base layout and navigation structure
- [x] Journey step template system with real journey engine
- [x] Regional content customization with advanced caching

### ✅ Recently Completed (Phase 2 Complete + Recent Updates)
- **Regional Data Structure & Loading** - Type definitions, regional context implemented  
- **Location Selection & Regional Context** - Context provider, location picker, state management
- **Journey Step Template System** - Real journey engine with localStorage persistence
- **Regional Content Customization** - Advanced caching, lazy loading, content merging, validation system
- **ComplexityProvider Context** - Fixed useComplexity context errors, integrated with layout
- **ProfileSetup Component** - Enhanced with proper Duolingo styling and form interactions
- **Affordability Calculator** - Complete UI overhaul with Duolingo design system, mobile-responsive layout
- **Down Payment Enhancement** - Changed from percentage to dollar amount input with validation
- **Property Cost Integration** - Always-included property taxes and insurance with detailed breakdown
- **Journey Content Cleanup** - Removed Tarion warranty registration steps from Ontario journey

### 📋 Next Priority Tasks (Phase 3 - Journey Progress System)
1. Journey Progress Context & State Management (Task 3.1)
2. Progress Tracking API Endpoints (Task 3.2)
3. Step Completion & Progress Persistence (Task 3.3)
4. Journey Phase Navigation (Task 3.4)

## Project Structure
```
BuyRight/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── onboarding/         # User onboarding flow
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   │   ├── onboarding/         # Onboarding-specific components
│   │   ├── dashboard/          # Dashboard components
│   │   └── ui/                 # Base UI components
│   ├── contexts/               # React Context providers
│   │   ├── RegionalContext.tsx # Location-based content
│   │   └── UserContext.tsx     # User profile management
│   ├── types/                  # TypeScript definitions
│   │   └── regional.ts         # Regional data types
│   └── lib/                    # Utility functions
├── docs/                       # Project documentation
│   ├── home_buying_prd.md      # Product Requirements
│   ├── home_buying_srs.md      # Software Requirements
│   ├── DUOLINGO_DESIGN_SYSTEM.md # Design guidelines
│   └── PROJECT_STATUS.md       # Current progress tracking
```

## Key Files to Know
- `/src/app/dashboard/page.tsx` - Main dashboard with journey progress
- `/src/contexts/RegionalContext.tsx` - Regional content management
- `/src/contexts/JourneyContext.tsx` - Journey progress and step management
- `/src/components/common/ComplexityToggle.tsx` - ComplexityProvider context
- `/src/types/regional.ts` - Type definitions for regional data
- `/src/components/onboarding/LocationSelection.tsx` - Location picker
- `/src/components/onboarding/ProfileSetup.tsx` - Enhanced profile setup with timeline/home preferences
- `/src/components/calculators/AffordabilityCalculator.tsx` - Full-featured affordability calculator
- `/src/lib/journeyEngine.ts` - Journey template system with regional overrides
- `/src/app/globals.css` - Enhanced Duolingo design system with mobile-first classes

## Regional Content Structure
Target regions: Ontario, BC, US states (CA, NY, TX, FL)
- Location-specific home buying processes
- Regional cost calculations
- Legal requirements by province/state
- Seasonal buying tips

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
```

## Color Scheme (Duolingo-Inspired)
- **Primary Green**: #58CC02 (buttons, progress, success states)
- **Hover Green**: #4FAF00
- **Background**: #FAFAFA (light gray)
- **Text**: #424242 (dark gray)
- **Accent Gold**: #FFC800 (achievements, current tasks)
- **Supporting**: Blues, purples for secondary actions

## User Flow
1. **Landing/Welcome** → Location selection
2. **Onboarding** → Profile setup → Timeline preferences
3. **Dashboard** → Journey progress overview → Step details
4. **Calculators** → Mortgage, closing costs, affordability tools
5. **Maintenance** → (Post-purchase) Home care scheduling

## Authentication Note
**IMPORTANT**: User specifically requested NO backend authentication. Currently using localStorage for demo purposes. Profile data persists locally only.

## Testing Strategy
- Unit tests for journey engine logic
- Integration tests for React Context providers
- Accessibility testing with screen readers
- Mobile-first responsive testing
- Performance testing on 3G networks

## Known Issues & Blockers
1. **Progress APIs**: Task 3.2 - Need REST APIs for progress and step completion  
2. **Database Integration**: Still using localStorage, needs PostgreSQL integration
3. **Calculator Integration**: Affordability calculator enhanced, other calculators need similar treatment
4. **Phase Navigation**: Need URL routing for individual journey phases and steps
5. **Mobile Navigation**: MobileNavigation component exists but needs ComplexityProvider integration

## Development Philosophy
- **Mobile-First**: Always design for mobile, enhance for desktop
- **Accessibility**: Every feature must be keyboard navigable and screen reader friendly
- **Performance**: Target <3s load time on 3G connections
- **Clean Code**: TypeScript strict mode, ESLint enforcement
- **User-Centric**: Prioritize user experience over technical complexity

## 📋 Status Updates Protocol
**IMPORTANT**: After completing each task, always update the project status in two places:
1. **PROJECT_STATUS.md** - Mark the specific task as completed and update progress
2. **CLAUDE.md** - Update the "Current Task" and "Current Development Status" sections

This ensures continuity across development sessions and accurate progress tracking.

## Immediate Next Steps for Task 3.1
1. Create global journey progress state management system
2. Implement progress persistence logic with localStorage/database sync
3. Add React Context for journey progress tracking
4. Create utilities for step completion and progress calculations
5. Integrate with existing journey engine for seamless progress updates

## Feature Interactions & Data Flow

### Context Architecture Overview
The BuyRight app uses a three-layer context architecture for state management:

1. **RegionalContext** - Location-based content management
2. **JourneyContext** - Progress tracking and journey engine 
3. **UserContext** - User profile management (planned - currently localStorage)

### Data Flow Patterns

#### Regional Context Flow
```
RegionalProvider → currentRegion → JourneyProvider → dashboard/components
    ↓                    ↓              ↓
localStorage      regionalContent   customized steps
    ↓                    ↓              ↓  
optimized cache   tax calculations  region-specific resources
```

#### Journey Context Flow
```
JourneyProvider → JourneyEngine → Dashboard/Steps
     ↓               ↓              ↓
ProgressPersistence → localStorage → API sync (offline-first)
     ↓               ↓              ↓
step completion   progress calc   context updates
```

### Key Integration Points

#### 1. Regional + Journey Integration
- `JourneyContext.useEffect` listens to `currentRegion` changes
- `JourneyEngine` receives `currentRegion` to customize journey phases
- Regional content provides `steps`, `costs`, and `legalRequirements`
- Journey engine merges base template with regional overrides

#### 2. Dashboard Integration Pattern
- Uses both `useJourney()` and `useJourneyProgress()` hooks
- Displays progress from JourneyContext state 
- Shows financial insights from CalculatorIntegrationService
- Updates progress through context actions (`completeStep`, `setCurrentStep`)

#### 3. Persistence Strategy (Offline-First)
- **Primary**: localStorage for immediate access
- **Secondary**: API sync when online (via ProgressPersistence service)
- **Fallback**: Offline queue for failed API calls
- **Recovery**: Auto-sync when connection restored

#### 4. Progress Calculation Flow
```
UserJourneyProgress → JourneyEngine.calculateProgress() → Dashboard display
completedSteps → availableSteps → currentStep → progressPercentage
```

### State Dependencies

#### Critical Dependencies
1. **RegionalContext must initialize first** - Journey depends on currentRegion
2. **Journey engine requires regional content** - For step customization
3. **Progress persistence requires userId** - Currently uses 'demo-user'
4. **Calculator integration is loosely coupled** - Separate service layer

#### Context Interaction Rules
- RegionalContext is provider-independent (no auth needed)
- JourneyContext depends on RegionalContext for initialization
- Both contexts use localStorage for demo mode
- Progress updates trigger both context state + persistence layer

### Data Synchronization
- **Regional content**: Optimized loading with caching (`loadRegionalContentOptimized`)
- **Journey progress**: Enhanced persistence with offline queue (`ProgressPersistence`)
- **Context updates**: Real-time via useReducer actions
- **API integration**: Background sync with graceful degradation

### Hook Usage Patterns
```typescript
// For dashboard overview
const { progressPercentage, completedStepsCount } = useJourneyProgress()

// For step management  
const { completeStep, isStepCompleted } = useJourney()

// For regional calculations
const { formatCurrency, calculateClosingCosts } = useRegionalUtils()

// For regional content access
const { steps, getStepsByPhase } = useRegionalSteps()
```

## Recent Improvements & Technical Updates

### 🎨 **UI/UX Enhancements (Latest Session)**
- **Affordability Calculator**: Complete redesign with Duolingo-inspired components
  - Mobile-first responsive layout with clean card-based design
  - Enhanced form inputs with proper validation and error states
  - Detailed results breakdown including mortgage payment, property tax, insurance
  - Changed down payment from percentage to dollar amount input
  - Always-included property costs with regional tax rate integration

### 🔧 **Technical Fixes**
- **ComplexityProvider Integration**: Fixed context errors in MobileNavigation
- **ProfileSetup Form**: Enhanced with proper Duolingo styling and interactive buttons
- **Journey Template Cleanup**: Removed repetitive Tarion warranty registration steps
- **Build Process**: Resolved TypeScript compilation errors and context dependencies

### 📱 **Design System Extensions**
- **Enhanced globals.css**: Added mobile-specific component classes
  - `.mobile-card`, `.mobile-title`, `.mobile-subtitle` for consistent layouts
  - `.form-input`, `.form-select`, `.form-checkbox` for styled form elements  
  - `.result-card-primary`, `.result-card-secondary` for calculator results
  - `.result-card-info` with color variants (blue, yellow, red) for information displays

### 💰 **Calculator Logic Improvements**
- **Property Tax Integration**: Dynamic regional tax rates from `getTaxRate('propertyTax')`
- **Insurance Calculation**: Fixed 0.3% annually for home insurance
- **Down Payment Flexibility**: Users specify exact dollar amounts vs percentages
- **Comprehensive Breakdown**: Shows mortgage payment vs. property costs separately
- **Regional Customization**: Tax calculations adjust based on selected region (ON, BC, US states)

### 🏗️ **Architecture Updates**  
- **Context Providers**: All four contexts properly layered in layout.tsx
  1. AuthProvider → RegionalProvider → JourneyProvider → ComplexityProvider
- **Journey Engine**: Regional overrides system functional with empty additionalSteps for Ontario
- **Offline-First**: Enhanced localStorage persistence for demo mode functionality

This context should help you understand the current state of the BuyRight project and continue development efficiently. Phase 2 (Regional Content Management) is complete, and Phase 3 progress continues with significant UI/UX improvements and calculator enhancements making the app more user-friendly and functional.