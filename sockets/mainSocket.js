const Filme = require('../models/Filme.js');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('Usuário(a) conectado(a):', socket.id);

    // Envia lista de filmes ao conectar
    try {
      const filmes = await Filme.findAll(); // consulta ao banco de dados
      socket.emit('filmes', filmes);
    } catch (error) {
      console.error('❌ Erro: Falha ao buscar filmes!', error);
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
