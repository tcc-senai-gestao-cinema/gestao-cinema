// routes/vagasRoutes.js
const express = require('express');
const router = express.Router();
const vagasController = require('../controllers/vagasController');

router.get('/:id_local_de_exibicao', vagasController.getVagasPorLocal);

module.exports = router;
