-- Enable RLS on group_members table if not already enabled
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Allow authenticated insert access to group_members" ON public.group_members;

-- Policy to allow authenticated users to INSERT (join a group)
CREATE POLICY "Allow authenticated insert access to group_members"
ON public.group_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);