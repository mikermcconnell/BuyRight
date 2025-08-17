-- User Profile Enhancements for BuyRight
-- Run this after the main schema to add comprehensive profile fields

-- Add new columns to user_profiles table for enhanced profile information
ALTER TABLE public.user_profiles
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN display_name TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN employment_status TEXT CHECK (employment_status IN ('employed', 'self_employed', 'unemployed', 'retired', 'student')),
ADD COLUMN annual_income NUMERIC(12,2),
ADD COLUMN credit_score_range TEXT CHECK (credit_score_range IN ('poor', 'fair', 'good', 'very_good', 'excellent')),
ADD COLUMN preferred_communication TEXT DEFAULT 'email' CHECK (preferred_communication IN ('email', 'phone', 'sms')),
ADD COLUMN notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN marketing_emails BOOLEAN DEFAULT false,
ADD COLUMN timezone TEXT DEFAULT 'America/Toronto',
ADD COLUMN language_preference TEXT DEFAULT 'en',
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_phone TEXT,
ADD COLUMN emergency_contact_relationship TEXT;

-- Update existing columns with better defaults and constraints
ALTER TABLE public.user_profiles
ALTER COLUMN timeline_preference SET DEFAULT 'normal',
ADD COLUMN current_living_situation TEXT CHECK (current_living_situation IN ('renting', 'living_with_family', 'owned', 'other')),
ADD COLUMN current_rent_amount NUMERIC(8,2),
ADD COLUMN preferred_bedrooms INTEGER DEFAULT 2 CHECK (preferred_bedrooms >= 1),
ADD COLUMN preferred_bathrooms NUMERIC(2,1) DEFAULT 2.0 CHECK (preferred_bathrooms >= 1),
ADD COLUMN max_commute_time INTEGER, -- in minutes
ADD COLUMN has_pets BOOLEAN DEFAULT false,
ADD COLUMN pet_restrictions TEXT,
ADD COLUMN accessibility_needs TEXT,
ADD COLUMN special_requirements TEXT,
ADD COLUMN real_estate_agent_name TEXT,
ADD COLUMN real_estate_agent_contact TEXT,
ADD COLUMN mortgage_pre_approved BOOLEAN DEFAULT false,
ADD COLUMN pre_approval_amount NUMERIC(12,2),
ADD COLUMN pre_approval_expiry DATE,
ADD COLUMN lender_name TEXT,
ADD COLUMN down_payment_saved NUMERIC(12,2),
ADD COLUMN down_payment_percentage INTEGER DEFAULT 10 CHECK (down_payment_percentage >= 5 AND down_payment_percentage <= 100);

-- Create user preferences table for more granular settings
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    preference_category TEXT NOT NULL,
    preference_key TEXT NOT NULL,
    preference_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_category, preference_key)
);

-- Create user activity log table for tracking important actions
CREATE TABLE public.user_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_description TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved searches table for property searches
CREATE TABLE public.saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    search_name TEXT NOT NULL,
    search_criteria JSONB NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user documents table for important document tracking
CREATE TABLE public.user_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    document_url TEXT,
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE,
    is_verified BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for new tables
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_category ON public.user_preferences(preference_category);
CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_type ON public.user_activity_log(activity_type);
CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX idx_user_documents_type ON public.user_documents(document_type);

-- Add RLS policies for new tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_activity_log (read-only for users)
CREATE POLICY "Users can view own activity log" ON public.user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for saved_searches
CREATE POLICY "Users can manage own saved searches" ON public.saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_documents
CREATE POLICY "Users can manage own documents" ON public.user_documents
    FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON public.user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at 
    BEFORE UPDATE ON public.saved_searches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_documents_updated_at 
    BEFORE UPDATE ON public.user_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.user_activity_log (
        user_id, 
        activity_type, 
        activity_description, 
        metadata
    )
    VALUES (
        p_user_id, 
        p_activity_type, 
        p_description, 
        p_metadata
    )
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile completeness percentage
CREATE OR REPLACE FUNCTION public.get_profile_completeness(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_score INTEGER := 0;
    profile_record RECORD;
BEGIN
    SELECT * INTO profile_record 
    FROM public.user_profiles 
    WHERE user_id = p_user_id;
    
    IF profile_record IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Required fields (20 points each)
    IF profile_record.first_name IS NOT NULL THEN completion_score := completion_score + 20; END IF;
    IF profile_record.last_name IS NOT NULL THEN completion_score := completion_score + 20; END IF;
    IF profile_record.location IS NOT NULL THEN completion_score := completion_score + 20; END IF;
    
    -- Important fields (10 points each)
    IF profile_record.phone IS NOT NULL THEN completion_score := completion_score + 10; END IF;
    IF profile_record.budget_max IS NOT NULL THEN completion_score := completion_score + 10; END IF;
    IF profile_record.annual_income IS NOT NULL THEN completion_score := completion_score + 10; END IF;
    IF profile_record.employment_status IS NOT NULL THEN completion_score := completion_score + 10; END IF;
    
    -- Cap at 100%
    IF completion_score > 100 THEN
        completion_score := 100;
    END IF;
    
    RETURN completion_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on new tables and functions
GRANT ALL ON public.user_preferences TO authenticated;
GRANT SELECT ON public.user_activity_log TO authenticated;
GRANT ALL ON public.saved_searches TO authenticated;
GRANT ALL ON public.user_documents TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_completeness TO authenticated;

-- Comments for new tables
COMMENT ON TABLE public.user_preferences IS 'Granular user preferences and settings';
COMMENT ON TABLE public.user_activity_log IS 'Log of user activities for security and analytics';
COMMENT ON TABLE public.saved_searches IS 'User saved property searches with criteria';
COMMENT ON TABLE public.user_documents IS 'Important documents uploaded by users';