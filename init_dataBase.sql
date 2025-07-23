-- Remove o banco de dados existente com o nome 'sistema_login', se ele já existir.
DROP DATABASE IF EXISTS cinema;

-- Cria o banco de dados 'cinema', caso ele ainda não exista.
-- Utiliza o charset UTF-8 completo (utf8mb4), que suporta emojis e todos os caracteres Unicode,
-- e usa a collation (regras de ordenação/comparação) adequada para Unicode.
CREATE DATABASE IF NOT EXISTS cinema
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Define que todas as próximas instruções SQL serão executadas dentro do banco de dados 'cinema'.
USE cinema;

-- Cria a tabela 'usuarios':
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    data_cadastro DATE,
    nome VARCHAR(255),
    cpf VARCHAR(14) UNIQUE,
    e_mail VARCHAR(255) UNIQUE,
    senha_hash VARCHAR(255),
    telefone VARCHAR(20),
    ativo BOOLEAN,
    ultimo_login DATETIME,
    tipo_acesso ENUM('cliente', 'atendente', 'admin')
);

-- Cria a tabela 'local_de_exibicao' para gerenciar os locais de exibição
CREATE TABLE IF NOT EXISTS locais_de_exibicoes (
    id_local_de_exibicao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),  -- (ex: Nome da sala, coliseu, teatro, explanada)
    capacidade INT,
    tipo ENUM('aberto', 'fechado'),
    formato ENUM('enfileirado', 'personalizado') DEFAULT 'enfileirado', -- Formato geral da disposição do público enfileirado, redondo, meia-lua, quadrado, metade-quadrado, fileiras-laterais |-|
    quantidade_andares INT DEFAULT 1, -- Quantidade de andares / níveis
    quantidade_fileiras INT, -- Fileiras simples
    quantidade_corredores INT DEFAULT 0 -- Corredores gerais
);

-- Cria a tabela 'areas_do_publico' vinculados a cada local de exibição
CREATE TABLE IF NOT EXISTS areas_do_publico (
    id_area_do_publico INT AUTO_INCREMENT PRIMARY KEY,
    id_local_de_exibicao INT,
    nome_area VARCHAR(100), -- (ex: Caideras não reservadas, Área VIP, Open Food, Pista, etc)
    descricao TEXT,
    lotacao INT,
    lotacao_atual INT DEFAULT 0,
    status ENUM('disponível', 'lotado', 'em andamento') DEFAULT 'disponível',
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicoes(id_local_de_exibicao)
);

-- Cria a tabela 'vagas' vinculados a cada local de exibição
CREATE TABLE IF NOT EXISTS vagas (
    id_vaga INT AUTO_INCREMENT PRIMARY KEY,
    id_local_de_exibicao INT,
    nome VARCHAR(50),  -- (Ex: A1, B2, Vaga 12)
    categoria ENUM('assento', 'drive_in') NOT NULL,  -- Define o tipo geral
    tipo ENUM(
        'normal', 'casal', 'acessivel', 'preferencial',  -- Para assentos
        'veiculo_pequeno', 'veiculo_medio', 'veiculo_grande' -- Para drive-in
    ) NOT NULL,
    status ENUM('disponível', 'reservado', 'ocupado') DEFAULT 'disponível',
    reserva_data DATETIME,
    pos_x INT,
    pos_y INT,
    andar INT DEFAULT 1,
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicoes(id_local_de_exibicao),
    UNIQUE (id_local_de_exibicao, nome)
);

-- Cria a tabela 'filmes' contendo informações dos filmes em cartaz
CREATE TABLE IF NOT EXISTS filmes (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    genero VARCHAR(100),
    duracao INT,
    classificacao_indicativa VARCHAR(50),
    sinopse TEXT,
    imagem_url VARCHAR(255),
    tipo ENUM('2D', '3D')
);

-- Cria a tabela 'programacoes' que serão disponíveis para exibição dos filmes
CREATE TABLE IF NOT EXISTS programacoes (
    id_programacao INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT,
    id_local_de_exibicao INT,
    data DATE,
    horario TIME,
    titulo_personalizado VARCHAR(255),
    FOREIGN KEY (id_filme) REFERENCES filmes(id_filme),
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicoes(id_local_de_exibicao)
);

-- Cria a tabela 'ingressos' para vendidos ou reservados
CREATE TABLE IF NOT EXISTS ingressos (
    id_ingresso INT AUTO_INCREMENT PRIMARY KEY,
    id_programacao INT,
    id_vaga INT,
    preco DECIMAL(10, 2),
    status ENUM('comprado', 'reservado', 'cancelado'),
    FOREIGN KEY (id_programacao) REFERENCES programacoes(id_programacao),
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga)
);

-- Cria a tabela 'reservas' para compras online
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    data_reserva DATETIME,
    horario_reserva TIME,
    validade_reserva DATETIME,
    status ENUM('reservado', 'confirmado', 'cancelado'),
    origem ENUM('presencial', 'online', 'app', 'totem', 'externo'),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Cria a tabela 'produtos_diversos' para qualquer item vendido no cinema fora os ingressos
