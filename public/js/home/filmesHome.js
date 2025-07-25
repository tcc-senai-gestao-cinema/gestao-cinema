document.addEventListener('DOMContentLoaded', () => {
  const socket = window.socket;
  if (!socket) return;

  socket.on('filmes', (filmes) => {
    const container = document.getElementById('container-display-filmes');
    container.innerHTML = ''; // limpa os antigos
    filmes.forEach(filme => {
      console.log(filme);
      const card = `
        <div class="col-md-2 col-sm-4 col-6">
          <a href="/programacao?id_filme=${filme.id_filme}" class="card-link">
            <div class="card cartão">
              <img src="${filme.imagem_url}" class="card-img-top" alt="${filme.titulo}">
              <div class="card-body text-center">
                <h5 class="card-title">${filme.titulo}</h5>
              </div>
            </div>
          </a>
        </div>
      `;
      container.innerHTML += card;
    });
  });
});
