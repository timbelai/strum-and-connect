-- Create ENUMs
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('aluno', 'professor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('pendente', 'corrigida');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.study_type AS ENUM ('individual', 'group', 'live', 'composition');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nome TEXT NOT NULL,
  avatar_url TEXT,
  role public.app_role NOT NULL DEFAULT 'aluno',
  cidade TEXT,
  curiosidade TEXT
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nome TEXT NOT NULL,
  descricao TEXT
);

-- Enable RLS for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Policies for groups
DROP POLICY IF EXISTS "Groups are viewable by authenticated users." ON public.groups;
CREATE POLICY "Groups are viewable by authenticated users." ON public.groups
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Professors can create groups." ON public.groups;
CREATE POLICY "Professors can create groups." ON public.groups
  FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'professor');

DROP POLICY IF EXISTS "Professors can update their own groups." ON public.groups;
CREATE POLICY "Professors can update their own groups." ON public.groups
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'professor');

DROP POLICY IF EXISTS "Professors can delete their own groups." ON public.groups;
CREATE POLICY "Professors can delete their own groups." ON public.groups
  FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'professor');

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- Enable RLS for group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Policies for group_members
DROP POLICY IF EXISTS "Group members are viewable by group members." ON public.group_members;
CREATE POLICY "Group members are viewable by group members." ON public.group_members
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can join groups." ON public.group_members;
CREATE POLICY "Users can join groups." ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave groups." ON public.group_members;
CREATE POLICY "Users can leave groups." ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
DROP POLICY IF EXISTS "Messages are viewable by group members." ON public.messages;
CREATE POLICY "Messages are viewable by group members." ON public.messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = messages.group_id AND gm.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can send messages to groups they are in." ON public.messages;
CREATE POLICY "Users can send messages to groups they are in." ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = messages.group_id AND gm.user_id = auth.uid()));

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.profiles(id),
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  link_video TEXT NOT NULL,
  status public.task_status DEFAULT 'pendente',
  comentario_professor TEXT
);

-- Enable RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies for tasks
DROP POLICY IF EXISTS "Students can view their own tasks." ON public.tasks;
CREATE POLICY "Students can view their own tasks." ON public.tasks
  FOR SELECT USING (auth.uid() = student_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'professor');

DROP POLICY IF EXISTS "Students can insert their own tasks." ON public.tasks;
CREATE POLICY "Students can insert their own tasks." ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Professors can update tasks." ON public.tasks;
CREATE POLICY "Professors can update tasks." ON public.tasks
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'professor');

-- Create video_meetings table
CREATE TABLE IF NOT EXISTS public.video_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aluno_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  horario_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  horario_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  google_calendar_event_id TEXT
);

-- Enable RLS for video_meetings
ALTER TABLE public.video_meetings ENABLE ROW LEVEL SECURITY;

-- Policies for video_meetings
DROP POLICY IF EXISTS "Users can view their own meetings." ON public.video_meetings;
CREATE POLICY "Users can view their own meetings." ON public.video_meetings
  FOR SELECT USING (auth.uid() = aluno_id OR auth.uid() = professor_id);

DROP POLICY IF EXISTS "Students can schedule meetings with professors." ON public.video_meetings;
CREATE POLICY "Students can schedule meetings with professors." ON public.video_meetings
  FOR INSERT WITH CHECK (auth.uid() = aluno_id AND (SELECT role FROM public.profiles WHERE id = professor_id) = 'professor');

DROP POLICY IF EXISTS "Users can update their own meetings." ON public.video_meetings;
CREATE POLICY "Users can update their own meetings." ON public.video_meetings
  FOR UPDATE USING (auth.uid() = aluno_id OR auth.uid() = professor_id);

DROP POLICY IF EXISTS "Users can delete their own meetings." ON public.video_meetings;
CREATE POLICY "Users can delete their own meetings." ON public.video_meetings
  FOR DELETE USING (auth.uid() = aluno_id OR auth.uid() = professor_id);

-- Create user_studies table
CREATE TABLE IF NOT EXISTS public.user_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  study_type public.study_type NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for user_studies
ALTER TABLE public.user_studies ENABLE ROW LEVEL SECURITY;

-- Policies for user_studies
DROP POLICY IF EXISTS "Users can view their own studies." ON public.user_studies;
CREATE POLICY "Users can view their own studies." ON public.user_studies
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own studies." ON public.user_studies;
CREATE POLICY "Users can insert their own studies." ON public.user_studies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own studies." ON public.user_studies;
CREATE POLICY "Users can delete their own studies." ON public.user_studies
  FOR DELETE USING (auth.uid() = user_id);