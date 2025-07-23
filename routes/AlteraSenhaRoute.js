const express = require('express');
const router = express.Router();
const controllersAlteraSenha = require('../controllers/controllersAlteraSenha');
const { verificarLogin } = require('../middlewares/verificarLogin');

// Rota para MOSTRAR o formulário de alteração de senha
router.get('/perfil/altera-senha', verificarLogin, controllersAlteraSenha.showChangePasswordForm);

// Rota para PROCESSAR o formulário de alteração de senha
router.post('/perfil/altera-senha', verificarLogin, controllersAlteraSenha.changePassword);

module.exports = router;