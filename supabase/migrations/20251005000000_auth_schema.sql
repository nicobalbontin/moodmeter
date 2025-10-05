-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table linked to auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update mood_selections table to use authenticated users
-- First, drop the old policy
DROP POLICY IF EXISTS "Allow all operations" ON mood_selections;

-- Add user_id column to mood_selections
ALTER TABLE mood_selections
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id required for new records
ALTER TABLE mood_selections
ALTER COLUMN user_id SET NOT NULL;

-- Create index for faster user queries
CREATE INDEX idx_mood_selections_user_id ON mood_selections(user_id);

-- Enable Row Level Security on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for initial signup)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for mood_selections (updated for auth)
-- Users can view all mood selections (for collaborative mood board)
CREATE POLICY "Users can view all mood selections"
  ON mood_selections
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can insert their own mood selections
CREATE POLICY "Users can insert own mood selections"
  ON mood_selections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own mood selections
CREATE POLICY "Users can update own mood selections"
  ON mood_selections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own mood selections
CREATE POLICY "Users can delete own mood selections"
  ON mood_selections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for mood_selections
CREATE TRIGGER update_mood_selections_updated_at
  BEFORE UPDATE ON mood_selections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
