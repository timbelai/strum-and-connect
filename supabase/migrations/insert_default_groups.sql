-- Insere os grupos padrão se eles não existirem
INSERT INTO public.groups (nome, descricao)
VALUES
    ('Bate-Papo', 'Grupo para bate-papo geral e interação social.'),
    ('Dúvidas', 'Espaço para tirar dúvidas sobre aulas e exercícios.'),
    ('Edificação', 'Compartilhamento de mensagens, louvores e edificação espiritual.'),
    ('Caravanas', 'Organização de encontros e eventos presenciais.')
ON CONFLICT (nome) DO NOTHING;