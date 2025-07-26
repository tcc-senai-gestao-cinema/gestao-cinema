// Aguarda o DOM carregar completamente antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {
  // Encapsula a lógica principal em uma função assíncrona para usar async/await.
  const init = async () => {
    // Seleciona os elementos do DOM uma única vez para melhor performance.
    const diasContainer = document.getElementById('dias-container');
    const horariosContainer = document.getElementById('horarios-container');
    const btnComprar = document.getElementById('btnComprar');
    const mensagemErro = document.getElementById('mensagem-erro'); // Assumindo que você tenha um elemento <div id="mensagem-erro"></div> no HTML

    // Pega o ID do filme da URL.
    const params = new URLSearchParams(window.location.search);
    const filmeId = params.get('id_filme');

    if (!filmeId) {
      mensagemErro.textContent = 'Erro: ID do filme não encontrado na URL.';
      console.error('ID do filme não encontrado na URL.');
      return;
    }

    try {
      // Agrupa as programações por data para acesso rápido, evitando múltiplos 'filters'.
      const programacoesPorData = new Map();
      const programacoes = await fetchProgramacoes(filmeId);
      
      programacoes.forEach(prog => {
        if (!programacoesPorData.has(prog.data)) {
          programacoesPorData.set(prog.data, []);
        }
        programacoesPorData.get(prog.data).push(prog);
      });

      // Renderiza os botões dos dias.
      renderDias(Array.from(programacoesPorData.keys()), diasContainer);
      
      // Adiciona um único event listener no container dos dias.
      diasContainer.addEventListener('change', (event) => {
        if (event.target.name === 'dia') {
          const dataSelecionada = event.target.value;
          const horarios = programacoesPorData.get(dataSelecionada) || [];
          renderHorarios(horarios, horariosContainer);
          btnComprar.style.display = 'none'; 
        }
      });
      
      // Adiciona um único event listener no container dos horários.
      horariosContainer.addEventListener('change', (event) => {
        if (event.target.name === 'horario') {
          // Apenas mostra o botão comprar. A lógica de clique é separada.
          btnComprar.style.display = 'block';
        }
      });

      // Adiciona um único event listener para o botão de comprar.
      btnComprar.addEventListener('click', () => {
        const horarioSelecionadoInput = horariosContainer.querySelector('input[name="horario"]:checked');
        if (!horarioSelecionadoInput) {
          alert('Por favor, selecione um horário.');
          return;
        }
        
        const programacaoId = horarioSelecionadoInput.value;
        // Usa data attributes para armazenar informações extras sem poluir o 'value'.
        const localId = horarioSelecionadoInput.dataset.localId; 

        window.location.href = `/distribuicao-do-publico?programacao_id=${programacaoId}&local_id=${localId}&filme_id=${filmeId}`;
      });

      // Simula o clique no primeiro dia para carregar os horários iniciais.
      const primeiroDiaInput = diasContainer.querySelector('input[name="dia"]');
      if (primeiroDiaInput) {
        primeiroDiaInput.checked = true;
        primeiroDiaInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

    } catch (error) {

      mensagemErro.textContent = 'Não foi possível carregar as sessões. Tente novamente mais tarde.';
      console.error('Erro ao inicializar:', error);
    }
  };
  
  // Função para buscar os dados da API com tratamento de erro.
  const fetchProgramacoes = async (filmeId) => {
    const response = await fetch(`/api/programacoes/${filmeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  // Função para renderizar os botões de dia.
  const renderDias = (dias, container) => {
    const fragment = document.createDocumentFragment();
    dias.forEach((data, index) => {
      const [ano, mes, dia] = data.split('-');
      const dataObj = new Date(data + 'T00:00:00'); // Garante que a data seja interpretada no fuso horário local
      const nomeDia = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dataObj);
      const textoLabel = `${dia}/${mes} (${nomeDia.replace('.', '')})`;
      
      const { input, label } = createRadioButton(`dia${index}`, 'dia', data, textoLabel);
      fragment.appendChild(input);
      fragment.appendChild(label);
    });
    container.replaceChildren(fragment); // 'replaceChildren' é mais moderno que 'innerHTML = ""'
  };
  
  // Função para renderizar os botões de horário.
  const renderHorarios = (horarios, container) => {
    const fragment = document.createDocumentFragment();
    horarios.forEach((prog, index) => {
      const textoLabel = prog.horario.slice(0, 5);
      const { input, label } = createRadioButton(`horario${index}`, 'horario', prog.id_programacao, textoLabel);
      // --- MELHORIA: Uso de data attributes ---
      input.dataset.localId = prog.id_local_de_exibicao; 
      
      fragment.appendChild(input);
      fragment.appendChild(label);
    });
    container.replaceChildren(fragment);
  };
  
  // Função auxiliar para criar inputs de rádio e seus labels.
  const createRadioButton = (id, name, value, labelText) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'btn-check';
    input.id = id;
    input.name = name;
    input.value = value;
    input.autocomplete = 'off';

    const label = document.createElement('label');
    label.className = 'btn btn-custom m-1';
    label.htmlFor = id;
    label.textContent = labelText;

    return { input, label };
  };

  init();
});