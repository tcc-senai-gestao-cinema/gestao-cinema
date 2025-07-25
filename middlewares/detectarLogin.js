// middlewares/detectarLogin.js
function detectarLoginRecente(req, res, next) {
    // Este middleware pode ser usado em rotas específicas se necessário
    if (req.session && req.session.loginRecente) {
        console.log('🔔 Login recente detectado no middleware');
        // Adicionar lógica adicional aqui se necessário
    }
    next();
}

module.exports = { detectarLoginRecente };