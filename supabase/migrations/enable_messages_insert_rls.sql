-- Habilitar RLS na tabela messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. Política para permitir que usuários autenticados leiam mensagens (SELECT)
-- Permitir que qualquer usuário autenticado leia mensagens em qualquer grupo.
DROP POLICY IF EXISTS "Allow authenticated users to read messages" ON public.messages;
CREATE POLICY "Allow authenticated users to read messages"
ON public.messages
FOR SELECT
TO authenticated
USING (true); -- 'true' significa que todos os autenticados podem ler

-- 2. Política para permitir que qualquer usuário autenticado insira mensagens (INSERT)
-- O usuário deve ser autenticado e o user_id da mensagem deve ser o seu próprio ID.
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
CREATE POLICY "Allow authenticated users to insert messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);