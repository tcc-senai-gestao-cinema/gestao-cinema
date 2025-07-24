const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/usuarioController');


router.get('/cadastro', cadastroController.showCadastroForm);

router.post('/cadastro', cadastroController.cadastro);

module.exports = router;
