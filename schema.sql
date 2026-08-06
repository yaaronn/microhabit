-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create HABITS Table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('fitness', 'mindfulness', 'learning', 'health', 'productivity')),
  target_duration_minutes INTEGER DEFAULT 2,
  streak_count INTEGER DEFAULT 0,
  is_completed_today BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create HABIT_LOGS Table
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 10
);

-- 3. Create PET_STATE Table
CREATE TABLE IF NOT EXISTS public.pet_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Buddy',
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  coins INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'egg' CHECK (stage IN ('egg', 'baby', 'teen', 'adult', 'legendary')),
  health INTEGER DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_state ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Users can only access their own data)
CREATE POLICY "Allow individual read for habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert for habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update for habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete for habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow individual read for pet_state" ON public.pet_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert for pet_state" ON public.pet_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update for pet_state" ON public.pet_state FOR UPDATE USING (auth.uid() = user_id);