-- 1. Ensure the bucket exists (if not already created in another migration)
INSERT INTO storage.buckets (id, name, public)
VALUES ('Jornadapp', 'Jornadapp', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Remove existing policies for safety (optional, but good for ensuring clean state)
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to avatars" ON storage.objects;

-- 3. Policy to allow authenticated users to INSERT (upload) files into the 'Jornadapp' bucket
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Jornadapp' AND auth.uid() = owner);

-- 4. Policy to allow public SELECT (read) access to files in the 'Jornadapp' bucket
CREATE POLICY "Allow public access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'Jornadapp');