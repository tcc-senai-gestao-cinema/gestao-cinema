const http = require('http'); // Necessário para integrar com socket.io
const express = require('express'); // Framework para criar o servidor web
const app = express(); // Cria uma instância da aplicação Express
const server = http.createServer(app); // Usa http.createServer
const PORT = 3000; // Define a porta que o site opera
const path = require('path'); // Fornece utilitários para trabalhar com caminhos de arquivos e diretórios de forma

// Servir arquivos estáticos da pasta public (exemplo: http://localhost:port/img/logo.png)
app.use(express.static('public'));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal que serve o arquivo 'home.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'pages','home', 'home.html'));
});

server.listen(PORT, () => {
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

// Ainda vão ser instaladas
//npm install socket.io
//npm install moment
