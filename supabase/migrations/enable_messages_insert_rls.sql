-- Habilitar RLS na tabela messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. Política para permitir que usuários autenticados leiam mensagens (SELECT)
DROP POLICY IF EXISTS "Allow authenticated users to read messages" ON public.messages;
CREATE POLICY "Allow authenticated users to read messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_members.group_id = messages.group_id
      AND group_members.user_id = auth.uid()
  )
);

-- 2. Política para permitir que membros do grupo insiram mensagens (INSERT)
DROP POLICY IF EXISTS "Allow group members to insert messages" ON public.messages;
CREATE POLICY "Allow group members to insert messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_members.group_id = messages.group_id
      AND group_members.user_id = auth.uid()
  )
  AND messages.user_id = auth.uid() -- Garante que o user_id inserido é o do usuário logado
);