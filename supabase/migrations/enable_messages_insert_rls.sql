-- Enable RLS on messages table if not already enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Allow authenticated users to insert messages if they are group members" ON public.messages;

-- Policy to allow authenticated users to INSERT messages
CREATE POLICY "Allow authenticated users to insert messages if they are group members"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_members.group_id = messages.group_id
    AND group_members.user_id = auth.uid()
  )
);