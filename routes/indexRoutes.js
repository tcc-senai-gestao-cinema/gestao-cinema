// Importa todas as rotas necessárias
const staticRoutes = require('./staticRoutes');
const filmeRoutes = require('./filmeRoutes');
const sessaoRoutes = require('./sessaoRoutes');
const loginRoutes = require('./loginRoutes');
const cadastroRoutes = require('./cadastroRoutes');
const fidelidadeRoutes = require('./fidelidadeRoutes');
const lojinhaRoutes = require('./lojinhaRoutes');

// Exporta função que registra todas as rotas na aplicação principal
module.exports = (app) => {
    // Rotas HTML simples
    app.use('/', staticRoutes);

    // Rotas de API RESTful
    app.use('/api', filmeRoutes);
    app.use('/api', sessaoRoutes);

    // Rotas de autenticação (login/cadastro)
    app.use('/', loginRoutes);
    app.use('/', cadastroRoutes);

    // Rotas relacionadas ao sistema de fidelidade
    app.use('/fidelidade', fidelidadeRoutes);

    // Rotas da lojinha
    app.use('/lojinha', lojinhaRoutes);
};
