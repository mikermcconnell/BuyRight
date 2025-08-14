-- BuyRight Database Schema Migration 002
-- Performance optimization indexes and constraints
-- This migration adds additional indexes for better query performance

-- Additional indexes for journey_progress table
-- Composite index for user_id + step_id (most common query pattern)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journey_progress_user_step 
ON journey_progress(user_id, step_id);

-- Composite index for user_id + phase (common for phase progress queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journey_progress_user_phase 
ON journey_progress(user_id, phase);

-- Index for completed status with timestamp (for analytics and progress tracking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journey_progress_completed_at 
ON journey_progress(completed, completed_at) WHERE completed = true;

-- Index for updated_at for efficient cache invalidation checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journey_progress_updated_at 
ON journey_progress(updated_at);

-- Additional indexes for user_profiles table
-- Index for location-based queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_location 
ON user_profiles(location);

-- Index for budget range queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_budget 
ON user_profiles(budget_max) WHERE budget_max IS NOT NULL;

-- Index for first-time buyer status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_first_time 
ON user_profiles(first_time_buyer);

-- Additional indexes for calculator_sessions table
-- Composite index for user_id + calculator_type (common query pattern)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_sessions_user_type 
ON calculator_sessions(user_id, calculator_type);

-- Index for saved calculations only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_sessions_saved 
ON calculator_sessions(user_id, saved, created_at) WHERE saved = true;

-- Index for recent sessions (for analytics)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_sessions_recent 
ON calculator_sessions(created_at DESC);

-- Additional indexes for home_details table
-- Index for purchase date (for timeline analysis)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_details_purchase_date 
ON home_details(purchase_date);

-- Index for home type queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_details_type 
ON home_details(home_type);

-- Index for year built (for age-based maintenance suggestions)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_details_year_built 
ON home_details(year_built);

-- Additional indexes for home_components table
-- Composite index for home_id + component_type (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_components_home_type 
ON home_components(home_id, component_type);

-- Index for maintenance due dates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_components_maintenance_due 
ON home_components(last_maintenance, maintenance_frequency) 
WHERE last_maintenance IS NOT NULL AND maintenance_frequency IS NOT NULL;

-- Index for warranty expiry tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_components_warranty 
ON home_components(warranty_expiry) WHERE warranty_expiry IS NOT NULL;

-- Partial index for components needing maintenance soon
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_home_components_maintenance_needed 
ON home_components(home_id, last_maintenance, maintenance_frequency)
WHERE last_maintenance IS NOT NULL 
AND maintenance_frequency IS NOT NULL 
AND (EXTRACT(EPOCH FROM (NOW() - last_maintenance)) / 2592000) >= maintenance_frequency;

-- Add unique constraint to prevent duplicate journey steps per user
-- This prevents race conditions and duplicate progress entries
ALTER TABLE journey_progress 
ADD CONSTRAINT unique_user_step UNIQUE (user_id, step_id);

-- Add check constraints for data integrity
ALTER TABLE user_profiles 
ADD CONSTRAINT check_timeline_preference 
CHECK (timeline_preference IN ('fast', 'normal', 'thorough'));

ALTER TABLE user_profiles 
ADD CONSTRAINT check_home_type_preference 
CHECK (home_type_preference IN ('single_family', 'condo', 'townhouse', 'duplex', 'mobile', 'other'));

ALTER TABLE journey_progress 
ADD CONSTRAINT check_phase 
CHECK (phase IN ('planning', 'financing', 'searching', 'inspection', 'closing', 'maintenance'));

ALTER TABLE home_details 
ADD CONSTRAINT check_home_type 
CHECK (home_type IN ('single_family', 'condo', 'townhouse', 'duplex', 'mobile', 'other'));

-- Add check constraint for reasonable values
ALTER TABLE home_details 
ADD CONSTRAINT check_reasonable_year_built 
CHECK (year_built >= 1800 AND year_built <= EXTRACT(YEAR FROM NOW()) + 5);

ALTER TABLE home_details 
ADD CONSTRAINT check_positive_square_footage 
CHECK (square_footage > 0);

ALTER TABLE home_details 
ADD CONSTRAINT check_positive_purchase_price 
CHECK (purchase_price > 0);

-- Performance optimization for JSONB columns
-- Create GIN indexes on JSONB columns for faster queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journey_progress_data_gin 
ON journey_progress USING GIN (data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_sessions_input_gin 
ON calculator_sessions USING GIN (input_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_sessions_results_gin 
ON calculator_sessions USING GIN (results);

-- Update table statistics for query planner optimization
ANALYZE user_profiles;
ANALYZE journey_progress;
ANALYZE home_details;
ANALYZE home_components;
ANALYZE calculator_sessions;

-- Add comments for documentation
COMMENT ON INDEX idx_journey_progress_user_step IS 'Composite index for efficient user journey step lookups';
COMMENT ON INDEX idx_journey_progress_user_phase IS 'Composite index for phase progress calculations';
COMMENT ON INDEX idx_journey_progress_completed_at IS 'Index for completion analytics and timeline tracking';
COMMENT ON INDEX idx_calculator_sessions_user_type IS 'Composite index for user calculator history queries';
COMMENT ON INDEX idx_home_components_maintenance_needed IS 'Partial index for maintenance reminders and notifications';
COMMENT ON CONSTRAINT unique_user_step ON journey_progress IS 'Prevents duplicate progress entries per user step';