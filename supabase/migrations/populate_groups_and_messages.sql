-- Additional Fictitious Data for Groups and Messages

-- Existing Profile IDs (from previous script)
-- 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1' as Ana Silva (aluno)
-- 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' as Bruno Costa (aluno)
-- 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' as Prof. Carlos Mendes (professor)
-- 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4' as Prof. Diana Lima (professor)

-- Existing Group IDs (from previous script)
-- 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5' as Bate-Papo
-- 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6' as Dúvidas
-- 'g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7' as Edificação
-- 'h8h8h8h8-h8h8-h8h8-h8h8-h8h8h8h8h8h8' as Violão Avançado

-- New Groups
INSERT INTO public.groups (id, nome, descricao) VALUES
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'Iniciantes', 'Grupo para quem está começando no violão.'),
('n0n0n0n0-n0n0-n0n0-n0n0-n0n0n0n0n0n0', 'Teoria Musical', 'Discussões sobre harmonia, escalas e acordes.'),
('o1o1o1o1-o1o1-o1o1-o1o1-o1o1o1o1o1o1', 'Repertório Cristão', 'Compartilhamento de cifras e arranjos de louvores.');

-- New Group Members
INSERT INTO public.group_members (group_id, user_id) VALUES
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana no Iniciantes
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Bruno no Iniciantes
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4'), -- Diana no Iniciantes
('n0n0n0n0-n0n0-n0n0-n0n0-n0n0n0n0n0n0', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'), -- Carlos na Teoria Musical
('n0n0n0n0-n0n0-n0n0-n0n0-n0n0n0n0n0n0', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana na Teoria Musical
('o1o1o1o1-o1o1-o1o1-o1o1-o1o1o1o1o1o1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Ana no Repertório Cristão
('o1o1o1o1-o1o1-o1o1-o1o1-o1o1o1o1o1o1', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'); -- Bruno no Repertório Cristão

-- More Messages in existing and new groups
INSERT INTO public.messages (group_id, user_id, content, created_at) VALUES
-- Bate-Papo
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Alguém viu a nova aula do professor Carlos?', '2024-11-20 09:10:00+00'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Sim! Muito boa, especialmente a parte sobre arpejos.', '2024-11-20 09:15:00+00'),
-- Dúvidas
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Professor Carlos, qual a diferença entre sustenido e bemol?', '2024-11-20 10:25:00+00'),
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Boa pergunta, Bruno! Sustenido eleva a nota em meio tom, bemol abaixa. Ex: C# e Db são a mesma nota.', '2024-11-20 10:30:00+00'),
-- Edificação
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Compartilhando um louvor lindo que aprendi hoje: "Grandes Coisas"!', '2024-11-20 11:00:00+00'),
('g7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Amém, Ana! Que benção!', '2024-11-20 11:05:00+00'),
-- Iniciantes
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Oi pessoal! Alguém com dificuldade no acorde de F?', '2024-11-20 13:00:00+00'),
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Ana, o F é um desafio para muitos. Tente usar o polegar para a sexta corda no início, se for mais fácil.', '2024-11-20 13:05:00+00'),
-- Teoria Musical
('n0n0n0n0-n0n0-n0n0-n0n0-n0n0n0n0n0n0', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Hoje vamos discutir sobre o círculo das quintas. Alguma pergunta inicial?', '2024-11-20 14:00:00+00'),
('n0n0n0n0-n0n0-n0n0-n0n0-n0n0n0n0n0n0', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Professor, como ele se aplica na prática para compor?', '2024-11-20 14:05:00+00');