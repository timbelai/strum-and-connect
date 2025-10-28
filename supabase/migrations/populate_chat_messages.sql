-- Este script insere mensagens fictícias na tabela 'messages'.
-- ATENÇÃO: Substitua [USER_ID_ALUNO] e [GROUP_ID_1] pelos IDs reais do seu banco de dados.

-- Exemplo de IDs que você deve substituir:
-- USER_ID_ALUNO: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
-- GROUP_ID_1: '00000000-0000-0000-0000-000000000001'

-- Inserir mensagens no Grupo 1
INSERT INTO public.messages (group_id, user_id, content, created_at)
VALUES
(
    '[GROUP_ID_1]',
    '[USER_ID_ALUNO]',
    'Olá a todos! Alguém já começou a estudar o módulo de acordes com pestana?',
    now() - interval '30 minutes'
),
(
    '[GROUP_ID_1]',
    '[USER_ID_ALUNO]',
    'Estou com um pouco de dificuldade no Fá maior. Alguma dica?',
    now() - interval '25 minutes'
),
(
    '[GROUP_ID_1]',
    '[USER_ID_PROFESSOR]', -- Assumindo que você tem um professor com este ID
    'Claro! A chave é a posição do polegar e a pressão uniforme. Tente usar um capo na 3ª casa para praticar a forma antes de ir para a 1ª.',
    now() - interval '20 minutes'
),
(
    '[GROUP_ID_1]',
    '[USER_ID_ALUNO]',
    'Ótima dica, professor! Vou tentar isso agora mesmo.',
    now() - interval '15 minutes'
),
(
    '[GROUP_ID_1]',
    '[USER_ID_ALUNO]',
    'Consegui! A diferença é enorme. Obrigado!',
    now() - interval '10 minutes'
);

-- Se você tiver um segundo grupo, pode adicionar mais mensagens aqui:
-- INSERT INTO public.messages (group_id, user_id, content, created_at)
-- VALUES
-- (
--     '[GROUP_ID_2]',
--     '[USER_ID_ALUNO]',
--     'Mensagem no segundo grupo.',
--     now() - interval '5 minutes'
-- );

COMMIT;