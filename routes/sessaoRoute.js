// routes/sessaoRoute.js
const express = require('express');
const router = express.Router();

// Retorna os dados da sessão atual
router.get('/sessao', (req, res) => {
    if (req.session && req.session.usuario) {
        res.json({
            logado: true,
            usuario: req.session.usuario
        });
    } else {
        res.json({
            logado: false
        });
    }
});

module.exports = router;
