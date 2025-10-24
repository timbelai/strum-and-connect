-- Create ENUM for study types
DO $$ BEGIN
  CREATE TYPE public.study_type AS ENUM ('individual', 'group', 'live', 'composition');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_studies table
CREATE TABLE IF NOT EXISTS public.user_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  study_type public.study_type NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_studies ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own studies
DROP POLICY IF EXISTS "Users can view their own studies." ON public.user_studies;
CREATE POLICY "Users can view their own studies." ON public.user_studies
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own studies
DROP POLICY IF EXISTS "Users can insert their own studies." ON public.user_studies;
CREATE POLICY "Users can insert their own studies." ON public.user_studies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own studies
DROP POLICY IF EXISTS "Users can delete their own studies." ON public.user_studies;
CREATE POLICY "Users can delete their own studies." ON public.user_studies
  FOR DELETE USING (auth.uid() = user_id);