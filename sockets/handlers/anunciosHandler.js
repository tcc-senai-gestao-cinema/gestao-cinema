const Anuncio = require('../../models/Anuncio');
const { Op } = require('sequelize');

module.exports = async (socket) => {
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
    console.error('❌ Erro ao buscar anúncios de carrossel:', error);
  }
};
