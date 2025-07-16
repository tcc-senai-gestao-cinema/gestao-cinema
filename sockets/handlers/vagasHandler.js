const Vaga = require('../../models/Vaga');

module.exports = async (io, socket) => {
  // Cliente pede as vagas de uma sala específica
  socket.on('solicitarVagas', async (idLocal) => {
    try {
      const vagas = await Vaga.findAll({ where: { id_local_de_exibicao: idLocal } });
      socket.emit('vagasAtuais', vagas);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  });

  // Cliente tenta reservar uma vaga (assento)
  socket.on('selecionarVaga', async ({ idVaga }) => {
    try {
      await Vaga.update(
        { status: 'reservado', reserva_data: new Date() },
        { where: { id_vaga: idVaga, status: 'disponível' } }
      );
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      io.emit('vagaAtualizada', vagaAtualizada);
    } catch (error) {
      console.error('Erro ao reservar vaga:', error);
    }
  });

  // Cliente confirma a vaga (ex: após pagamento)
  socket.on('confirmarVaga', async ({ idVaga }) => {
    try {
      await Vaga.update(
        { status: 'ocupado' },
        { where: { id_vaga: idVaga } }
      );
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      io.emit('vagaAtualizada', vagaAtualizada);
    } catch (error) {
      console.error('Erro ao confirmar vaga:', error);
    }
  });

  // Cliente cancela a vaga (ex: desistência)
  socket.on('cancelarVaga', async ({ idVaga }) => {
    try {
      await Vaga.update(
        { status: 'disponível', reserva_data: null },
        { where: { id_vaga: idVaga } }
      );
      const vagaAtualizada = await Vaga.findByPk(idVaga);
      io.emit('vagaAtualizada', vagaAtualizada);
    } catch (error) {
      console.error('Erro ao cancelar vaga:', error);
    }
  });
};
