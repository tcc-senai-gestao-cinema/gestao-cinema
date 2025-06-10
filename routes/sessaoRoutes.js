const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/controllersSessao');

router.get('/sessoes/:id', sessaoController.getSessoesPorFilme);

module.exports = router;
