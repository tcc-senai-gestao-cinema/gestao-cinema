const express = require('express');
const router = express.Router();
const { showEditarPerfilForm, editarPerfil } = require('../controllers/controllerEditar');

router.get('/editar-perfil', showEditarPerfilForm);

router.post('/editar-perfil', editarPerfil);

module.exports = router;
