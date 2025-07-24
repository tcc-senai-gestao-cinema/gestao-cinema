document.addEventListener('DOMContentLoaded', () => {
  window.socket = io(); // Cria o socket global

  // Puxar o usuário logado da sessão no backend e enviar para o servidor via socket
  fetch('/sessao')
    .then(res => res.json())
    .then(data => {
      if (data?.usuario?.id_usuario) {
        window.socket.emit('autenticarUsuario', { idUsuario: data.usuario.id_usuario });
        console.log('Emitido idUsuario via socket:', data.usuario.id_usuario);
      } else {
        console.log('Usuário não autenticado na sessão.');
      }
    })
    .catch(err => {
      console.error('Erro ao buscar sessão:', err);
    });
});