CREATE TABLE IF NOT EXISTS produtos_diversos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    categoria VARCHAR(100),
    preco DECIMAL(10, 2),
    descricao TEXT,
    imagem_url VARCHAR(255),
    estoque INT,
    estoque_minimo INT
);

-- Cria a tabela 'programas_fidelidade' para assinaturas de clientes
CREATE TABLE IF NOT EXISTS programas_fidelidade (
    id_programa_fidelidade INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    regra VARCHAR(1000),
    pontos INT,
    data_inicio DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Cria a tabela 'promocoes'
CREATE TABLE IF NOT EXISTS promocoes (
    id_promocao INT AUTO_INCREMENT PRIMARY KEY,
    id_programa_fidelidade INT,
    nome VARCHAR(255),
    descricao TEXT,
    desconto_percentual DECIMAL(5, 2),
    data_inicio DATE,
    data_fim DATE,
    tipo ENUM('comum', 'programa_fidelidade'),
    imagem_url VARCHAR(255),
    FOREIGN KEY (id_programa_fidelidade) REFERENCES programas_fidelidade(id_programa_fidelidade),
    CHECK (data_inicio <= data_fim)
);

-- Cria a tabela 'vendas' para registro de ingressos ou produtos
CREATE TABLE IF NOT EXISTS vendas (
    id_venda INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_promocao INT,
    data_venda DATETIME,
    preco_total DECIMAL(10,2),
    forma_pagamento VARCHAR(50),
    origem ENUM('presencial', 'online'),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_promocao) REFERENCES promocoes(id_promocao)
);

-- Cria a tabela 'historicos_vendas'
CREATE TABLE IF NOT EXISTS historicos_vendas (
    id_historico_venda INT AUTO_INCREMENT PRIMARY KEY,
    id_venda INT,
    data_historico DATETIME,
    preco_total DECIMAL(10,2),
    status_venda ENUM('realizada', 'cancelada'),
    FOREIGN KEY (id_venda) REFERENCES vendas(id_venda)
);

-- Cria a tabela 'itens' de venda
CREATE TABLE IF NOT EXISTS itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_venda INT, 
    id_ingresso INT,
    id_produto INT,
    tipo ENUM('ingresso', 'produto'),
    quantidade INT,
    preco_unitario DECIMAL(10,2),
    FOREIGN KEY (id_venda) REFERENCES vendas(id_venda), -- Ligação com a venda
    FOREIGN KEY (id_ingresso) REFERENCES ingressos(id_ingresso),
    FOREIGN KEY (id_produto) REFERENCES produtos_diversos(id_produto)
);

-- Cria a tabela 'avaliacoes' feitas por usuários
CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    tipo ENUM('preço', 'conteudo_exibido', 'ambiente', 'produto', 'atendimento', 'limpeza', 'estrutura', 'sistema'),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Cria a tabela 'anuncios' dentro do sistema
CREATE TABLE IF NOT EXISTS anuncios (
    id_anuncio INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    imagem_url VARCHAR(255),
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN,
    tipo ENUM('banner', 'destaque', 'notícia', 'carrossel'),
    link_destino VARCHAR(255),
    prioridade INT,
    CHECK (data_inicio <= data_fim)
);

-- Relação N:N entre reservas e vagas
CREATE TABLE IF NOT EXISTS reserva_vaga (
    id_reserva INT,
    id_vaga INT,
    PRIMARY KEY (id_reserva, id_vaga),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga)
);

-- Relação N:N entre programas de fidelidade e promoções
CREATE TABLE IF NOT EXISTS programa_fidelidade_promocao (
    id_programa_fidelidade INT,
    id_promocao INT,
    PRIMARY KEY (id_programa_fidelidade, id_promocao),
    FOREIGN KEY (id_programa_fidelidade) REFERENCES programas_fidelidade(id_programa_fidelidade),
    FOREIGN KEY (id_promocao) REFERENCES promocoes(id_promocao)
);

-- Relação N:N entre anúncios e filmes
CREATE TABLE IF NOT EXISTS anuncio_filme (
    id_anuncio INT,
    id_filme INT,
    PRIMARY KEY (id_anuncio, id_filme),
    FOREIGN KEY (id_anuncio) REFERENCES anuncios(id_anuncio),
    FOREIGN KEY (id_filme) REFERENCES filmes(id_filme)
);

-- (Opcional) Remove o usuário do MySQL chamado 'admin' que se conecta localmente, se ele já existir (isso evita erros ao tentar criar um usuário que já existe).
DROP USER IF EXISTS 'admin'@'localhost';

-- Cria o usuário do MySQL chamado 'admin' que se conecta a partir do localhost, com a senha '1234567' (esse usuário será usado pela aplicação Node.js para se conectar ao banco de dados).
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY '1234567';

-- Conceder ao usuário 'admin' acesso completo (todos os privilégios) apenas no banco de dados 'sistema_login' (isso permite que o usuário possa criar, ler, atualizar e deletar dados dentro desse banco específico).
GRANT ALL PRIVILEGES ON cinema.* TO 'admin'@'localhost';

