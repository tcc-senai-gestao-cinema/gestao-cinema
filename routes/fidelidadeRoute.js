const express = require('express');
const router = express.Router();
const fidelidadeController = require('../controllers/fidelidadeController');

router.post('/adicionar', fidelidadeController.adicionarPonto);
router.get('/pontos/:id_usuario', fidelidadeController.obterPontos);
router.post('/trocar', fidelidadeController.trocarPontos);

module.exports = router;
