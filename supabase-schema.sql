-- BuyRight Database Schema
-- This file contains the SQL commands to set up the database schema for the BuyRight application
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    location TEXT NOT NULL,
    budget_max NUMERIC(12,2),
    timeline_preference TEXT DEFAULT 'normal' CHECK (timeline_preference IN ('fast', 'normal', 'thorough')),
    home_type_preference TEXT CHECK (home_type_preference IN ('single_family', 'condo', 'townhouse')),
    first_time_buyer BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create journey_progress table
CREATE TABLE public.journey_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    phase TEXT NOT NULL,
    step_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, phase, step_id)
);

-- Create home_details table (for post-purchase)
CREATE TABLE public.home_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    purchase_date DATE,
    home_type TEXT CHECK (home_type IN ('single_family', 'condo', 'townhouse')),
    year_built INTEGER,
    square_footage INTEGER,
    climate_zone TEXT,
    address TEXT,
    purchase_price NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create home_components table (for maintenance tracking)
CREATE TABLE public.home_components (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_id UUID REFERENCES public.home_details(id) ON DELETE CASCADE NOT NULL,
    component_type TEXT NOT NULL,
    component_name TEXT,
    installation_date DATE,
    last_maintenance DATE,
    estimated_lifespan INTEGER, -- in years
    maintenance_frequency INTEGER, -- in months
    warranty_expiry DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculator_sessions table
CREATE TABLE public.calculator_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calculator_type TEXT NOT NULL,
    input_data JSONB NOT NULL,
    results JSONB NOT NULL,
    saved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_journey_progress_user_id ON public.journey_progress(user_id);
CREATE INDEX idx_journey_progress_phase ON public.journey_progress(phase);
CREATE INDEX idx_journey_progress_completed ON public.journey_progress(completed);
CREATE INDEX idx_home_details_user_id ON public.home_details(user_id);
CREATE INDEX idx_home_components_home_id ON public.home_components(home_id);
CREATE INDEX idx_calculator_sessions_user_id ON public.calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_type ON public.calculator_sessions(calculator_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON public.journey_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_details_updated_at BEFORE UPDATE ON public.home_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_components_updated_at BEFORE UPDATE ON public.home_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for journey_progress
CREATE POLICY "Users can view own journey progress" ON public.journey_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journey progress" ON public.journey_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journey progress" ON public.journey_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for home_details
CREATE POLICY "Users can view own home details" ON public.home_details
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own home details" ON public.home_details
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own home details" ON public.home_details
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for home_components
CREATE POLICY "Users can view own home components" ON public.home_components
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.home_details WHERE id = home_id));

CREATE POLICY "Users can insert own home components" ON public.home_components
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.home_details WHERE id = home_id));

CREATE POLICY "Users can update own home components" ON public.home_components
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.home_details WHERE id = home_id));

-- RLS Policies for calculator_sessions
CREATE POLICY "Users can view own calculator sessions" ON public.calculator_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculator sessions" ON public.calculator_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculator sessions" ON public.calculator_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically create a user profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, location, first_time_buyer)
    VALUES (NEW.id, 'ON', true); -- Default to Ontario, first-time buyer
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'User profile information including location and preferences';
COMMENT ON TABLE public.journey_progress IS 'Tracks user progress through the home buying journey';
COMMENT ON TABLE public.home_details IS 'Details about purchased homes for maintenance tracking';
COMMENT ON TABLE public.home_components IS 'Individual components/systems within homes for maintenance scheduling';
COMMENT ON TABLE public.calculator_sessions IS 'Saved calculator results and input data';

-- Sample data for testing (optional - remove in production)
-- INSERT INTO public.user_profiles (user_id, location, budget_max, timeline_preference, first_time_buyer)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'ON', 500000, 'normal', true);