const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/controllersUsuario');


router.get('/cadastro', cadastroController.showCadastroForm);

router.post('/cadastro', cadastroController.cadastro);

module.exports = router;
