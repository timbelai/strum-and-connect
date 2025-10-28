-- 1. Política para permitir que usuários autenticados façam upload (INSERT)
-- Permite que um usuário insira um arquivo no bucket 'Jornadapp'
-- A verificação de 'owner' é removida do WITH CHECK, pois o owner é definido automaticamente pelo Supabase após o upload.
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Jornadapp');

-- 2. Política para permitir que todos leiam (SELECT) os avatares
-- Permite que qualquer pessoa leia (visualize) os arquivos no bucket 'Jornadapp'
CREATE POLICY "Allow everyone to read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'Jornadapp');

-- 3. Política para permitir que o proprietário atualize (UPDATE) seu próprio avatar
CREATE POLICY "Allow owner to update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'Jornadapp' AND auth.uid() = owner);

-- 4. Política para permitir que o proprietário delete (DELETE) seu próprio avatar
CREATE POLICY "Allow owner to delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'Jornadapp' AND auth.uid() = owner);