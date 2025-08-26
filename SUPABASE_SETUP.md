# Supabase Setup Instructions

## Quick Setup

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project (mvjzmhlwnbwkrtachiec)

2. **Run the SQL Script**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"
   - Copy and paste the entire contents of `supabase-setup.sql`
   - Click "Run" (or press Cmd/Ctrl + Enter)

3. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see the following tables:
     - `submissions` (homepage idea form)
       - Columns: id, url, description, name, email, created_at
     - `roi_leads` (ROI landing page)
       - Columns: id, name, email, company, notes,
         tokens_per_request, requests_per_day, api_cost_per_k, hosting_fee, training_fee, amortization_months,
         current_monthly_spend, utlyze_effective_monthly, savings, roi_percentage,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, page_url, created_at

4. **Test the Forms**
   - Homepage Idea Form: submit once and confirm a row appears in `submissions`
   - ROI Landing Page: visit `/roi/`, run a sample calculation, submit the lead form, and confirm a row appears in `roi_leads` (inputs/results + UTM/referrer)

## Security Notes

- Both tables have Row Level Security (RLS) enabled
- Public users can INSERT (submit forms)
- Only authenticated users can SELECT (view submissions)
- This prevents public users from seeing other submissions

## Viewing Submissions

To view submissions in your Supabase dashboard:
1. Go to "Table Editor"
2. Click on "submissions"
3. You'll see all form submissions with timestamps

## Optional: Email Notifications

If you want to receive email notifications for new submissions, you can set up a Database Webhook or Edge Function in Supabase.