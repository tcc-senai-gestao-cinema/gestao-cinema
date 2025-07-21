// Importa o framework Express e o módulo 'path' para manipulação de caminhos
const express = require('express');
const session = require('express-session');
const path = require('path');

// Exporta uma função que recebe o 'app' principal como argumento
module.exports = (app) => {

    // Middleware para permitir o recebimento de requisições em JSON
    app.use(express.json());

    // Middleware para permitir o recebimento de dados de formulários via URL-encoded
    app.use(express.urlencoded({ extended: true }));

    // Middleware para servir arquivos estáticos da pasta 'public'
    // Exemplo: http://localhost:3000/css/home.css
    app.use(express.static(path.join(__dirname, '../public')));

    // Configuração da sessão
    app.use(session({
        secret: '1234567', // Definindo chave secreta para assinar o cookie da sessão, garante que o usuário (navegador) não altere o conteúdo da sessão, verifica a autenticidade dos cookies recebidos do navegador.
        resave: false,
        saveUninitialized: true,
        cookie: { // em desenvolvimento, sem https
            secure: false,
            maxAge: 30 * 60 * 1000 // expira o armazenamento cookie de usuário logado em 30 minutos
        }
    }));
};
