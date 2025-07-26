// public/js/distribuicaoDoPublico/distribuicaoDoPublico.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    
    // Variáveis globais
    let vagasSelecionadas = [];
    let todasAsVagas = [];
    let localAtual = null;
    
    // Elementos DOM
    const container = document.querySelector('.selecao-assentos');
    const infoDiv = document.getElementById("cadeira-selecionada");
    const botaoConfirmar = document.getElementById('confirmar');
    
    // Buscar ID do local de exibição da URL (se houver programação selecionada)
    const params = new URLSearchParams(window.location.search);
    const programacaoId = params.get('programacao_id');
    
    // Se não houver programação específica, usar um local padrão (ID 1)
    localAtual = programacaoId ? programacaoId : 1;
    
    // Solicitar vagas do local ao conectar
    socket.emit('solicitarVagas', localAtual);
    
    // Receber vagas atuais do servidor
    socket.on('vagasAtuais', (vagas) => {
        console.log('Vagas recebidas:', vagas);
        todasAsVagas = vagas;
        renderizarAssentos(vagas);
    });
    
    // Receber atualizações de vagas em tempo real
    socket.on('vagaAtualizada', (vagaAtualizada) => {
        console.log('Vaga atualizada:', vagaAtualizada);
        
        // Atualizar a vaga no array local
        const index = todasAsVagas.findIndex(v => v.id_vaga === vagaAtualizada.id_vaga);
        if (index !== -1) {
            todasAsVagas[index] = vagaAtualizada;
        }
        
        // Atualizar visualmente a vaga específica
        atualizarVagaVisual(vagaAtualizada);
        
        // Se a vaga foi ocupada por outro usuário e estava selecionada por este usuário
        if (vagaAtualizada.status === 'ocupado' && vagasSelecionadas.includes(vagaAtualizada.id_vaga)) {
            removerVagaSelecionada(vagaAtualizada.id_vaga);
            alert(`O assento ${vagaAtualizada.nome} foi ocupado por outro usuário.`);
        }
    });
    
    // Função para renderizar todos os assentos
    function renderizarAssentos(vagas) {
        container.innerHTML = '';
        
        if (!vagas || vagas.length === 0) {
            container.innerHTML = '<p>Nenhum assento disponível para este local.</p>';
            return;
        }
        
        // Organizar vagas por posição (pos_x, pos_y)
        const vagasOrganizadas = organizarVagasPorPosicao(vagas);
        
        // Criar grid baseado nas posições
        criarGridAssentos(vagasOrganizadas);
    }
    
    // Organizar vagas por posição para criar o layout
    function organizarVagasPorPosicao(vagas) {
        const maxX = Math.max(...vagas.map(v => v.pos_x));
        const maxY = Math.max(...vagas.map(v => v.pos_y));
        
        // Ajustar o grid CSS
        container.style.gridTemplateColumns = `repeat(${maxX}, 50px)`;
        container.style.gridTemplateRows = `repeat(${maxY}, 50px)`;
        
        return { vagas, maxX, maxY };
    }
    
    // Criar o grid de assentos
    function criarGridAssentos({ vagas, maxX, maxY }) {
        // Criar array bidimensional para o layout
        const layout = Array(maxY).fill(null).map(() => Array(maxX).fill(null));
        
        // Preencher layout com as vagas
        vagas.forEach(vaga => {
            if (vaga.pos_x && vaga.pos_y) {
                layout[vaga.pos_y - 1][vaga.pos_x - 1] = vaga;
            }
        });
        
        // Renderizar o layout
        layout.forEach((linha, y) => {
            linha.forEach((vaga, x) => {
                if (vaga) {
                    criarElementoVaga(vaga);
                } else {
                    // Criar espaço vazio se necessário
                    criarEspacoVazio();
                }
            });
        });
    }
    
    // Criar elemento visual para uma vaga
    function criarElementoVaga(vaga) {
        const elemento = document.createElement('div');
        elemento.classList.add('cadeira');
        elemento.dataset.idVaga = vaga.id_vaga;
        elemento.textContent = vaga.nome;
        
        // Aplicar status visual
        aplicarStatusVisual(elemento, vaga);
        
        // Adicionar evento de clique apenas se disponível
        if (vaga.status === 'disponível') {
            elemento.addEventListener('click', () => selecionarVaga(vaga));
        }
        
        container.appendChild(elemento);
    }
    
    // Criar espaço vazio no grid
    function criarEspacoVazio() {
        const espaco = document.createElement('div');
        espaco.classList.add('espaco-vazio');
        container.appendChild(espaco);
    }
    
    // Aplicar status visual à vaga
    function aplicarStatusVisual(elemento, vaga) {
        // Remover classes de status anteriores
        elemento.classList.remove('disponivel', 'ocupada', 'reservada', 'selecionada');
        
        // Aplicar classe baseada no status
        switch (vaga.status) {
            case 'disponível':
                elemento.classList.add('disponivel');
                elemento.style.cursor = 'pointer';
                break;
            case 'ocupado':
                elemento.classList.add('ocupada');
                elemento.style.cursor = 'not-allowed';
                break;
            case 'reservado':
                elemento.classList.add('reservada');
                elemento.style.cursor = 'not-allowed';
                break;
        }
        
        // Verificar se está selecionada pelo usuário atual
        if (vagasSelecionadas.includes(vaga.id_vaga)) {
            elemento.classList.add('selecionada');
        }
    }
    
    // Atualizar vaga específica visualmente
    function atualizarVagaVisual(vaga) {
        const elemento = document.querySelector(`[data-id-vaga="${vaga.id_vaga}"]`);
        if (elemento) {
            aplicarStatusVisual(elemento, vaga);
        }
    }
    
    // Função para selecionar/deselecionar vaga
    function selecionarVaga(vaga) {
        if (vaga.status !== 'disponível') {
            alert('Este assento não está disponível.');
            return;
        }
        
        const idVaga = vaga.id_vaga;
        const elemento = document.querySelector(`[data-id-vaga="${idVaga}"]`);
        
        if (vagasSelecionadas.includes(idVaga)) {
            // Deselecionar
            removerVagaSelecionada(idVaga);
        } else {
            // Selecionar
            vagasSelecionadas.push(idVaga);
            elemento.classList.add('selecionada');
            
            // Emitir seleção para o servidor (reserva temporária)
            socket.emit('selecionarVaga', { idVaga: idVaga });
        }
        
        atualizarInfoSelecao();
    }
    
    // Remover vaga da seleção
    function removerVagaSelecionada(idVaga) {
        const index = vagasSelecionadas.indexOf(idVaga);
        if (index > -1) {
            vagasSelecionadas.splice(index, 1);
            
            const elemento = document.querySelector(`[data-id-vaga="${idVaga}"]`);
            if (elemento) {
                elemento.classList.remove('selecionada');
            }
            
            // Emitir cancelamento para o servidor
            socket.emit('cancelarVaga', { idVaga: idVaga });
        }
    }
    
    // Atualizar informações de seleção
    function atualizarInfoSelecao() {
        const nomesSelecionados = vagasSelecionadas.map(id => {
            const vaga = todasAsVagas.find(v => v.id_vaga === id);
            return vaga ? vaga.nome : '';
        }).filter(nome => nome);
        
        if (nomesSelecionados.length > 0) {
            infoDiv.textContent = `Assentos selecionados: ${nomesSelecionados.join(', ')}`;
        } else {
            infoDiv.textContent = 'Nenhum assento selecionado';
        }
    }
    
    // Confirmar seleção
    botaoConfirmar.addEventListener('click', () => {
        if (vagasSelecionadas.length === 0) {
            alert('Você não selecionou nenhum assento.');
            return;
        }
        
        const confirmacao = confirm(`Confirmar a seleção dos assentos: ${vagasSelecionadas.map(id => {
            const vaga = todasAsVagas.find(v => v.id_vaga === id);
            return vaga ? vaga.nome : '';
        }).join(', ')}?`);
        
        if (confirmacao) {
            // Confirmar todas as vagas selecionadas
            vagasSelecionadas.forEach(idVaga => {
                socket.emit('confirmarVaga', { idVaga: idVaga });
            });
            
            alert('Assentos confirmados com sucesso!');
            
            // Redirecionar para página de pagamento ou próxima etapa
            // window.location.href = `/pagamento?vagas=${vagasSelecionadas.join(',')}`;
        }
    });
    
    // Limpeza ao sair da página
    window.addEventListener('beforeunload', () => {
        // Cancelar todas as seleções ao sair
        vagasSelecionadas.forEach(idVaga => {
            socket.emit('cancelarVaga', { idVaga: idVaga });
        });
    });
    
    // Tratamento de desconexão
    socket.on('disconnect', () => {
        console.log('Desconectado do servidor');
    });
    
    socket.on('connect', () => {
        console.log('Reconectado ao servidor');
        // Solicitar vagas novamente após reconexão
        socket.emit('solicitarVagas', localAtual);
    });
});