// Importa todas as rotas necessárias
const staticRoutes = require('./staticRoutes');
const filmeRoutes = require('./filmeRoutes');
const sessaoRoutes = require('./sessaoRoutes');
const loginRoutes = require('./loginRoutes');
const perfilRoutes = require('./perfilRoutes');
const cadastroRoutes = require('./cadastroRoutes');
const fidelidadeRoutes = require('./fidelidadeRoutes');
const lojinhaRoutes = require('./lojinhaRoutes');
const AlteraSenhaRoute = require('./AlteraSenhaRoute');

// Exporta função que registra todas as rotas na aplicação principal
module.exports = (app) => {


    // Rotas de API RESTful
    app.use('/api', filmeRoutes);
    app.use('/api', sessaoRoutes);

    // Rotas de autenticação (login/cadastro/perfil)
    app.use('/', loginRoutes);
    app.use('/', perfilRoutes); 
    app.use('/', cadastroRoutes);
    app.use('/', AlteraSenhaRoute);

    // Rotas relacionadas ao sistema de fidelidade
    app.use('/fidelidade', fidelidadeRoutes);

    // Rotas da lojinha
    app.use('/lojinha', lojinhaRoutes);
    app.use('/', staticRoutes);
};