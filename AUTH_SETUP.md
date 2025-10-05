# MoodMeter Authentication Setup Guide

## 🎯 Overview
This guide will help you set up and test the new OTP-based authentication system for MoodMeter.

## 📖 When to Use This Guide

### Scenario 1: New Developer Joining the Team
A new developer clones the repo and needs to set up their local environment:
```bash
# 1. Clone the repo
git clone <repo-url>
cd moodmeter

# 2. Install dependencies
npm install

# 3. Set up environment variables (ask team for Supabase credentials)
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Follow Steps 1-4 in this guide to configure Supabase
# 5. Test authentication flow (see "Testing" section below)
```

### Scenario 2: Deploying to Production
You're launching your app and need to configure a new Supabase production project:
1. Create new Supabase project for production
2. Run database migrations (Step 1)
3. Configure email templates (Step 2) - **manually in dashboard**
4. Configure auth settings (Step 3) - **manually in dashboard**
5. Update production environment variables
6. Test with real email addresses

### Scenario 3: Creating a Staging Environment
You want a staging environment for testing before production:
1. Create new Supabase project for staging
2. Follow Steps 1-4 in this guide
3. Use staging Supabase URL/keys in your staging deployment

### Scenario 4: Troubleshooting Issues
A user reports they can't log in:
1. Check "Troubleshooting" section at bottom
2. Verify email templates are configured correctly
3. Check Supabase logs for error messages
4. Test the authentication flow yourself

### Scenario 5: Coming Back After Time Away
You haven't touched the project in weeks and forgot how auth works:
1. Read the "What's Been Implemented" section
2. Review the "User Experience Flow" diagram
3. Check the "Testing" section to verify everything still works

---

## 📌 Real Example: What Just Happened

**Problem:** User received "Confirm your signup" email with a link instead of OTP code

**How AUTH_SETUP.md helped solve it:**
1. **Identified the issue** - Step 2 explains email templates must use `{{ .Token }}`
2. **Found the solution** - Updated email templates in Supabase Dashboard
3. **Documented for future** - Troubleshooting section now has this exact issue
4. **Prevents recurrence** - Next person deploying will follow Step 2 correctly

**Key Learning:** Configuration in Supabase Dashboard (like email templates) is NOT in code/migrations, so documentation is critical!

---

## 📋 What's Been Implemented

### 1. **Database Schema** (`supabase/migrations/20251005000000_auth_schema.sql`)
- ✅ `user_profiles` table linked to Supabase Auth
- ✅ Updated `mood_selections` with `user_id` foreign key
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Automatic timestamp updates

### 2. **Authentication Flow**
- ✅ Email entry page (`/auth/login`)
- ✅ OTP verification page (`/auth/verify`)
- ✅ 6-digit OTP input with auto-submit
- ✅ User profile auto-creation on first login
- ✅ Session persistence (6 months)

### 3. **User Experience**
- ✅ Auto-extract name from email (e.g., `nicolas_balbontin@trimble.com` → "Nicolas")
- ✅ Auto-generated avatar using DiceBear API
- ✅ User info displayed in sidebar footer
- ✅ Logout functionality
- ✅ Protected routes with middleware

## 🚀 Setup Instructions

### Quick Checklist for New Environment Setup

Use this when setting up local dev, staging, or production:

```
□ Create Supabase project (or use existing)
□ Copy environment variables to .env.local
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
□ Run database migration (Step 1)
□ Configure email templates in Supabase Dashboard (Step 2)
  - Magic Link template
  - Confirm Signup template
□ Verify Email provider settings (Step 3)
□ Start development server (Step 4)
□ Test authentication flow
  - Sign up with test email
  - Receive 6-digit OTP code
  - Enter code and verify login works
```

---

### Step 1: Apply Database Migration

Run the migration to update your Supabase schema:

```bash
# Make sure you're in the project directory
cd /Users/nbalbon/Desktop/cursor_projects/moodmeter

# Run the migration
npx supabase db push
```

### Step 2: Configure Supabase Email Templates (CRITICAL!)

⚠️ **Important:** Email templates are stored in Supabase's configuration, NOT in migrations. You must configure these manually for each environment (production, staging, etc.).

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Update **ALL** of these templates to use OTP codes instead of links:

#### Magic Link Template
```html
<h2>Your MoodMeter Verification Code</h2>
<p>Your 6-digit verification code is:</p>
<h1 style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">{{ .Token }}</h1>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

#### Confirm Signup Template
```html
<h2>Your MoodMeter Verification Code</h2>
<p>Your 6-digit verification code is:</p>
<h1 style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">{{ .Token }}</h1>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

**Key Changes:**
- Replace `{{ .ConfirmationURL }}` with `{{ .Token }}` in ALL templates
- This ensures users receive OTP codes, not magic links

### Step 3: Configure Supabase Auth Settings (CRITICAL!)

1. Go to **Authentication** → **Providers** → Click **Email**
2. Ensure these settings are configured:
   - ✅ **Enable Email provider**: ON
   - ✅ **Enable email confirmations**: **OFF** (MUST be disabled for OTP flow)
   - ✅ **Secure email change**: ON (optional)
3. Click **Save**

**Why disable email confirmations?**
When enabled, new users receive a "Confirm your signup" email with a link instead of the OTP code. For OTP authentication to work, this must be disabled.

### Step 4: Start Development Server

```bash
npm run dev
```

## 🧪 Testing the Authentication Flow

