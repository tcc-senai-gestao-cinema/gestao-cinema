const form = document.getElementById('form-id');

function validaNome(nomeCompleto) {
    const nomeComoArray = nomeCompleto.trim().split(' ');
    return nomeComoArray.length >= 2;
}

const nomeInput = document.getElementById('nome');
const nomeError = document.getElementById('nomeError');

nomeInput.addEventListener('input', function() {
    const nome = this.value;
    if (!validaNome(nome)) {
        nomeError.style.display = 'block';
    } else {
        nomeError.style.display = 'none';
    }
});

form.addEventListener('submit', function(event) {
    const nome = nomeInput.value;
    if (!validaNome(nome)) {
        nomeError.style.display = 'block';
        event.preventDefault();  // impede envio se inválido
        nomeInput.focus();
    }
});
