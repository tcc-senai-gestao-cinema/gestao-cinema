const Filme = require('../../models/Filme');

module.exports = async (socket) => {
  try {
    const filmes = await Filme.findAll();
    socket.emit('filmes', filmes);

    // Loga quem solicitou os filmes (anônimo ou usuário autenticado)
    console.log(`📽️ Lista de filmes enviada para: ${socket.identificador}`);
  } catch (error) {
    console.error(`❌ Erro ao buscar filmes para ${socket.identificador}:`, error);
  }
};
