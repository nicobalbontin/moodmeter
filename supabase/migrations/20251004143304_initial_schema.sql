-- Create mood_selections table
CREATE TABLE mood_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  selected_mood TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_mood_selections_session_id ON mood_selections(session_id);
CREATE INDEX idx_mood_selections_mood ON mood_selections(selected_mood);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_selections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is an open app)
CREATE POLICY "Allow all operations" ON mood_selections
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE mood_selections;

