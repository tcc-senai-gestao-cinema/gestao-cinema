function validarCPF(cpf) {
    // Remove tudo o que não é número
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        return false; // Se o CPF não tem 11 dígitos
    }

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Validar o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) {
        digito1 = 0;
    }

    // Validar o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) {
        digito2 = 0;
    }

    // Verifica se os dígitos verificadores são válidos
    if (parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2) {
        return true;
    } else {
        return false;
    }
}

// Evento de validação ao digitar o CPF
document.getElementById('cpf').addEventListener('input', function() {
    const cpf = this.value;  // Valor que o usuário digitou
    const cpfError = document.getElementById('cpfError');  // Mensagem de erro

    // Valida o CPF e exibe a mensagem de erro
    if (!validarCPF(cpf)) {
        cpfError.style.display = 'block';  // Exibe a mensagem de erro
    } else {
        cpfError.style.display = 'none';  // Oculta a mensagem de erro
    }
});

form.addEventListener('submit', (event) => {
  const cpf = cpfInput.value;
  if (!validarCPF(cpf)) {
    event.preventDefault();
    cpfError.style.display = 'block';
    cpfInput.focus();
  } else {
    cpfError.style.display = 'none';
  }
});