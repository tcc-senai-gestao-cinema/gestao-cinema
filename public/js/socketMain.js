// public/js/socketMain.js
document.addEventListener('DOMContentLoaded', () => {
  window.socket = io(); // Cria o socket global

  // Função para autenticar o usuário no socket
  function autenticarUsuarioSocket() {
    fetch('/sessao')
      .then(res => res.json())
      .then(data => {
        if (data?.usuario?.id) {
          window.socket.emit('autenticarUsuario', { 
            idUsuario: data.usuario.id,
            loginRecente: data.loginRecente || false
          });
          console.log('Emitido idUsuario via socket:', data.usuario.id);
          
          // Se foi um login recente, limpar a flag
          if (data.loginRecente) {
            fetch('/limpar-login-recente', { method: 'POST' })
              .catch(err => console.error('Erro ao limpar flag de login recente:', err));
          }
        } else {
          console.log('Usuário não autenticado na sessão.');
        }
      })
      .catch(err => {
        console.error('Erro ao buscar sessão:', err);
      });
  }

  // Autentica imediatamente quando a página carrega
  autenticarUsuarioSocket();

  // Escuta por mudanças de autenticação (para quando o usuário faz login)
  window.socket.on('connect', () => {
    console.log('Socket conectado com ID:', window.socket.id);
    // Re-autentica se necessário
    autenticarUsuarioSocket();
  });

  // Evento personalizado para re-autenticação após login
  window.addEventListener('usuarioLogado', () => {
    console.log('Evento de login detectado, re-autenticando socket...');
    setTimeout(autenticarUsuarioSocket, 100); // Pequeno delay para garantir que a sessão foi salva
  });
});