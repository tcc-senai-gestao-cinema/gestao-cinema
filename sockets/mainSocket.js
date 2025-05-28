module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuário(a) conectado(a):', socket.id);



    socket.on('disconnect', () => {
      console.log('Usuário(a) desconectado(a):', socket.id);
    });
  });
};
