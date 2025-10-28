-- Este script insere mensagens fictícias na tabela 'messages' usando IDs de grupo fixos.
-- ATENÇÃO: Substitua [USER_ID_ALUNO] e [USER_ID_PROFESSOR] pelos IDs reais dos perfis de Aluno e Professor no seu banco de dados.

-- IDs de Grupo fixos (assumindo que foram criados em migrações anteriores):
-- Grupo Iniciante: '00000000-0000-0000-0000-000000000001'
-- Grupo Intermediário: '00000000-0000-0000-0000-000000000002'

-- Substitua estes placeholders pelos IDs reais dos seus perfis:
-- Exemplo:
-- [USER_ID_ALUNO]: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
-- [USER_ID_PROFESSOR]: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876'

-- Inserir mensagens no Grupo Iniciante
INSERT INTO public.messages (group_id, user_id, content, created_at)
VALUES
(
    '00000000-0000-0000-0000-000000000001', -- Grupo Iniciante
    '[USER_ID_ALUNO]',
    'Olá! Sou novo por aqui. Qual é o primeiro exercício que devo focar?',
    now() - interval '40 minutes'
),
(
    '00000000-0000-0000-0000-000000000001', -- Grupo Iniciante
    '[USER_ID_PROFESSOR]',
    'Bem-vindo! Comece com os exercícios de troca de acordes G, C e D. A consistência é a chave!',
    now() - interval '35 minutes'
),
(
    '00000000-0000-0000-0000-000000000001', -- Grupo Iniciante
    '[USER_ID_ALUNO]',
    'Perfeito, vou começar agora. Obrigado!',
    now() - interval '30 minutes'
);

-- Inserir mensagens no Grupo Intermediário
INSERT INTO public.messages (group_id, user_id, content, created_at)
VALUES
(
    '00000000-0000-0000-0000-000000000002', -- Grupo Intermediário
    '[USER_ID_ALUNO]',
    'Alguém tem uma boa tablatura para "Oceans" (Hillsong)? Estou tentando tocar o solo.',
    now() - interval '20 minutes'
),
(
    '00000000-0000-0000-0000-000000000002', -- Grupo Intermediário
    '[USER_ID_PROFESSOR]',
    'Recomendo focar na dinâmica e no uso do pedal de volume para o solo. A tablatura está na seção de recursos avançados.',
    now() - interval '15 minutes'
);

COMMIT;