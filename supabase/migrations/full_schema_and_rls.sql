-- Drop existing policies and tables if they exist to allow re-running the script
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can view groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can insert groups" ON public.groups;

DROP POLICY IF EXISTS "Authenticated users can view their group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Authenticated users can insert their group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Authenticated users can delete their group memberships" ON public.group_members;

DROP POLICY IF EXISTS "Authenticated users can view messages in their groups" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages in their groups" ON public.messages;

DROP POLICY IF EXISTS "Students can view their own tasks and professors can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Students can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Professors can update tasks" ON public.tasks;

DROP POLICY IF EXISTS "Participants can view their own meetings" ON public.video_meetings;
DROP POLICY IF EXISTS "Students can insert new meetings" ON public.video_meetings;
DROP POLICY IF EXISTS "Professors can update meetings" ON public.video_meetings;

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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Tabela de Grupos (Groups)
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
  WITH CHECK (true); -- App logic handles who can create groups (professors)

-- 4. Tabela de Membros de Grupo (Group_Members)
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE (group_id, user_id)
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

-- 5. Tabela de Mensagens (Messages)
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

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own tasks and professors can view all tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
  );

CREATE POLICY "Students can insert their own tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Professors can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
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

ALTER TABLE public.video_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their own meetings"
  ON public.video_meetings FOR SELECT
  TO authenticated
  USING (aluno_id = auth.uid() OR professor_id = auth.uid());

CREATE POLICY "Students can insert new meetings"
  ON public.video_meetings FOR INSERT
  TO authenticated
  WITH CHECK (aluno_id = auth.uid());

CREATE POLICY "Professors can update meetings"
  ON public.video_meetings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
  );