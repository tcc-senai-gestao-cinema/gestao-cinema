// Importa o framework Express e o módulo 'path' para manipulação de caminhos
const express = require('express');
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
};
