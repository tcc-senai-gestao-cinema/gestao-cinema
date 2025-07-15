// Importações principais
const http = require('http'); // Módulo nativo para criar servidor HTTP
const express = require('express'); // Framework para criar o servidor web
const { Server } = require('socket.io'); // Biblioteca para comunicação em tempo real com WebSockets

const app = express(); // Cria uma instância da aplicação Express
const server = http.createServer(app); // Cria o servidor HTTP usando Express
const io = new Server(server); // Conecta o socket.io ao servidor HTTP

const PORT = 3000; // Define a porta que o site irá operar

// ================= MIDDLEWARES =================

// Middlewares globais para o Express (como body parser e arquivos estáticos)
require('./middlewares/indexMiddlewares')(app);

// ================= ROTAS =======================

// Importa e registra todas as rotas disponíveis (HTML + API REST)
require('./routes/indexRoutes')(app);

// ================= SOCKET.IO ===================

// Carrega e inicializa o socket principal da aplicação (eventos em tempo real)
const mainSocket = require('./sockets/mainSocket');
mainSocket(io);

// ================= SERVIDOR ====================

// Inicializa o servidor e escuta na porta definida
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servidor acessível na rede local: http://<seu-ip-local>:${PORT}`);
});

/* ============================ INFORMAÇÕES ÚTEIS ============================
Para clonar no GIT:
> git clone <https://github.com/tcc-senai-gestao-cinema/gestao-cinema.git>

Dependências utilizadas no projeto:
Instalados:
- express          # Framework para servidor Web
- sequelize        # ORM para banco de dados
- mysql2           # Driver para conectar com MySQL
- socket.io        # Comunicação em tempo real com WebSockets
Serão instalados:
- moment           # Manipulação de datas

Comandos para instalar as dependências do zero:
> npm init -y
> npm install express sequelize mysql2 socket.io moment

Comando para instalar todas as dependências  de uma vez:
> npm install

======================================================================== */
