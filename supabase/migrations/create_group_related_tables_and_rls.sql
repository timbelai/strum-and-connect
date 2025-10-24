-- Tabela de Grupos
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nome text NOT NULL,
  descricao text
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view groups"
ON public.groups FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert groups"
ON public.groups FOR INSERT
TO authenticated
WITH CHECK (true);

-- Tabela de Membros de Grupo
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE (group_id, user_id) -- Garante que um usuário só pode ser membro de um grupo uma vez
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view their group memberships"
ON public.group_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert their group memberships"
ON public.group_members FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their group memberships"
ON public.group_members FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Tabela de Mensagens
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages in their groups"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_members.group_id = messages.group_id
      AND group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can insert messages in their groups"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_members.group_id = messages.group_id
      AND group_members.user_id = auth.uid()
  )
);