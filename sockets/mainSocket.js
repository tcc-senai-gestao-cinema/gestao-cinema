const Filme = require('../models/Filme.js');
const Anuncio = require('../models/Anuncio.js'); // importa o model de anuncios
const { Op } = require('sequelize'); // Importa operadores

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('Usuário(a) conectado(a):', socket.id);

    // Envia lista de filmes ao conectar
    try {
      const filmes = await Filme.findAll(); // consulta ao banco de dados
      socket.emit('filmes', filmes); // Emite para o container de cards Em cartaz na página home
    } catch (error) {
      console.error('❌ Erro: Falha ao buscar filmes!', error);
    }

    // Envia anúncios do tipo 'carrossel' ao conectar
    try {
      const anuncios = await Anuncio.findAll({
        where: {
          ativo: true,
          tipo: 'carrossel',
        },
        order: [['prioridade', 'DESC']],
      });
      socket.emit('anunciosCarrossel', anuncios);
    } catch (error) {
      console.error('❌ Erro: Falha ao buscar anúncios de carrossel!', error);
    }

    // (ainda sem uso) Ouve mensagens do tipo 'mensagem' enviadas por um cliente específico e retransmite essa mesma mensagem para todos os clientes conectados usando io.emit
    socket.on('mensagem', (dados) => {
      io.emit('mensagem', dados);
    });

    socket.on('disconnect', () => {
      console.log('Usuário(a) desconectado(a):', socket.id);
    });
  });
};
