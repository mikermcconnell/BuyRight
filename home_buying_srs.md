# Home Buying Guide - Software Requirements Specification

## System Design

### Core Architecture
- **Client-Server Architecture** with RESTful API design
- **Progressive Web App (PWA)** for cross-platform mobile-first experience
- **Responsive Design** scaling from mobile to desktop
- **Modular Component System** for reusable UI elements
- **Regional Content Management** with static JSON configuration files

### Key Systems
- **Journey Progress Engine** - Linear step-by-step workflow management
- **Regional Customization Layer** - Location-specific content and calculations
- **Calculator Services** - Financial computation modules
- **User Profile Management** - Gradual profile building system
- **Maintenance Scheduler** - Post-purchase home care system

## Architecture Pattern

### Primary Pattern: **Component-Based Architecture**
- **Presentation Layer**: React components with hooks
- **Business Logic Layer**: Custom hooks and service functions  
- **Data Layer**: Context providers and local storage
- **Service Layer**: API communication and utility functions

### Supporting Patterns
- **Container/Presentational Components** for clear separation of concerns
- **Custom Hooks Pattern** for reusable business logic
- **Provider Pattern** for global state management
- **HOC Pattern** for regional content customization

## State Management

### Global State: **React Context + useReducer**
```javascript
// Primary contexts
- UserContext: Profile, preferences, location
- JourneyContext: Current progress, phase status, step completion
- RegionalContext: Location-specific content and requirements
- CalculatorContext: Financial tool states and results
```

### Local State: **useState Hook**
- Component-specific UI states
- Form inputs and validation
- Animation states
- Temporary calculation values

### Persistence Strategy
- **localStorage** for user progress and preferences
- **sessionStorage** for temporary calculation data
- **IndexedDB** for offline regional content caching

## Data Flow

### Unidirectional Data Flow
1. **User Interaction** → Component Event Handler
2. **Event Handler** → Context Dispatch Action
3. **Context Reducer** → State Update
4. **State Update** → Component Re-render
5. **Component** → UI Update

### Key Data Flows
- **Progress Tracking**: Step completion → Journey context → Progress persistence → UI update
- **Regional Customization**: Location selection → Regional content loading → Step modification → UI adaptation
- **Calculator Integration**: Input changes → Calculation service → Result context → Multiple component updates

## Technical Stack

### Frontend Framework
- **React 18** with TypeScript
- **Next.js 14** for SSG/SSR capabilities
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management

### Development Tools
- **Vite** for fast development builds
- **ESLint + Prettier** for code quality
- **Husky** for git hooks
- **Jest + React Testing Library** for testing

### PWA Features
- **Service Worker** for offline functionality
- **Web App Manifest** for installability
- **Push Notifications** for maintenance reminders

### Third-Party Libraries
```javascript
// UI Components
- @headlessui/react (accessible components)
- react-icons (icon library)
- react-datepicker (date selection)

// Utilities
- date-fns (date manipulation)
- numeral (number formatting)
- lodash (utility functions)

// Charts/Visualization
- recharts (progress charts)
- react-spring (smooth animations)
```

## Authentication Process

### Authentication Strategy: **JWT + Local Storage**

#### Registration Flow
1. **Email/Password Input** → Client validation
2. **API Registration Call** → Server creates user
3. **JWT Token Response** → Store in localStorage
4. **Automatic Login** → Redirect to journey dashboard

#### Login Flow
1. **Credentials Submit** → API authentication
2. **JWT Token Received** → localStorage storage
3. **User Context Update** → Global state population
4. **Journey Resume** → Redirect to last progress point

#### Token Management
```javascript
// Token structure
{
  "access_token": "jwt_string",
  "refresh_token": "refresh_string",
  "expires_in": 3600,
  "user_id": "uuid"
}
```

#### Protected Route Pattern
- **Route Guards** using React Context
- **Automatic Token Refresh** on API calls
- **Graceful Logout** on token expiration

## Route Design

