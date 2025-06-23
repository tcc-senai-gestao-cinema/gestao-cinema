document.addEventListener('DOMContentLoaded', () => {
  const socket = window.socket;

  socket.on('anunciosCarrossel', (anuncios) => {
    const inner = document.querySelector('.carousel-inner');
    const indicators = document.querySelector('.carousel-indicators');

    inner.innerHTML = '';
    indicators.innerHTML = '';

    anuncios.forEach((anuncio, index) => {
      // Indicadores (bolinhas)
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-bs-target', '#carouselHome');
      button.setAttribute('data-bs-slide-to', index);
      button.setAttribute('aria-label', `Slide ${index + 1}`);
      if (index === 0) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'true');
      }
      indicators.appendChild(button);

      // Item do carrossel
      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (index === 0) item.classList.add('active');

      const img = document.createElement('img');
      img.src = anuncio.imagem_url;
      img.className = 'd-block w-100';
      img.alt = anuncio.titulo;

      if (anuncio.link_destino && anuncio.link_destino.trim() !== '') {
        const link = document.createElement('a');
        link.href = anuncio.link_destino;
        link.target = '_blank'; // Abre em nova aba
        link.appendChild(img);
        item.appendChild(link);
      } else {
        item.appendChild(img);
      }

      // Opcional: legenda
      const caption = document.createElement('div');
      caption.className = 'carousel-caption d-none d-md-block';
      caption.innerHTML = `
        <h5>${anuncio.titulo}</h5>
        <p>${anuncio.descricao}</p>
      `;

      item.appendChild(caption);

      inner.appendChild(item);
    });

    // Inicializa o carrossel com troca automática a cada 5 segundos (5000ms)
    const carouselElement = document.querySelector('#carouselHome');
    const carousel = new bootstrap.Carousel(carouselElement, {
      interval: 7000,
      ride: 'carousel'
    });
  });
});