// routes/sessaoRoute.js
const express = require('express');
const router = express.Router();

// Retorna os dados da sessão atual
router.get('/sessao', (req, res) => {
    if (req.session && req.session.usuario) {
        res.json({
            logado: true,
            usuario: req.session.usuario,
            loginRecente: req.session.loginRecente || false
        });
    } else {
        res.json({
            logado: false
        });
    }
});

// Nova rota para limpar a flag de login recente
router.post('/limpar-login-recente', (req, res) => {
    if (req.session) {
        req.session.loginRecente = false;
    }
    res.json({ success: true });
});

module.exports = router;
