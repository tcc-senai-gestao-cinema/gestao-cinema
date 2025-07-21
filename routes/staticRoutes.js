// Importa o Express e o módulo 'path'
const express = require('express');
const path = require('path');
const { verificarLogin } = require('../middlewares/verificarLogin');

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
router.get('/ponto-e-regra', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/pontoERegra/pontoERegra.html'));
});

// Página da lojinha
router.get('/lojinha', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/lojinha/lojinha.html'));
});

// Página da lojinha
router.get('/distribuicao-do-publico', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/distribuicaoDoPublico/distribuicaoDoPublico.html'));
});

// Página de editar perfil do usuário
router.get('/perfil', verificarLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/perfil/perfil.html'));
});

// Página de editar perfil do usuário
router.get('/editar-perfil', verificarLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/perfil/editarPerfil.html'));
});

// routes/indexRoutes.js
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/perfil');
        }
        res.redirect('/login');
    });
});

// Exporta o roteador
module.exports = router;
