const express = require('express');
const router = express.Router();
const alteraSenhaController = require('../controllers/alteraSenhaController');
const { verificarLogin } = require('../middlewares/verificarLogin');

// Rota para MOSTRAR o formulário de alteração de senha
router.get('/perfil/altera-senha', verificarLogin, alteraSenhaController.showChangePasswordForm);

// Rota para PROCESSAR o formulário de alteração de senha
router.post('/perfil/altera-senha', verificarLogin, alteraSenhaController.changePassword);

module.exports = router;