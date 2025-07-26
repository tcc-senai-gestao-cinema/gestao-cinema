// routes/staticRoutes.js
// routes/indexRoute.js - Atualização para incluir rota de vagas
const staticRoutes = require('./staticRoute');
const filmeRoutes = require('./filmeRoute');
const programacaoRoutes = require('./programacaoRoute');
const vagasRoutes = require('./vagasRoute'); // Nova rota
const loginRoutes = require('./loginRoute');
const perfilRoutes = require('./perfilRoute');
const cadastroRoutes = require('./cadastroRoute');
const fidelidadeRoutes = require('./fidelidadeRoute');
const lojinhaRoutes = require('./lojinhaRoute');
const alteraSenhaRoute = require('./alteraSenhaRoute');
const sessaoRoute = require('./sessaoRoute');

// Exporta função que registra todas as rotas na aplicação principal
module.exports = (app) => {
    // Rotas de API RESTful
    app.use('/api', filmeRoutes);
    app.use('/api', programacaoRoutes);
    app.use('/api/vagas', vagasRoutes); // Nova rota para vagas

    // Rotas de autenticação
    app.use('/', loginRoutes);
    app.use('/', perfilRoutes); 
    app.use('/', cadastroRoutes);
    app.use('/', alteraSenhaRoute);
    app.use('/', sessaoRoute);
    app.use('/', staticRoutes);

    // Rotas relacionadas ao sistema de fidelidade
    app.use('/fidelidade', fidelidadeRoutes);

    // Rotas da lojinha
    app.use('/lojinha', lojinhaRoutes);
};// Importa o Express e o módulo 'path'
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
    res.sendFile(path.join(__dirname, '../pages/programacao/programacao.html'));
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

// Página de distribuição do público/seleção de assentos
// Pode receber parâmetros como: /distribuicao-do-publico?programacao_id=1&local_id=1
router.get('/distribuicao-do-publico', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/distribuicaoDoPublico/distribuicaoDoPublico.html'));
});

// Rota de logout
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
