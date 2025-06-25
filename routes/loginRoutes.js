const express = require('express');
const router = express.Router();
const loginController = require('../controllers/controllersLogin');

router.get('/login', loginController.showLoginForm);

router.post('/login', loginController.login);

module.exports = router;