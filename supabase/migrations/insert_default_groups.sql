-- Insere grupos padrão se eles ainda não existirem.

INSERT INTO public.groups (nome, descricao)
VALUES
    ('Bate-Papo', 'Grupo para conversas gerais e interação social.'),
    ('Dúvidas', 'Espaço para tirar dúvidas sobre aulas e exercícios.'),
    ('Edificação', 'Compartilhamento de mensagens, louvores e estudos bíblicos.'),
    ('Caravanas', 'Organização de encontros e eventos presenciais.')
ON CONFLICT (nome) DO NOTHING; -- Assume que 'nome' é único ou que queremos evitar duplicatas.