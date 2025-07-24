const express = require('express');
const router = express.Router();
const programacaoController = require('../controllers/programacaoController.js');

router.get('/programacoes/:id', programacaoController.getProgramacoesPorExibicao);

module.exports = router;
