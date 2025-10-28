-- Enable RLS on groups table if not already enabled
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Allow authenticated read access to groups" ON public.groups;

-- Policy to allow authenticated users to SELECT (read) all groups
CREATE POLICY "Allow authenticated read access to groups"
ON public.groups FOR SELECT
TO authenticated
USING (true);