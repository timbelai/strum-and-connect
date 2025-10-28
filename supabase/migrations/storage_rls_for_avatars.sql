-- Habilita RLS no bucket 'avatars' (se já não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Política para permitir que usuários autenticados façam upload (INSERT)
-- Permite que um usuário insira um arquivo no bucket 'avatars'
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- 2. Política para permitir que todos leiam (SELECT) os avatares
-- Permite que qualquer pessoa leia (visualize) os arquivos no bucket 'avatars'
CREATE POLICY "Allow everyone to read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 3. Política para permitir que o proprietário atualize (UPDATE) seu próprio avatar
CREATE POLICY "Allow owner to update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 4. Política para permitir que o proprietário delete (DELETE) seu próprio avatar
CREATE POLICY "Allow owner to delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);