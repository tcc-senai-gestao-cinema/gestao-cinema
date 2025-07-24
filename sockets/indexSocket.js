// indexSocket.js
const filmesHandler = require('./handlers/filmesHandler');
const anunciosHandler = require('./handlers/anunciosHandler');
const mensagemHandler = require('./handlers/mensagemHandler');
const vagasHandler = require('./handlers/vagasHandler'); 
const promocaoHandler = require('./handlers/promocaoHandler');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Identificador padrão
    socket.identificador = socket.id;
    console.log('Usuário conectado com socket.id:', socket.identificador);

    socket.on('autenticarUsuario', ({ idUsuario }) => {
      socket.identificador = `usuario:${idUsuario}`;
      console.log('Usuário autenticado com ID do banco:', socket.identificador);
    });

    filmesHandler(socket);
    anunciosHandler(socket);
    vagasHandler(io, socket);
    promocaoHandler(socket);
    mensagemHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Desconectado:', socket.identificador);
    });
  });
};
