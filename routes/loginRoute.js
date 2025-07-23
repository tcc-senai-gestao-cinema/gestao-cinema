const express = require('express');
const router = express.Router();
const { verificarLogin } = require('../middlewares/verificarLogin');
const loginController = require('../controllers/loginController');
const perfilController = require('../controllers/perfilController');

// rota protegida
router.get('/perfil', verificarLogin, perfilController.showProfile);


// rota pública
router.get('/login', loginController.showLoginForm);
router.post('/login', loginController.login);

module.exports = router;
