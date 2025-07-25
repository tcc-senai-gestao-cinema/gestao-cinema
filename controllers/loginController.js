// controllers/loginController.js
const fs = require('fs');
const path = require('path');
const { Usuario, findByEmail } = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Exibir formulário de login
function showLoginForm(req, res, mensagem = '') {
  const usuario = req.session.usuario;

  if (usuario) {
    return res.redirect('/perfil');
  }
  
  const caminho = path.join(__dirname, '../pages/login/login.html');

  fs.readFile(caminho, 'utf8', (err, html) => {
    if (err) {
      return res.status(500).send('Erro ao carregar o formulário');
    }

    const htmlComMensagem = html.replace(/%%MENSAGEM%%/g, typeof mensagem === 'string' ? mensagem : '');
    res.send(htmlComMensagem);
  });
}

// Lógica de login
async function login(req, res, next) {
  try {
    const { e_mail, senha } = req.body;

    if (!e_mail || !senha) {
      return showLoginForm(req, res, 'Email e senha são obrigatórios');
    }

    const user = await findByEmail(e_mail);
    if (!user) {
      return showLoginForm(req, res, 'Email ou senha inválidos');
    }

    const validPassword = await bcrypt.compare(senha, user.senha_hash);

    console.log('USUÁRIO ENCONTRADO NO BANCO:', user);
    if (!user) {
      return showLoginForm(req, res, 'Email ou senha inválidos');
    }

    if (!validPassword) {
      return showLoginForm(req, res, 'Email ou senha inválidos');
    }

    await Usuario.update(
      { ultimo_login: new Date(), ativo: 1 },
      { where: { id_usuario: user.id_usuario } }
    );

    req.session.usuario = {
      id: user.id_usuario,
      nome: user.nome,
      cpf: user.cpf,
      email: user.e_mail,
      telefone: user.telefone,
    };

    console.log('DADOS SALVOS NA SESSÃO:', req.session.usuario);

    // Salvar a flag de que o usuário acabou de fazer login
    req.session.loginRecente = true;

    res.redirect('/');

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return showLoginForm(req, res, 'Erro interno no login');
  }
}

module.exports = {
  login,
  showLoginForm
};
