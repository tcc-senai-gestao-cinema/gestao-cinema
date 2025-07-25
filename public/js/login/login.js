document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      console.log('Login sendo processado...');
      
      // Aguarda um pouco e então dispara o evento customizado (isso será executado após o redirecionamento se o login for bem-sucedido)
      setTimeout(() => {
        if (window.socket) {
          window.dispatchEvent(new CustomEvent('usuarioLogado'));
        }
      }, 500);
    });
  }
});
