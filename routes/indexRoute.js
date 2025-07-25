// Importa todas as rotas necessárias
const staticRoutes = require('./staticRoute');
const filmeRoutes = require('./filmeRoute');
const programacaoRoutes = require('./programacaoRoute');
const loginRoutes = require('./loginRoute');
const perfilRoutes = require('./perfilRoute');
const cadastroRoutes = require('./cadastroRoute');
const fidelidadeRoutes = require('./fidelidadeRoute');
const lojinhaRoutes = require('./lojinhaRoute');
const alteraSenhaRoute = require('./alteraSenhaRoute');
const sessaoRoute = require('./sessaoRoute');

// Exporta função que registra todas as rotas na aplicação principal
module.exports = (app) => {


    // Rotas de API RESTful
    app.use('/api', filmeRoutes);
    app.use('/api', programacaoRoutes);

    // Rotas de autenticação
    app.use('/', loginRoutes);
    app.use('/', perfilRoutes); 
    app.use('/', cadastroRoutes);
    app.use('/', alteraSenhaRoute);
    app.use('/', sessaoRoute);
    app.use('/', staticRoutes);

    // Rotas relacionadas ao sistema de fidelidade
    app.use('/fidelidade', fidelidadeRoutes);

    // Rotas da lojinha
    app.use('/lojinha', lojinhaRoutes);
};
