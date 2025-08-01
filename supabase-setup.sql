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