-- Aplica imediatamente todas as mudanças de permissões feitas com o comando GRANT.
FLUSH PRIVILEGES;

INSERT INTO filmes (titulo, genero, duracao, classificacao_indicativa, sinopse, imagem_url) VALUES
('Vingadores: Ultimato', 'Ação', 181, '14 anos', 'Após os eventos devastadores de Guerra Infinita, os Vingadores tentam desfazer o caos causado por Thanos.', 'http://localhost:3000/img/home/teste2.jpg'),
('Divertida Mente 2', 'Animação', 100, 'Livre', 'Riley agora adolescente enfrenta novas emoções e desafios em sua mente em constante evolução.', 'http://localhost:3000/img/home/teste1.jpg'),
('Vingadores: Ultimato', 'Ação', 181, '14 anos', 'Após os eventos devastadores de Guerra Infinita, os Vingadores tentam desfazer o caos causado por Thanos.', 'http://localhost:3000/img/home/teste2.jpg'),
('Divertida Mente 2', 'Animação', 100, 'Livre', 'Riley agora adolescente enfrenta novas emoções e desafios em sua mente em constante evolução.', 'http://localhost:3000/img/home/teste1.jpg');

INSERT INTO locais_de_exibicoes (nome, capacidade, tipo) VALUES
('Sala Coliseu', 200, 'fechado'),
('Sala Auditório', 300, 'aberto');

-- Criar assentos para cada sala
INSERT INTO vagas (id_local_de_exibicao, tipo, status) 
VALUES (1, 'normal', 'ocupado');

-- Exemplo para id_filme = 1, id_local_de_exibicao = 1 e 2
INSERT INTO programacoes (id_filme, id_local_de_exibicao, data, horario) VALUES
(1, 1, '2025-07-20', '19:00'),
(2, 2, '2025-07-21', '21:30');

-- PRODUTOS
INSERT INTO produtos_diversos (nome, categoria, preco, descricao, imagem_url, estoque, estoque_minimo) VALUES
('Pipoca Grande', 'Alimentos', 15.00, 'Pipoca salgada feita na hora.', 'http://localhost:3000/img/home/image6.png', 100, 10),
('Refrigerante 500ml', 'Bebidas', 8.00, 'Coca-Cola, Guaraná ou Fanta.', 'http://localhost:3000/img/home/image6.png', 200, 20),
('Combo Casal', 'Combo', 40.00, '2 Pipocas Médias + 2 Refrigerantes 500ml.', 'http://localhost:3000/img/home/image6.png', 50, 5);

-- ANÚNCIOS
INSERT INTO anuncios (titulo, descricao, imagem_url, data_inicio, data_fim, ativo, tipo, link_destino, prioridade) VALUES
('Imagem 1', 'Descrição da imagem 1', 'http://localhost:3000/img/home/image6.png', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=1', 1),
('Imagem 2', 'Descrição da imagem 3', 'http://localhost:3000/img/home/teste2.jpg', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=1', 3),
('Imagem 3', 'Descrição da imagem 4', 'http://localhost:3000/img/home/teste3.jpg', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=2', 2);

INSERT INTO promocoes 
(id_programa_fidelidade, nome, descricao, desconto_percentual, data_inicio, data_fim, tipo, imagem_url) 
VALUES 
(NULL, 'Combo Casal Perfeito', '1 Pipoca Grande Salgada + 2 Refrigerantes de 500ml por um preço imperdível. Válido para qualquer sessão!', NULL, '2025-07-01', '2025-08-31', 'comum', 'http://localhost:3000/img/home/teste.jpg'),
(NULL, 'Quarta-Feira com 50% OFF', 'Toda quarta, seu segundo ingresso para a mesma sessão sai pela metade do preço. Chame um amigo!', 50.00, '2025-07-01', '2025-12-31', 'comum', 'http://localhost:3000/img/home/teste1.jpg'),
(NULL, 'Combo Casal Perfeito', '1 Pipoca Grande Salgada + 2 Refrigerantes de 500ml por um preço imperdível. Válido para qualquer sessão!', NULL, '2025-07-01', '2025-08-31', 'comum', 'http://localhost:3000/img/home/teste2.jpg'),
(NULL, 'Quarta-Feira com 80% OFF', 'Toda quarta, seu segundo ingresso para a mesma sessão sai pela metade do preço. Chame um amigo!', 80.00, '2025-07-01', '2025-12-31', 'comum', 'http://localhost:3000/img/home/Mega2.0.svg');

INSERT INTO vagas (id_local_de_exibicao, nome, categoria, tipo, status, pos_x, pos_y)
VALUES
(1, 'A1', 'assento', 'normal', 'disponível', 1, 1),
(1, 'A2', 'assento', 'normal', 'disponível', 2, 1),
(1, 'A3', 'assento', 'normal', 'disponível', 3, 1),
(1, 'B1', 'assento', 'normal', 'disponível', 1, 2),
(1, 'B2', 'assento', 'normal', 'disponível', 2, 2),
(1, 'B3', 'assento', 'normal', 'disponível', 3, 2);
