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
   - You should see a new table called "submissions"
   - The table should have the following columns:
     - id (int8, primary key)
     - url (text, required)
     - description (text, optional)
     - name (text, required)
     - email (text, required)
     - created_at (timestamptz, auto-generated)

4. **Test the Form**
   - Visit your deployed website
   - Fill out and submit the form
   - Check the "Table Editor" in Supabase to see the new submission

## Security Notes

- The table has Row Level Security (RLS) enabled
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