### Test Scenario 1: New User Registration

1. **Navigate to the app**: `http://localhost:3000`
   - Should redirect to `/auth/login` (middleware protection)

2. **Enter your email**: e.g., `nicolas_balbontin@trimble.com`
   - Click "Continue"
   - Toast notification: "Verification code sent!"
   - Redirects to `/auth/verify`

3. **Check your email**
   - You'll receive an email with a 6-digit code
   - Example: `123456`

4. **Enter the 6-digit code**
   - Type the code in the input fields
   - Auto-submits when all 6 digits are entered
   - Creates user profile automatically
   - Display name extracted: "Nicolas"
   - Avatar generated based on email

5. **View dashboard**
   - Redirects to `/` (main dashboard)
   - Sidebar footer shows:
     - Avatar
     - Display name: "Nicolas"
     - Email: "nicolas_balbontin@trimble.com"

### Test Scenario 2: Returning User

1. **Open app in new tab/window**
   - Should load directly to dashboard (session persists)
   - No login required

2. **Test logout**
   - Click user dropdown in sidebar footer
   - Click "Log out"
   - Redirects to `/auth/login`
   - Toast: "Logged out successfully"

3. **Log back in**
   - Enter same email
   - Receive new OTP code
   - Enter code
   - Loads existing user profile (no duplicate creation)

### Test Scenario 3: Session Persistence

1. **Close browser completely**
2. **Reopen and navigate to app**
   - Should still be logged in (6-month session)
   - User data loads from profile

### Test Scenario 4: Protected Routes

1. **While logged out**, try accessing:
   - `/` → Redirects to `/auth/login`
   - `/dashboard` → Redirects to `/auth/login`
   - `/moodmeter-table-full` → Redirects to `/auth/login`

2. **While logged in**, try accessing:
   - `/auth/login` → Redirects to `/`
   - `/auth/verify` → Redirects to `/` (unless coming from login flow)

## 🔍 Verification Checklist

- [ ] Migration applied successfully
- [ ] Email templates configured in Supabase
- [ ] Can receive OTP emails
- [ ] New user can sign up with OTP
- [ ] User profile created automatically
- [ ] Display name extracted correctly from email
- [ ] Avatar shows in sidebar
- [ ] Email shows in sidebar
- [ ] Can log out successfully
- [ ] Can log back in
- [ ] Session persists after browser restart
- [ ] Protected routes redirect when not authenticated
- [ ] Auth routes redirect when already authenticated

## 🎨 User Experience Flow

```
┌─────────────────────────────────────────────┐
│  User visits app (http://localhost:3000)   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Authenticated? │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       YES               NO
        │                 │
        ▼                 ▼
┌───────────────┐  ┌─────────────────┐
│  Dashboard    │  │  /auth/login    │
│  (main page)  │  │  Enter email    │
└───────────────┘  └────────┬────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │  /auth/verify    │
                   │  Enter 6-digit   │
                   │  OTP code        │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Create profile  │
                   │  if new user     │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  Dashboard       │
                   │  (logged in)     │
                   └──────────────────┘
```

## 🗄️ Database Schema

### `user_profiles` Table
- `id` (UUID, PK): Links to `auth.users.id`
- `email` (TEXT, UNIQUE): User email
- `display_name` (TEXT): Extracted from email
- `avatar_url` (TEXT): DiceBear avatar URL
- `created_at` (TIMESTAMP): Account creation time
- `updated_at` (TIMESTAMP): Last update time

### `mood_selections` Table (Updated)
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Links to `auth.users.id` **[NEW]**
- `user_name` (TEXT): Display name
- `user_color` (TEXT): User color
- `selected_mood` (TEXT): Mood selection
- `session_id` (TEXT): Session identifier
- `created_at` (TIMESTAMP): Selection time
- `updated_at` (TIMESTAMP): Last update time

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Middleware protects all routes
- ✅ Session tokens stored securely in cookies
- ✅ PKCE flow for secure authentication
- ✅ 6-month session duration (configurable)

## 🐛 Troubleshooting

### Issue: Receiving "Confirm your signup" email with link instead of OTP code
**Symptoms:** Email says "Confirm your signup" with a confirmation link, not a 6-digit code

**Cause:** Email confirmations are enabled in Supabase settings

**Solution:**
1. Go to **Authentication** → **Providers** → **Email**
2. Find **"Enable email confirmations"** toggle
3. **Turn it OFF** (disable it)
4. Save changes
5. Delete unconfirmed users (they're stuck in confirmation state):
   ```sql
   DELETE FROM auth.users WHERE email_confirmed_at IS NULL;
   ```
6. Have users try signing up again

### Issue: Not receiving OTP emails
- Check Supabase email settings
- Verify email template is configured
- Check spam folder
- Try different email address

### Issue: Session not persisting
- Check browser cookies are enabled
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Clear browser cache and cookies

### Issue: Middleware redirects in loop
- Check middleware matcher configuration
- Verify Supabase auth is working
- Check browser console for errors

### Issue: User profile not created
- Check RLS policies in Supabase
- Verify migration ran successfully
- Check browser console for API errors

## 📝 Next Steps

After successful testing, you can:
1. Customize email templates in Supabase
2. Add custom avatar upload functionality
3. Allow users to edit their display name
4. Implement additional profile fields
5. Add profile settings page

## 🎉 You're All Set!

Your MoodMeter app now has a secure, user-friendly authentication system with OTP verification and 6-month session persistence!
