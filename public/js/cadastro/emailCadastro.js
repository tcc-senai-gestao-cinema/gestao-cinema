const form = document.getElementById('form-id');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmail() {
  const email = emailInput.value;
  if (!regexEmail.test(email)) {
    emailError.style.display = 'block';
    return false;
  } else {
    emailError.style.display = 'none';
    return true;
  }
}

form.addEventListener('submit', (event) => {
  if (!validarEmail()) {
    event.preventDefault();
    emailInput.focus();
  }
});
