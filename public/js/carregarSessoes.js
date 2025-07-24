document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const filmeId = params.get('id_filme');

  if (!filmeId) {
    console.error('ID do filme não encontrado na URL.');
    return;
  }

  fetch(`/api/programacoes/${filmeId}`)
    .then(res => res.json())
    .then(programacoes => {
      const diasContainer = document.getElementById('dias-container');
      const horariosContainer = document.getElementById('horarios-container');

      const diasUnicos = [...new Set(programacoes.map(s => s.data))];

      diasUnicos.forEach((data, index) => {
        const inputId = `dia${index}`;
        const input = document.createElement('input');
        input.type = 'radio';
        input.className = 'btn-check';
        input.name = 'dia';
        input.id = inputId;
        input.value = data;
        input.autocomplete = 'off';

        const label = document.createElement('label');
        label.className = 'btn btn-custom m-1';
        label.htmlFor = inputId;
        const [ano, mes, dia] = data.split('-');
        const dataObj = new Date(`${ano}-${mes}-${dia}T00:00:00`);
        const nomeDia = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dataObj);
        label.textContent = `${dia}/${mes} (${nomeDia.slice(0, 3)})`;



        input.addEventListener('change', () => {
          horariosContainer.innerHTML = '';
          const horariosDoDia = programacoes.filter(s => s.data === data);
          horariosDoDia.forEach((programacao, hIndex) => {
            const horarioId = `horario${hIndex}`;
            const inputH = document.createElement('input');
            inputH.type = 'radio';
            inputH.className = 'btn-check';
            inputH.name = 'horario';
            inputH.id = horarioId;
            inputH.value = programacao.id_programacao;
            inputH.autocomplete = 'off';

            const labelH = document.createElement('label');
            labelH.className = 'btn btn-custom m-1';
            labelH.htmlFor = horarioId;
            labelH.textContent = programacao.horario.slice(0, 5);

            horariosContainer.appendChild(inputH);
            horariosContainer.appendChild(labelH);
          });
        });

        diasContainer.appendChild(input);
        diasContainer.appendChild(label);

        if (index === 0) input.checked = true;
      });

      // Dispara o evento change do primeiro dia automaticamente
      document.querySelector('input[name="dia"]:checked')?.dispatchEvent(new Event('change'));
    })
    .catch(err => {
      console.error('Erro ao carregar programações:', err);
    });
});
