-- Regional content seed data for BuyRight application
-- This provides the foundation for location-specific guidance

-- Temporary table for regional journey steps
CREATE TEMP TABLE regional_journey_steps (
    region_code VARCHAR(10),
    phase VARCHAR(50),
    step_id VARCHAR(100),
    step_order INTEGER,
    title VARCHAR(200),
    description TEXT,
    estimated_days INTEGER,
    required BOOLEAN,
    regional_specific BOOLEAN
);

-- Ontario, Canada journey steps
INSERT INTO regional_journey_steps VALUES
-- Planning Phase
('ON', 'planning', 'select_location', 1, 'Choose Your Target Area', 'Research neighborhoods, schools, and amenities in Ontario cities', 7, TRUE, TRUE),
('ON', 'planning', 'assess_finances', 2, 'Assess Your Financial Situation', 'Calculate your budget including Ontario land transfer tax', 5, TRUE, TRUE),
('ON', 'planning', 'get_preapproved', 3, 'Get Mortgage Pre-approval', 'Secure pre-approval from Canadian lenders', 10, TRUE, TRUE),
('ON', 'planning', 'find_realtor', 4, 'Find a Real Estate Agent', 'Choose a licensed Ontario real estate professional', 3, TRUE, FALSE),

-- Searching Phase  
('ON', 'searching', 'start_house_hunting', 1, 'Begin Property Search', 'Search MLS listings and attend open houses', 14, TRUE, FALSE),
('ON', 'searching', 'make_offers', 2, 'Make Competitive Offers', 'Submit offers with Ontario-specific conditions', 21, TRUE, TRUE),
('ON', 'searching', 'negotiate_terms', 3, 'Negotiate Purchase Terms', 'Finalize price and closing date', 7, TRUE, FALSE),

-- Financing Phase
('ON', 'financing', 'finalize_mortgage', 1, 'Finalize Mortgage Application', 'Complete application with Canadian lender', 10, TRUE, TRUE),
('ON', 'financing', 'arrange_insurance', 2, 'Arrange Home Insurance', 'Secure property insurance before closing', 3, TRUE, FALSE),
('ON', 'financing', 'lawyer_selection', 3, 'Hire Real Estate Lawyer', 'Required in Ontario for property transfers', 2, TRUE, TRUE),

-- Inspection Phase
('ON', 'inspection', 'book_inspection', 1, 'Schedule Home Inspection', 'Professional property inspection', 2, TRUE, FALSE),
('ON', 'inspection', 'review_inspection', 2, 'Review Inspection Results', 'Address any issues found during inspection', 3, TRUE, FALSE),
('ON', 'inspection', 'final_walkthrough', 3, 'Final Property Walkthrough', 'Confirm property condition before closing', 1, TRUE, FALSE),

-- Closing Phase
('ON', 'closing', 'sign_documents', 1, 'Sign Legal Documents', 'Complete paperwork with Ontario lawyer', 1, TRUE, TRUE),
('ON', 'closing', 'transfer_funds', 2, 'Transfer Funds and Keys', 'Finalize purchase and receive property keys', 1, TRUE, FALSE),
('ON', 'closing', 'register_utilities', 3, 'Register Utilities and Services', 'Set up hydro, gas, internet, etc.', 2, FALSE, FALSE);

-- British Columbia, Canada journey steps
INSERT INTO regional_journey_steps VALUES
-- Planning Phase (BC-specific variations)
('BC', 'planning', 'select_location', 1, 'Choose Your Target Area', 'Research BC neighborhoods, considering seismic zones', 7, TRUE, TRUE),
('BC', 'planning', 'assess_finances', 2, 'Assess Your Financial Situation', 'Calculate budget including BC Property Transfer Tax', 5, TRUE, TRUE),
('BC', 'planning', 'foreign_buyer_check', 3, 'Check Foreign Buyer Requirements', 'Verify BC foreign buyer tax obligations', 2, TRUE, TRUE),
('BC', 'planning', 'get_preapproved', 4, 'Get Mortgage Pre-approval', 'Secure pre-approval considering BC stress test', 10, TRUE, TRUE),

-- Additional BC-specific steps
('BC', 'financing', 'property_disclosure', 1, 'Review Property Disclosure Statement', 'Required BC seller disclosure review', 2, TRUE, TRUE),
('BC', 'closing', 'property_tax_notice', 1, 'Property Tax Assessment Notice', 'Understand BC property assessment system', 1, TRUE, TRUE);

-- US (California example) journey steps  
INSERT INTO regional_journey_steps VALUES
-- Planning Phase (US-CA specific)
('US_CA', 'planning', 'select_location', 1, 'Choose Your Target Area', 'Research California markets and HOA requirements', 7, TRUE, TRUE),
('US_CA', 'planning', 'assess_finances', 2, 'Assess Your Financial Situation', 'Calculate budget with California state taxes', 5, TRUE, TRUE),
('US_CA', 'planning', 'get_preapproved', 3, 'Get Mortgage Pre-approval', 'Secure US mortgage pre-approval', 10, TRUE, TRUE),

-- US-CA specific requirements
('US_CA', 'inspection', 'earthquake_inspection', 2, 'Earthquake Safety Inspection', 'California seismic safety evaluation', 3, FALSE, TRUE),
('US_CA', 'closing', 'title_insurance', 1, 'Purchase Title Insurance', 'Protect against title defects (California)', 2, TRUE, TRUE),
('US_CA', 'closing', 'ca_disclosures', 2, 'Review California Disclosures', 'State-required property disclosures', 1, TRUE, TRUE);

-- This would continue for other regions (Texas, Florida, New York, etc.)
-- For now, we'll create the basic structure

SELECT 'Regional journey steps seeded successfully' as message;