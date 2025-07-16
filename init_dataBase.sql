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

-- Cria a tabela 'filmes' contendo informações dos filmes em cartaz
CREATE TABLE IF NOT EXISTS filmes (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    genero VARCHAR(100),
    duracao INT,
    classificacao_indicativa VARCHAR(50),
    sinopse TEXT,
    imagem_url VARCHAR(255)
);

-- Cria a tabela 'local_de_exibicao' para gerenciar os locais de exibição
CREATE TABLE IF NOT EXISTS locais_de_exibicao (
    id_local_de_exibicao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    capacidade INT,
    tipo ENUM('2D', '3D', 'VIP (programa_fidelidade)')
);

-- Cria a tabela 'assentos' vinculados a cada local de exibição
CREATE TABLE IF NOT EXISTS assentos (
    id_assento INT AUTO_INCREMENT PRIMARY KEY,
    id_local_de_exibicao INT,
    tipo ENUM('normal', 'vip', 'cadeira de rodas', 'preferencial') NOT NULL,
    status ENUM('disponível', 'reservado', 'ocupado') DEFAULT 'disponível',
    reserva_data DATETIME,
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicao(id_local_de_exibicao),
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
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicao(id_local_de_exibicao)
);


-- Cria a tabela 'sessoes' que serão disponíveis para exibição dos filmes
CREATE TABLE IF NOT EXISTS sessoes (
    id_sessao INT AUTO_INCREMENT PRIMARY KEY,
    id_filme INT,
    id_local_de_exibicao INT,
    data DATE,
    horario TIME,
    FOREIGN KEY (id_filme) REFERENCES filmes(id_filme),
    FOREIGN KEY (id_local_de_exibicao) REFERENCES locais_de_exibicao(id_local_de_exibicao)
);

-- Cria a tabela 'ingressos' para vendidos ou reservados
CREATE TABLE IF NOT EXISTS ingressos (
    id_ingresso INT AUTO_INCREMENT PRIMARY KEY,
    id_sessao INT,
    id_assento INT,
    preco DECIMAL(10, 2),
    status ENUM('comprado', 'reservado', 'cancelado'),
    FOREIGN KEY (id_sessao) REFERENCES sessoes(id_sessao),
    FOREIGN KEY (id_assento) REFERENCES assentos(id_assento)
);

-- Cria a tabela 'reservas' para compras online
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    data_reserva DATETIME,
    horario_reserva TIME,
    validade_reserva DATETIME,
    status ENUM('reservado', 'confirmado', 'cancelado'),
    origem ENUM('online'),
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
    tipo ENUM('preço', 'filme', 'ambiente', 'produto', 'atendimento', 'limpeza', 'sistema'),
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

-- Relação N:N entre reservas e assentos
CREATE TABLE IF NOT EXISTS reserva_assento (
    id_reserva INT,
    id_assento INT,
    PRIMARY KEY (id_reserva, id_assento),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_assento) REFERENCES assentos(id_assento)
);

-- Relação N:N entre programas de fidelidade e promoções
CREATE TABLE IF NOT EXISTS programa_promocao (
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

INSERT INTO filmes (titulo, genero, duracao, classificacao_indicativa, sinopse, imagem_url)
VALUES 
('Vingadores: Ultimato', 'Ação', 181, '14 anos', 'Após os eventos devastadores de Guerra Infinita, os Vingadores tentam desfazer o caos causado por Thanos.', 'http://localhost:3000/img/home/teste2.jpg'),
('Divertida Mente 2', 'Animação', 100, 'Livre', 'Riley agora adolescente enfrenta novas emoções e desafios em sua mente em constante evolução.', 'http://localhost:3000/img/home/teste1.jpg');

INSERT INTO anuncios 
(titulo, descricao, imagem_url, data_inicio, data_fim, ativo, tipo, link_destino, prioridade) 
VALUES
('Imagem 1', 'Descrição da imagem 1', 'http://localhost:3000/img/home/image6.png', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=1', 1),
('Imagem 2', 'Descrição da imagem 3', 'http://localhost:3000/img/home/teste2.jpg', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=1', 3),
('Imagem 3', 'Descrição da imagem 4', 'http://localhost:3000/img/home/teste3.jpg', '2024-01-01', '2025-12-31', true, 'carrossel', 'http://localhost:3000/programacao?id=2', 2);

INSERT INTO sessoes (id_filme, data, horario) VALUES
(1, '2025-06-20', '19:30'),
(1, '2025-06-21', '20:40'),
(2, '2025-07-22', '09:30'),
(2, '2025-05-10', '15:10'),
(2, '2025-06-24', '00:10');

INSERT INTO filmes (titulo, genero, duracao, classificacao_indicativa, sinopse, imagem_url)
VALUES 
('Vingadores: Ultimato', 'Ação', 181, '14 anos', 'Após os eventos devastadores de Guerra Infinita, os Vingadores tentam desfazer o caos causado por Thanos.', 'http://localhost:3000/img/home/teste2.jpg'),
('Divertida Mente 2', 'Animação', 100, 'Livre', 'Riley agora adolescente enfrenta novas emoções e desafios em sua mente em constante evolução.', 'http://localhost:3000/img/home/teste1.jpg'),
('Vingadores: Ultimato', 'Ação', 181, '14 anos', 'Após os eventos devastadores de Guerra Infinita, os Vingadores tentam desfazer o caos causado por Thanos.', 'http://localhost:3000/img/home/teste2.jpg'),
('Divertida Mente 2', 'Animação', 100, 'Livre', 'Riley agora adolescente enfrenta novas emoções e desafios em sua mente em constante evolução.', 'http://localhost:3000/img/home/teste1.jpg');


INSERT INTO produtos_diversos (nome, descricao, preco, imagem_url, estoque) VALUES
('Pipoca Grande', 'Pipoca salgada feita na hora.', 15.00, 'http://localhost:3000/img/home/image6.png', 100),
('Refrigerante 500ml', 'Coca-Cola, Guaraná ou Fanta.', 8.00, 'http://localhost:3000/img/home/image6.png', 200),
('Combo Casal', '2 Pipocas Médias + 2 Refrigerantes 500ml.', 40.00, 'http://localhost:3000/img/home/image6.png', 50);

-- (Opcional) Remove o usuário do MySQL chamado 'admin' que se conecta localmente, se ele já existir (isso evita erros ao tentar criar um usuário que já existe).
-- DROP USER IF EXISTS 'admin'@'localhost';

-- Cria o usuário do MySQL chamado 'admin' que se conecta a partir do localhost, com a senha '1234567' (esse usuário será usado pela aplicação Node.js para se conectar ao banco de dados).
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY '1234567';

-- Conceder ao usuário 'admin' acesso completo (todos os privilégios) apenas no banco de dados 'sistema_login' (isso permite que o usuário possa criar, ler, atualizar e deletar dados dentro desse banco específico).
GRANT ALL PRIVILEGES ON cinema.* TO 'admin'@'localhost';

-- Aplica imediatamente todas as mudanças de permissões feitas com o comando GRANT.
FLUSH PRIVILEGES;
