const fs = require('fs');
const path = require('path');

function showPerfil(req, res) {
  const filePath = path.join(__dirname, '../pages/perfil/perfil.html');

  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      return res.status(500).send('Erro ao carregar a página de perfil');
    }

    const htmlFinal = html
      .replace(/%%NOME%%/g, usuario.nome || '')
      .replace(/%%CPF%%/g, usuario.cpf || '')
      .replace(/%%EMAIL%%/g, usuario.email || '')
      .replace(/%%TELEFONE%%/g, usuario.telefone || '');
      
    res.send(htmlFinal);
  });
}


module.exports = { showPerfil };
