-- BuyRight Supabase Database Setup
-- This migration sets up the database for use with Supabase Auth and RLS

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_sessions ENABLE ROW LEVEL SECURITY;

-- Drop the custom users table since Supabase provides auth.users
-- We'll use references to auth.users(id) instead
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

-- Update user_profiles to reference auth.users
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update journey_progress to reference auth.users
ALTER TABLE journey_progress 
DROP CONSTRAINT IF EXISTS journey_progress_user_id_fkey;

ALTER TABLE journey_progress 
ADD CONSTRAINT journey_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update home_details to reference auth.users
ALTER TABLE home_details 
DROP CONSTRAINT IF EXISTS home_details_user_id_fkey;

ALTER TABLE home_details 
ADD CONSTRAINT home_details_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update calculator_sessions to reference auth.users
ALTER TABLE calculator_sessions 
DROP CONSTRAINT IF EXISTS calculator_sessions_user_id_fkey;

ALTER TABLE calculator_sessions 
ADD CONSTRAINT calculator_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Row Level Security Policies

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Journey Progress: Users can only access their own progress
CREATE POLICY "Users can view their own journey progress" ON journey_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journey progress" ON journey_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey progress" ON journey_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey progress" ON journey_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Home Details: Users can only access their own home details
CREATE POLICY "Users can view their own home details" ON home_details
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own home details" ON home_details
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own home details" ON home_details
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own home details" ON home_details
    FOR DELETE USING (auth.uid() = user_id);

-- Home Components: Users can only access components for their own homes
CREATE POLICY "Users can view their own home components" ON home_components
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM home_details 
            WHERE home_details.id = home_components.home_id 
            AND home_details.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert components for their own homes" ON home_components
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM home_details 
            WHERE home_details.id = home_components.home_id 
            AND home_details.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own home components" ON home_components
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM home_details 
            WHERE home_details.id = home_components.home_id 
            AND home_details.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own home components" ON home_components
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM home_details 
            WHERE home_details.id = home_components.home_id 
            AND home_details.user_id = auth.uid()
        )
    );

-- Calculator Sessions: Users can only access their own calculator sessions
CREATE POLICY "Users can view their own calculator sessions" ON calculator_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculator sessions" ON calculator_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculator sessions" ON calculator_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculator sessions" ON calculator_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, location, first_time_buyer)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'location', 'ON'),
    COALESCE((NEW.raw_user_meta_data->>'first_time_buyer')::boolean, true)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Additional indexes for better performance with auth
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_user_phase ON journey_progress(user_id, phase);
CREATE INDEX IF NOT EXISTS idx_home_details_user_id ON home_details(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_sessions_user_type ON calculator_sessions(user_id, calculator_type);

-- Update the updated_at triggers to work with the new table structure
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_journey_progress_updated_at ON journey_progress;
DROP TRIGGER IF EXISTS update_home_details_updated_at ON home_details;
DROP TRIGGER IF EXISTS update_home_components_updated_at ON home_components;

-- Recreate the triggers for the remaining tables
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_progress_updated_at 
  BEFORE UPDATE ON journey_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_details_updated_at 
  BEFORE UPDATE ON home_details 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_components_updated_at 
  BEFORE UPDATE ON home_components 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clean up any existing test data that won't work with auth.users
DELETE FROM journey_progress WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM user_profiles WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM home_details WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM calculator_sessions WHERE user_id NOT IN (SELECT id FROM auth.users);