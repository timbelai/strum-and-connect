-- Fictitious Data Population

-- Perfis (Profiles)
-- IDs são gerados aleatoriamente para este exemplo, mas em um cenário real,
-- eles seriam os IDs dos usuários autenticados (auth.users.id).
INSERT INTO public.profiles (id, nome, avatar_url, role, cidade, curiosidade) VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Ana Silva', 'https://i.pravatar.cc/150?img=1', 'aluno', 'São Paulo', 'Adora tocar louvores no violão.'),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Bruno Costa', 'https://i.pravatar.cc/150?img=2', 'aluno', 'Rio de Janeiro', 'Começou a aprender violão há 3 meses.'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Prof. Carlos Mendes', 'https://i.pravatar.cc/150?img=3', 'professor', 'Belo Horizonte', 'Especialista em teoria musical e improvisação.'),
('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Prof. Diana Lima', 'https://i.pravatar.cc/150?img=4', 'professor', 'Porto Alegre', 'Ensina violão para iniciantes e crianças.');

-- Grupos (Groups)
INSERT INTO public.groups (id, nome, descricao) VALUES
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Bate-Papo', 'Grupo para conversas gerais e descontração.'),
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Dúvidas', 'Tire suas dúvidas sobre aulas e exercícios.'),
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'Edificação', 'Compartilhe louvores e mensagens inspiradoras.'),
('h8h8h8h8-h8h8-h8h8-h8h8-h8h8h8h8h8h8', 'Violão Avançado', 'Técnicas avançadas e repertório complexo.');

-- Membros de Grupo (Group_Members)
INSERT INTO public.group_members (group_id, user_id) VALUES
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana no Bate-Papo
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Bruno no Bate-Papo
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'), -- Carlos no Bate-Papo
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana nas Dúvidas
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'), -- Carlos nas Dúvidas
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana na Edificação
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Bruno na Edificação
('h8h8h8h8-h8h8-h8h8-h8h8-h8h8h8h8h8h8', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'); -- Carlos no Violão Avançado

-- Mensagens (Messages)
INSERT INTO public.messages (group_id, user_id, content, created_at) VALUES
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Olá a todos! Como estão?', '2024-11-20 09:00:00+00'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Tudo ótimo, Ana! Bem-vindos ao grupo.', '2024-11-20 09:05:00+00'),
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Professor, tenho uma dúvida sobre a escala pentatônica.', '2024-11-20 10:15:00+00'),
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Claro, Ana. Qual sua dúvida específica?', '2024-11-20 10:20:00+00');

-- Tarefas (Tasks)
INSERT INTO public.tasks (id, student_id, link_video, group_id, status, comentario_professor, professor_id, created_at) VALUES
('i9i9i9i9-i9i9-i9i9-i9i9-i9i9i9i9i9i9', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'https://www.youtube.com/watch?v=example1', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'pendente', NULL, NULL, '2024-11-18 14:00:00+00'),
('j0j0j0j0-j0j0-j0j0-j0j0-j0j0j0j0j0j0', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'https://www.youtube.com/watch?v=example2', 'g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'corrigida', 'Ótimo ritmo, Bruno! Continue praticando a troca de acordes.', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '2024-11-15 10:30:00+00');

-- Agendamentos de Vídeo (Video_Meetings)
INSERT INTO public.video_meetings (id, aluno_id, professor_id, horario_inicio, horario_fim, google_calendar_event_id, created_at) VALUES
('k1k1k1k1-k1k1-k1k1-k1k1-k1k1k1k1k1k1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '2024-12-01 10:00:00+00', '2024-12-01 11:00:00+00', NULL, '2024-11-20 11:00:00+00'),
('l2l2l2l2-l2l2-l2l2-l2l2-l2l2l2l2l2l2', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '2024-12-05 14:30:00+00', '2024-12-05 15:30:00+00', NULL, '2024-11-20 12:00:00+00');