const filmesHandler = require('./handlers/filmesHandler');
const anunciosHandler = require('./handlers/anunciosHandler');
const mensagemHandler = require('./handlers/mensagemHandler');
const vagasHandler = require('./handlers/vagasHandler'); 
const promocaoHandler = require('./handlers/promocaoHandler'); // novo handler

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('Usuário(a) conectado(a):', socket.id);

    await filmesHandler(socket);
    await anunciosHandler(socket);
    await vagasHandler(io,socket); // socket + io
    await promocaoHandler(socket);
    mensagemHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Usuário(a) desconectado(a):', socket.id);
    });
  });
};
