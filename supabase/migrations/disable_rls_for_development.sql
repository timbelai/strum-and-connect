-- Desabilitando RLS nas tabelas principais para desenvolvimento

ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_studies DISABLE ROW LEVEL SECURITY;

-- NOTA: A tabela 'profiles' deve manter o RLS habilitado para proteger dados de perfil,
-- mas as políticas devem ser revisadas se houver problemas de acesso.
-- Se você precisar desabilitar o RLS em 'profiles' também, adicione:
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;