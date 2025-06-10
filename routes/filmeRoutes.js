// routes/filmeRoutes.js
const express = require('express');
const router = express.Router();
const filmeController = require('../controllers/controllersFilmes'); // Ajuste o caminho se necessário

// Acessível via GET /api/filmes
router.get('/filmes', filmeController.getAllFilmes);

// Acessível via GET /api/filmes/:id
router.get('/filmes/:id', filmeController.getFilmeById);



module.exports = router; // MUITO IMPORTANTE!