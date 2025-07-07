
const express = require('express');
const router = express.Router();

const lojinhaController = require('../controllers/controllersLojinha');


router.get('/produtos', lojinhaController.listarProdutos);

// Rota para processar a compra (continua igual)
router.post('/comprar', lojinhaController.realizarCompra);
// ...
module.exports = router;
