module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('mensagem', (dados) => {
      console.log('Mensagem recebida:', dados);
      io.emit('mensagem', dados); // envia para todos os clientes conectados
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
};
