const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/controllersPerfil');
const { showEditarPerfilForm, editarPerfil } = require('../controllers/controllerEditar');
const { verificarLogin } = require('../middlewares/verificarLogin');

// Perfil não precisa proteger se quiser que todo mundo veja
router.get('/perfil', perfilController.showPerfil);

// Protegido: só quem está logado pode acessar
router.get('/editarPerfil', verificarLogin, showEditarPerfilForm);
router.post('/editarPerfil', verificarLogin, editarPerfil);

module.exports = router;
