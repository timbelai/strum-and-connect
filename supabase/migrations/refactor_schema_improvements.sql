-- Adicionar restrição de unicidade para group_members
ALTER TABLE public.group_members
ADD CONSTRAINT unique_group_user UNIQUE (group_id, user_id);

-- Alterar a tabela tasks
ALTER TABLE public.tasks
ALTER COLUMN status SET DEFAULT 'pendente',
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL;

-- Alterar a tabela user_studies
ALTER TABLE public.user_studies
ALTER COLUMN completed_at SET DEFAULT now(),
ALTER COLUMN completed_at SET NOT NULL;

-- Garantir que created_at e joined_at sejam NOT NULL e DEFAULT now() para outras tabelas
ALTER TABLE public.groups
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.messages
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.profiles
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.group_members
ALTER COLUMN joined_at SET DEFAULT now(),
ALTER COLUMN joined_at SET NOT NULL;

ALTER TABLE public.video_meetings
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL;