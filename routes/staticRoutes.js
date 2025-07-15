// Importa o Express e o módulo 'path'
const express = require('express');
const path = require('path');

// Cria um novo roteador do Express
const router = express.Router();

// Rotas que servem páginas HTML diretamente do servidor

// Rota principal (Home)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/home/home.html'));
});

// Página de Programação (escolha de filmes)
router.get('/programacao', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/escolhaFilme/escolhaFilme.html'));
});

// Página do sistema de fidelidade
router.get('/fidelidade', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/fidelidade/fidelidade.html'));
});

// Página com explicações sobre pontos e regras
router.get('/pontoERegra', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/pontoERegra/pontoERegra.html'));
});

// Página da lojinha
router.get('/lojinha', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/lojinha/lojinha.html'));
});

// Página da lojinha
router.get('/distribuicaoDoPublico', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/distribuicaoDoPublico/distribuicaoDoPublico.html'));
});

// Exporta o roteador
module.exports = router;
