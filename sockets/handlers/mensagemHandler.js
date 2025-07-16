module.exports = (io, socket) => {
  socket.on('mensagem', (dados) => {
    io.emit('mensagem', dados);
  });
};
