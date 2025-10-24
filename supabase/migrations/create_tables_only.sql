-- Drop existing tables and types if they exist to allow re-running the script
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.video_meetings CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS public.app_role;
DROP TYPE IF EXISTS public.task_status;

-- 1. Enums
CREATE TYPE public.app_role AS ENUM ('aluno', 'professor');
CREATE TYPE public.task_status AS ENUM ('pendente', 'corrigida');

-- 2. Tabela de Perfis (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  nome text NOT NULL,
  avatar_url text,
  role public.app_role DEFAULT 'aluno'::public.app_role NOT NULL,
  cidade text,
  curiosidade text
);

-- 3. Tabela de Grupos (Groups)
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nome text NOT NULL,
  descricao text
);

-- 4. Tabela de Membros de Grupo (Group_Members)
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- 5. Tabela de Mensagens (Messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL
);

-- 6. Tabela de Tarefas (Tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  link_video text NOT NULL,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  status public.task_status DEFAULT 'pendente'::public.task_status NOT NULL,
  comentario_professor text,
  professor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 7. Tabela de Agendamentos de Vídeo (Video_Meetings)
CREATE TABLE IF NOT EXISTS public.video_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  aluno_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  horario_inicio timestamp with time zone NOT NULL,
  horario_fim timestamp with time zone NOT NULL,
  google_calendar_event_id text
);