const telefoneInput = document.getElementById('telefone');
const telefoneError = document.getElementById('telefoneError');

function validaTelefone(telefone) {
    // Regex para telefone brasileiro: (99) 99999-9999 ou (99) 9999-9999
    const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return regexTelefone.test(telefone);
}

telefoneInput.addEventListener('input', () => {
    if (!validaTelefone(telefoneInput.value)) {
        telefoneError.style.display = 'block';
    } else {
        telefoneError.style.display = 'none';
    }
});

form.addEventListener('submit', (event) => {
    if (!validaTelefone(telefoneInput.value)) {
        telefoneError.style.display = 'block';
        event.preventDefault();
        telefoneInput.focus();
    }
});
