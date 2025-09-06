-- Create submissions table for Utlyze lead capture
CREATE TABLE IF NOT EXISTS public.submissions (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    description TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (anyone can submit the form)
CREATE POLICY "Allow public inserts" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to view all submissions (for admin access)
CREATE POLICY "Allow authenticated select" 
ON public.submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Add indexes for better query performance
CREATE INDEX idx_submissions_email ON public.submissions(email);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

-- Add a comment on the table
COMMENT ON TABLE public.submissions IS 'Stores lead capture form submissions from the Utlyze website';

-- Contact Submissions (enterprise contact form)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    company_size TEXT,
    industry TEXT,
    current_ai_usage TEXT,
    interested_solutions TEXT[],
    timeline TEXT,
    budget_range TEXT,
    pain_points TEXT NOT NULL,
    message TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (form submissions)
CREATE POLICY IF NOT EXISTS "Allow public inserts (contact_submissions)"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to view submissions
CREATE POLICY IF NOT EXISTS "Allow authenticated select (contact_submissions)"
ON public.contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

COMMENT ON TABLE public.contact_submissions IS 'Enterprise contact form submissions (validated + honeypot)';

-- ROI Calculator Leads
-- Stores leads captured from the ROI landing page, including calculator inputs,
-- computed results, and UTM/referrer metadata for attribution.
CREATE TABLE IF NOT EXISTS public.roi_leads (
    id BIGSERIAL PRIMARY KEY,
    -- Contact fields
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    notes TEXT,
    role TEXT,
    pain_points TEXT[],
    -- Calculator inputs
    tokens_per_request NUMERIC,
    requests_per_day INTEGER,
    api_cost_per_k NUMERIC,
    hosting_fee NUMERIC,
    training_fee NUMERIC,
    amortization_months INTEGER DEFAULT 12,
    -- Computed values
    current_monthly_spend NUMERIC,
    utlyze_effective_monthly NUMERIC,
    savings NUMERIC,
    roi_percentage NUMERIC,
    spend_range TEXT,
    -- Advanced/methodology inputs (optional)
    use_case_preset TEXT,
    offload_percent NUMERIC,
    prompt_reduction_percent NUMERIC,
    caching_hit_rate_percent NUMERIC,
    batching_efficiency_percent NUMERIC,
    hosted_rate_per_k NUMERIC,
    -- Additional computed/summary fields (optional)
    projected_new_monthly_cost NUMERIC,
    payback_days INTEGER,
    -- Attribution metadata
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    referrer TEXT,
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Detailed metrics (optional)
    baseline_monthly_tokens NUMERIC,
    offloaded_tokens NUMERIC,
    hosted_token_cost NUMERIC,
    remaining_api_cost NUMERIC,
    new_monthly_cost NUMERIC,
    detailed_report TEXT
);

-- Enable RLS for ROI leads
ALTER TABLE public.roi_leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (form submissions)
CREATE POLICY "Allow public inserts (roi_leads)"
ON public.roi_leads
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to view ROI leads
CREATE POLICY "Allow authenticated select (roi_leads)"
ON public.roi_leads
FOR SELECT
USING (auth.role() = 'authenticated');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_roi_leads_email ON public.roi_leads(email);
CREATE INDEX IF NOT EXISTS idx_roi_leads_created_at ON public.roi_leads(created_at DESC);

-- Documentation comment
COMMENT ON TABLE public.roi_leads IS 'Leads from ROI calculator including inputs/results and UTM metadata';

-- Ensure new columns exist when applying to an existing database
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS pain_points TEXT[];
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS spend_range TEXT;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS use_case_preset TEXT;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS offload_percent NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS prompt_reduction_percent NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS caching_hit_rate_percent NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS batching_efficiency_percent NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS hosted_rate_per_k NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS projected_new_monthly_cost NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS payback_days INTEGER;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS baseline_monthly_tokens NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS offloaded_tokens NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS hosted_token_cost NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS remaining_api_cost NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS new_monthly_cost NUMERIC;
ALTER TABLE public.roi_leads ADD COLUMN IF NOT EXISTS detailed_report TEXT;

-- Contact submissions (enterprise contact form)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_size TEXT,
    industry TEXT,
    current_ai_usage TEXT,
    interested_solutions TEXT[],
    timeline TEXT,
    budget_range TEXT,
    pain_points TEXT NOT NULL,
    message TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (form submissions)
CREATE POLICY IF NOT EXISTS "Allow public inserts (contact_submissions)"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to view contact submissions
CREATE POLICY IF NOT EXISTS "Allow authenticated select (contact_submissions)"
ON public.contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
