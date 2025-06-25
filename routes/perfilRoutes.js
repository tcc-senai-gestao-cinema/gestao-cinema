const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/controllersPerfil');

router.get('/perfil', perfilController.showPerfil);

module.exports = router;
