const http = require('http'); 
const express = require('express'); // Framework para criar o servidor web
const { Server } = require('socket.io');
const path = require('path'); // Fornece utilitários para trabalhar com caminhos de arquivos e diretórios de forma

const app = express(); // Cria uma instância da aplicação Express
const server = http.createServer(app); // Usa http.createServer
const io = new Server(server); // conecta o socket.io ao servidor http

const PORT = 3000; // Define a porta que o site opera

// Habilitar o parser de JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'public' (exemplo: http://localhost:port/img/logo.png)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));  // HTMLs

// Rota principal que serve o arquivo 'home.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'pages','home', 'home.html'));
});

app.get('/escolha-filme', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'escolhaFilme', 'escolhaFilme.html'));
});

const filmeRoutes = require('./routes/filmeRoutes'); 
app.use('/api', filmeRoutes);

const sessaoRoutes = require('./routes/sessaoRoutes');
app.use('/api', sessaoRoutes);

const mainSocket = require('./sockets/mainSocket');
mainSocket(io);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servidor acessível na rede: http://<seu-ip-local>:${PORT}`);
});

/* No console dentro da página do projeto */
// Para clones do GitHub (as dependências são baixadas automaticamente)
//npm install

// Dependências instaladas
//npm init -y
//npm install express
//npm install sequelize
//npm install mysql2
//npm install socket.io

// Ainda vão ser instaladas
//npm install moment
