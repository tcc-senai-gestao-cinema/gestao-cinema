
const CLIENT_ID = "903223150767-68ltnksl06elp2qc616kb5iaa640tr9s.apps.googleusercontent.com";  // Coloque seu Client ID aqui

// Inicializa o botão e define o callback
function handleCredentialResponse(response) {
  const jwt = response.credential;

  // Decodifica o JWT para extrair os dados do usuário
  const data = parseJwt(jwt);

  const userInfoDiv = document.getElementById('userInfo');
  userInfoDiv.innerHTML = `
    <p><strong>Nome:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <img src="${data.picture}" alt="Foto de perfil">
  `;
}

// Renderiza o botão de login Google
window.onload = function () {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("g_id_signin"),
    { theme: "outline", size: "large" } // Personalização do botão
  );

  google.accounts.id.prompt(); // Exibe o prompt automaticamente se possível
};

// Função para decodificar o JWT (Token do Google)
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}
