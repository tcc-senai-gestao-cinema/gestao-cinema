function toggleSenha() {
  const campos = ['senha', 'inputConfirmPassword3'];
  const icone = document.getElementById('iconeOlho');
  let mostrando = false;

  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo.type === 'password') {
      campo.type = 'text';
      mostrando = true;
    } else {
      campo.type = 'password';
    }
  });

  if (mostrando) {
    icone.classList.remove('bi-eye');
    icone.classList.add('bi-eye-slash');
  } else {
    icone.classList.remove('bi-eye-slash');
    icone.classList.add('bi-eye');
  }
}
