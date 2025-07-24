document.getElementById('senha').addEventListener('input', function() {
  var senha = this.value;
  var senhaError = document.getElementById('senhaError');
  const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!regexSenhaForte.test(senha)) {
    senhaError.style.display = 'block';
    return false;
  } 
  senhaError.style.display = 'none'; 
  return true;
});

document.getElementById('inputConfirmPassword3').addEventListener('input', function() {
  var confirmSenha = this.value;
  var senha = document.getElementById('senha').value;
  var confirmSenhaError = document.getElementById('confirmSenhaError');

  if (confirmSenha.length === 0 || senha !== confirmSenha) {
    confirmSenhaError.style.display = 'block';
    return false;
  }
  confirmSenhaError.style.display = 'none'; 
  return true;
});


form.addEventListener('submit', (event) => {
  if (!validarSenha()) {
    senhaInput.focus();
    event.preventDefault();
    return;
  }
  if (!validarConfirmacao()) {
    confirmSenhaInput.focus();
    event.preventDefault();
    return;
  }
});