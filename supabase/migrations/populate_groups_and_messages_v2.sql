-- Este script insere dois grupos e algumas mensagens de exemplo.
-- ATENÇÃO: Substitua [ID_DO_ALUNO] e [ID_DO_PROFESSOR] pelos IDs reais dos usuários.

-- 1. Inserir Grupos (se ainda não existirem)
INSERT INTO public.groups (id, nome, descricao)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Bate Papo Geral', 'Espaço para conversas informais e interação da comunidade.'),
    ('00000000-0000-0000-0000-000000000002', 'Tira Dúvidas', 'Canal dedicado a perguntas e respostas sobre as aulas e exercícios.')
ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, descricao = EXCLUDED.descricao;

-- Variáveis para os IDs dos grupos
DO $$
DECLARE
    chat_group_id uuid := '00000000-0000-0000-0000-000000000001';
    doubt_group_id uuid := '00000000-0000-0000-0000-000000000002';
    aluno_id uuid := '[ID_DO_ALUNO]'; -- SUBSTITUA PELO ID REAL DO ALUNO
    professor_id uuid := '[ID_DO_PROFESSOR]'; -- SUBSTITUA PELO ID REAL DO PROFESSOR
BEGIN

    -- 2. Inserir Membros nos Grupos (garantindo que o aluno e o professor estejam em ambos)
    INSERT INTO public.group_members (group_id, user_id)
    VALUES
        (chat_group_id, aluno_id),
        (chat_group_id, professor_id),
        (doubt_group_id, aluno_id),
        (doubt_group_id, professor_id)
    ON CONFLICT (group_id, user_id) DO NOTHING;

    -- 3. Inserir Mensagens no Grupo 'Bate Papo Geral'
    INSERT INTO public.messages (group_id, user_id, content, created_at)
    VALUES
        (chat_group_id, aluno_id, 'Olá a todos! Animado para começar a semana de estudos.', NOW() - INTERVAL '2 hours'),
        (chat_group_id, professor_id, 'Bem-vindo(a)! Lembrem-se de praticar os acordes novos.', NOW() - INTERVAL '1 hour 50 minutes'),
        (chat_group_id, aluno_id, 'Alguém já tentou tocar a música "Alegria"? Achei o ritmo desafiador.', NOW() - INTERVAL '1 hour 30 minutes');

    -- 4. Inserir Mensagens no Grupo 'Tira Dúvidas'
    INSERT INTO public.messages (group_id, user_id, content, created_at)
    VALUES
        (doubt_group_id, aluno_id, 'Professor, qual a melhor forma de fazer a pestana no Fá maior? Meu dedo dói muito.', NOW() - INTERVAL '45 minutes'),
        (doubt_group_id, professor_id, 'Ótima pergunta! Tente usar a ponta do dedo indicador e pressione mais perto do traste. Vou postar um vídeo sobre isso!', NOW() - INTERVAL '30 minutes'),
        (doubt_group_id, aluno_id, 'Entendi, vou tentar! Obrigado!', NOW() - INTERVAL '15 minutes');

END $$;