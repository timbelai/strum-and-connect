-- Cria a tabela de grupos se ela não existir
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nome text NOT NULL,
  descricao text
);

-- Habilita Row Level Security (RLS) para a tabela groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Permite que usuários autenticados visualizem todos os grupos
CREATE POLICY "Authenticated users can view groups"
ON public.groups FOR SELECT
TO authenticated
USING (true);

-- Permite que usuários autenticados insiram novos grupos
-- (Necessário para a criação dos grupos padrão)
CREATE POLICY "Authenticated users can insert groups"
ON public.groups FOR INSERT
TO authenticated
WITH CHECK (true);