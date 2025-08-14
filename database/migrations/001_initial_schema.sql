-- BuyRight Database Schema Migration 001
-- Initial database structure for home buying guide application
-- This migration assumes Supabase auth is already set up with auth.users table

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles for journey customization (references auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location VARCHAR(10) NOT NULL, -- 'ON', 'BC', 'US_CA', etc.
    budget_max DECIMAL(12,2),
    timeline_preference VARCHAR(20) DEFAULT 'normal', -- 'fast', 'normal', 'thorough'
    home_type_preference VARCHAR(20), -- 'single_family', 'condo', 'townhouse'
    first_time_buyer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey progress tracking
CREATE TABLE journey_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phase VARCHAR(50) NOT NULL, -- 'planning', 'searching', 'financing', 'inspection', 'closing', 'maintenance'
    step_id VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    data JSONB, -- Store additional step-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home details for post-purchase features
CREATE TABLE home_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    purchase_date DATE,
    home_type VARCHAR(20), -- 'single_family', 'condo', 'townhouse'
    year_built INTEGER,
    square_footage INTEGER,
    climate_zone VARCHAR(10),
    address TEXT,
    purchase_price DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home components for maintenance tracking
CREATE TABLE home_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES home_details(id) ON DELETE CASCADE,
    component_type VARCHAR(50) NOT NULL, -- 'roof', 'hvac', 'water_heater', 'flooring', etc.
    component_name VARCHAR(100),
    installation_date DATE,
    last_maintenance DATE,
    estimated_lifespan INTEGER, -- years
    maintenance_frequency INTEGER, -- months
    warranty_expiry DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculator sessions for usage tracking (optional)
CREATE TABLE calculator_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    calculator_type VARCHAR(30) NOT NULL, -- 'mortgage', 'closing_costs', 'affordability'
    input_data JSONB NOT NULL, -- Store calculation inputs
    results JSONB NOT NULL, -- Store calculation results
    saved BOOLEAN DEFAULT FALSE, -- User saved the calculation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_journey_progress_user_id ON journey_progress(user_id);
CREATE INDEX idx_journey_progress_phase ON journey_progress(phase);
CREATE INDEX idx_journey_progress_step_id ON journey_progress(step_id);
CREATE INDEX idx_home_components_home_id ON home_components(home_id);
CREATE INDEX idx_home_components_type ON home_components(component_type);
CREATE INDEX idx_calculator_sessions_user_id ON calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_type ON calculator_sessions(calculator_type);

-- Unique constraints
ALTER TABLE user_profiles ADD CONSTRAINT unique_user_profile UNIQUE (user_id);
ALTER TABLE home_details ADD CONSTRAINT unique_user_home UNIQUE (user_id);

-- Updated timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON journey_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_details_updated_at BEFORE UPDATE ON home_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_components_updated_at BEFORE UPDATE ON home_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Regional data will be loaded from JSON files via the application