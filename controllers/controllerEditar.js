const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models/Usuario');

// Exibe o formulário de edição com dados da sessão
function showEditarPerfilForm(req, res) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.redirect('/login');
  }

  const filePath = path.join(__dirname, '../pages/editar/editar-perfil.html');

  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      console.error('Erro ao ler o arquivo HTML:', err);
      return res.status(500).send('Erro ao carregar o formulário');
    }

    const htmlFinal = html
      .replace('%%NOME%%', usuario.nome || '')
      .replace('%%CPF%%', usuario.cpf || '')
      .replace('%%EMAIL%%', usuario.email || '')
      .replace('%%TELEFONE%%', usuario.telefone || '');

    res.send(htmlFinal);
  });
}

// Atualiza os dados no banco
async function editarPerfil(req, res) {
  try {
    const usuarioSessao = req.session.usuario;

    if (!usuarioSessao) {
      return res.redirect('/login');
    }

    const usuario = await Usuario.findByPk(usuarioSessao.id);
    if (!usuario) {
      return showEditarPerfilForm(req, res, 'Usuário não encontrado');
    }

    const { nome, e_mail, telefone, senha } = req.body;

    // Só altera se o valor for fornecido e diferente do atual
    if (nome?.trim() && nome.trim() !== usuario.nome) {
      usuario.nome = nome.trim();
    }

    if (e_mail?.trim() && e_mail.trim() !== usuario.e_mail) {
      usuario.e_mail = e_mail.trim();
    }

    if (telefone?.trim() && telefone.trim() !== usuario.telefone) {
      usuario.telefone = telefone.trim();
    }

    if (senha?.trim()) {
      usuario.senha_hash = await bcrypt.hash(senha.trim(), 10);
    }

    await usuario.save();

    // Atualiza os dados da sessão
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.e_mail,
      telefone: usuario.telefone,
      senha: usuario.senha,
      cpf: usuario.cpf,
    };

    res.redirect('/home');
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return showEditarPerfilForm(req, res, 'Erro ao atualizar perfil');
  }
}


module.exports = {
  showEditarPerfilForm,
  editarPerfil,
};
