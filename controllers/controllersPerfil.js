const fs = require('fs');
const path = require('path');
const { Usuario } = require('../models/Usuario');


function showPerfil(req, res) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.redirect('/login');
  }

  const filePath = path.join(__dirname, '../pages/perfil/perfil.html');

  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      return res.status(500).send('Erro ao carregar a página de perfil');
    }

    const htmlFinal = html
      .replace('%%NOME%%', usuario.nome || '')
      .replace('%%CPF%%', usuario.cpf || '')
      .replace('%%EMAIL%%', usuario.email || '')
      .replace('%%TELEFONE%%', usuario.telefone || '');
    
    res.send(htmlFinal);
  });
}


module.exports = { showPerfil };
