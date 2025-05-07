const http = require('http'); // Necessário para integrar com socket.io
const express = require('express'); // Framework para criar o servidor web
const app = express(); // Cria uma instância da aplicação Express
const server = http.createServer(app); // Usa http.createServer
const PORT = 80; // Define a porta que o site opera

const path = require('path'); // Fornece utilitários para trabalhar com caminhos de arquivos e diretórios de forma 

// Servir arquivos estáticos da pasta 'home'
app.use(express.static(path.join(__dirname, 'home')));

// Rota principal que serve o arquivo 'index.html' dentro da pasta 'home'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servidor acessível na rede: http://<seu-ip-local>:${PORT}`);
});

//npm install moment
//npm install socket.io
