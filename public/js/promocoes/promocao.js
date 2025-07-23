
document.addEventListener('DOMContentLoaded', () => {
    // 1. Conecta ao servidor de sockets
    const socket = io();

    // 2. Pega o elemento container onde os cards serão inseridos
    const promocoesContainer = document.getElementById('promocoes-container');

    // 3. Ouve o evento 'promocoesAtualizadas' que o servidor envia
    socket.on('promocoesAtualizadas', (promocoes) => {
        // Garante que o container exista antes de manipulá-lo
        if (!promocoesContainer) return;

        console.log('✨ Promoções recebidas!', promocoes);

        // Limpa o container para evitar cards duplicados
        promocoesContainer.innerHTML = '';

        // Se não houver promoções, exibe uma mensagem
        if (promocoes.length === 0) {
            promocoesContainer.innerHTML = '<p class="col-12 text-center">Nenhuma promoção disponível no momento.</p>';
            return;
        }

        // 4. Itera sobre cada promoção recebida e cria o HTML do card
        promocoes.forEach(promocao => {
            const descontoFormatado = parseFloat(promocao.desconto_percentual).toFixed(0);
            const seloDescontoHTML = promocao.desconto_percentual > 0 
                ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2 p-2 fs-6">${descontoFormatado}% OFF</span>`
                : '';
            
            // Define a imagem padrão caso não haja uma na promoção
            const imageUrl = promocao.imagem_url || 'img/placeholder-promocao.jpg';

            const cardHTML = `
                <div class="col-md-3 col-sm-4 col-6">
                    <div class="card h-100 shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="${promocao.nome}">
                        
                        ${seloDescontoHTML}

                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${promocao.nome}</h5>
                            <p class="card-text flex-grow-1">${promocao.descricao}</p>
                            <a href="/promocao/${promocao.id_promocao}" class="btn btn-primary mt-auto">Ver detalhes</a>
                        </div>
                    </div>
                </div>
            `;
            // Adiciona o novo card ao container
            promocoesContainer.innerHTML += cardHTML;
        });
    });

    // Opcional: Lida com falhas de conexão
    socket.on('connect_error', () => {
        console.error('Falha na conexão com o servidor de sockets.');
        if (promocoesContainer) {
            promocoesContainer.innerHTML = '<p class="col-12 text-center text-danger">Não foi possível carregar as promoções em tempo real.</p>';
        }
    });
});