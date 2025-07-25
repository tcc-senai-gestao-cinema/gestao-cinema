// sockets/indexSocket.js
const filmesHandler = require('./handlers/filmesHandler');
const anunciosHandler = require('./handlers/anunciosHandler');
const mensagemHandler = require('./handlers/mensagemHandler');
const vagasHandler = require('./handlers/vagasHandler'); 
const promocaoHandler = require('./handlers/promocaoHandler');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Identificador padrão
    socket.identificador = `anonimo:${socket.id}`;
    socket.idUsuarioAutenticado = null;
    console.log('Usuário conectado com socket.id:', socket.identificador);

    socket.on('autenticarUsuario', ({ idUsuario, loginRecente }) => {
      const identificadorAnterior = socket.identificador;
      
      socket.identificador = `usuario:${idUsuario}`;
      socket.idUsuarioAutenticado = idUsuario;
      
      console.log(`🔄 Usuário autenticado: ${identificadorAnterior} → ${socket.identificador}`);
      
      if (loginRecente) {
        console.log('✅ Login recente detectado - usuário acabou de fazer login');
        
        // Re-enviar dados atualizados após o login
        filmesHandler(socket);
        anunciosHandler(socket);
        promocaoHandler(socket);
      }
    });

    // Enviar dados iniciais para usuários anônimos
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
