document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar o ID do filme da URL (ex: /filme.html?id_filme=1)
    function getFilmeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id_filme'); // Use a chave que você definiu na URL
    }

    async function carregarDetalhesFilme(filmeId) {
        // Se não houver ID, podemos carregar um filme padrão ou o primeiro da lista
        // Para este exemplo, vamos buscar um filme específico. Se não houver id, mostra erro.
        if (!filmeId) {
            // Tenta pegar o primeiro filme da lista geral como fallback
            // ou você pode mostrar uma mensagem para o usuário selecionar um filme.
            try {
                const response = await fetch('/api/filmes'); // Pega todos os filmes
                 if (!response.ok) {
                    throw new Error(`Erro ao buscar lista de filmes: ${response.status}`);
                }
                const filmes = await response.json();
                if (filmes && filmes.length > 0) {
                    filmeId = filmes[0].id_filme; // Pega o ID do primeiro filme
                } else {
                    document.getElementById('filme-titulo').textContent = 'Nenhum filme disponível.';
                    console.error('Nenhum filme encontrado para carregar como padrão.');
                    return;
                }
            } catch (error) {
                 console.error('Erro ao carregar filme padrão:', error);
                document.getElementById('filme-titulo').textContent = 'Erro ao carregar filme.';
                return;
            }
        }

        try {
            const response = await fetch(`/api/filmes/${filmeId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    document.getElementById('filme-titulo').textContent = 'Filme não encontrado.';
                } else {
                    document.getElementById('filme-titulo').textContent = 'Erro ao carregar dados do filme.';
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const filme = await response.json();

            // Preencher o HTML com os dados do filme
            document.getElementById('filme-poster').src = filme.imagem_url || 'img/default_poster.jpg'; // Imagem padrão se não houver
            document.getElementById('filme-poster').alt = filme.titulo || 'Poster do Filme';
            document.getElementById('filme-titulo').textContent = filme.titulo || 'Título Indisponível';
            document.getElementById('filme-sinopse').textContent = filme.sinopse || 'Sinopse não disponível.';
            document.getElementById('filme-genero').textContent = filme.genero || 'N/A';
            document.getElementById('filme-duracao').textContent = filme.duracao ? `${filme.duracao} min` : 'N/A';
            document.getElementById('filme-classificacao').textContent = filme.classificacao_indicativa || 'N/A';

        } catch (error) {
            console.error('Falha ao carregar detalhes do filme:', error);
            // Você pode exibir uma mensagem de erro mais amigável na página
            if (!document.getElementById('filme-titulo').textContent.includes('Filme não encontrado')) {
                 document.getElementById('filme-titulo').textContent = 'Erro ao carregar informações do filme.';
            }
        }
    }

    const filmeId = getFilmeIdFromUrl();
    carregarDetalhesFilme(filmeId || 1); 



});