### Primary Navigation Structure
```javascript
// App Router (Next.js 13+ App Router)
/app
├── page.tsx                    // Landing/marketing page
├── dashboard/
│   └── page.tsx               // Journey dashboard
├── journey/
│   ├── page.tsx               // Phase overview
│   ├── [phase]/
│   │   └── page.tsx           // Phase detail view
│   └── step/
│       └── [stepId]/page.tsx  // Individual step
├── calculators/
│   ├── mortgage/page.tsx      // Mortgage calculator
│   ├── closing-costs/page.tsx // Closing costs
│   └── affordability/page.tsx // Affordability tool
├── maintenance/
│   ├── page.tsx               // Maintenance dashboard
│   ├── calendar/page.tsx      // Maintenance calendar
│   └── components/page.tsx    // Component tracking
└── profile/
    ├── page.tsx               // User settings
    └── export/page.tsx        // Export options
```

### Route Protection Strategy
- **Public Routes**: Landing, login, register
- **Authenticated Routes**: All journey and tool pages
- **Conditional Routes**: Maintenance (post-purchase only)

## API Design

### RESTful Endpoints Structure

#### Authentication Endpoints
```javascript
POST /api/auth/register        // User registration
POST /api/auth/login          // User login  
POST /api/auth/refresh        // Token refresh
POST /api/auth/logout         // User logout
```

#### User Management
```javascript
GET    /api/user/profile      // Get user profile
PUT    /api/user/profile      // Update profile
DELETE /api/user/profile      // Delete account
```

#### Journey Progress
```javascript
GET /api/journey/progress     // Get user progress
PUT /api/journey/step/:id     // Update step status
GET /api/journey/export       // Export progress data
```

#### Regional Content
```javascript
GET /api/regions              // Available regions
GET /api/regions/:code/steps  // Regional journey steps
GET /api/regions/:code/costs  // Regional cost data
```

#### Calculators
```javascript
POST /api/calculate/mortgage     // Mortgage payments
POST /api/calculate/closing     // Closing costs estimate
POST /api/calculate/affordability // Affordability assessment
```

#### Maintenance System
```javascript
GET    /api/maintenance/schedule/:homeId  // Get maintenance schedule
POST   /api/maintenance/component        // Add home component
PUT    /api/maintenance/component/:id    // Update component
DELETE /api/maintenance/component/:id    // Remove component
```

### Response Format Standard
```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error Response  
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  }
}
```

## Database Design ERD

### Core Entities

#### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### User Profiles Table
```sql
user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location VARCHAR(10) NOT NULL, -- 'ON', 'BC', 'US_CA', etc.
  budget_max DECIMAL(12,2),
  timeline_preference VARCHAR(20), -- 'fast', 'normal', 'thorough'
  home_type_preference VARCHAR(20), -- 'single_family', 'condo', 'townhouse'  
  first_time_buyer BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Journey Progress Table
```sql
journey_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phase VARCHAR(50) NOT NULL, -- 'planning', 'searching', 'financing', etc.
  step_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### Home Details Table (Post-Purchase)
```sql
home_details (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  purchase_date DATE,
  home_type VARCHAR(20),
  year_built INTEGER,
  square_footage INTEGER,
  climate_zone VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Home Components Table (Maintenance)
```sql
home_components (
  id UUID PRIMARY KEY,
  home_id UUID REFERENCES home_details(id) ON DELETE CASCADE,
  component_type VARCHAR(50), -- 'roof', 'hvac', 'water_heater', etc.
  installation_date DATE,
  last_maintenance DATE,
  estimated_lifespan INTEGER, -- years
  maintenance_frequency INTEGER, -- months
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Calculator Sessions Table (Optional)
```sql
calculator_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  calculator_type VARCHAR(30), -- 'mortgage', 'closing_costs', 'affordability'
  input_data JSONB, -- Store calculation inputs
  results JSONB, -- Store calculation results  
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Relationships Summary
- **Users** 1:1 **User Profiles**
- **Users** 1:Many **Journey Progress** (multiple steps per user)
- **Users** 1:1 **Home Details** (post-purchase only)
- **Home Details** 1:Many **Home Components**
- **Users** 1:Many **Calculator Sessions** (optional tracking)

### Indexes for Performance
```sql
-- Query optimization indexes
CREATE INDEX idx_journey_progress_user_id ON journey_progress(user_id);
CREATE INDEX idx_journey_progress_phase ON journey_progress(phase);
CREATE INDEX idx_home_components_home_id ON home_components(home_id);
CREATE INDEX idx_home_components_type ON home_components(component_type);
```