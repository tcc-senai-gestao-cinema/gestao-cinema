const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { verificarLogin } = require('../middlewares/verificarLogin');

// Em seu arquivo de rotas
router.get('/perfil', verificarLogin, perfilController.showProfile);
router.get('/perfil/editar', verificarLogin, perfilController.showEditForm);

// NOVA ROTA: Para PROCESSAR o formulário de edição
router.post('/perfil/editar', verificarLogin, perfilController.updateProfile);



module.exports = router;
