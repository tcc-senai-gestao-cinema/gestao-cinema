const Filme = require('../../models/Filme');

module.exports = async (socket) => {
  try {
    const filmes = await Filme.findAll();
    socket.emit('filmes', filmes);
  } catch (error) {
    console.error('❌ Erro ao buscar filmes:', error);
  }
};
