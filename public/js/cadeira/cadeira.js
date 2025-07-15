document.addEventListener('DOMContentLoaded', () => {
    const fileiras = 7;
    const cadeirasPorFileira = 10;
    const selecionadas = [];
    const container = document.querySelector('.selecao-assentos');
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < fileiras; i++) {
        for (let j = 1; j <= cadeirasPorFileira; j++) {
            const cadeira = document.createElement('div');
            cadeira.classList.add('cadeira');

            const letra = letras[i];
            const identificador = `${letra}${j}`;

            cadeira.textContent = identificador;
            cadeira.dataset.id = identificador;

            cadeira.addEventListener('click', () => {
                if (!cadeira.classList.contains('ocupada')) {
                    cadeira.classList.toggle('selecionada');

                    if (cadeira.classList.contains('selecionada')) {
                        selecionadas.push(identificador);
                    } else {
                        const index = selecionadas.indexOf(identificador);
                        if (index > -1) {
                            selecionadas.splice(index, 1);
                        }
                    }

                    const infoDiv = document.getElementById("cadeira-selecionada");
                    infoDiv.textContent = selecionadas.length > 0
                        ? `Cadeiras selecionadas: ${selecionadas.join(', ')}`
                        : `Nenhuma cadeira selecionada`;
                }
            });

            container.appendChild(cadeira);
        }
    }
    

    // Botão já está no HTML, só adiciona o evento
    const botaoConfirmar = document.getElementById('confirmar');
    botaoConfirmar.addEventListener('click', () => {
        if (selecionadas.length === 0) {
            alert('Você não selecionou nenhuma cadeira.');
        } else {
            alert(`Cadeiras confirmadas: ${selecionadas.join(', ')}`);
        }
    });
});
