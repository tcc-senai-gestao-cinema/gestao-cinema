const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { Usuario, findByEmail } = require('../models/Usuario');

// Função para mostrar o formulário com mensagem (se houver)
function showCadastroForm(req, res, mensagem = '') {
  const caminho = path.join(__dirname, '../pages/cadastro/cadastro.html');

  fs.readFile(caminho, 'utf8', (err, html) => {
    if (err) {
      return res.status(500).send('Erro ao carregar o formulário');
    }

    const htmlComMensagem = html.replace(/%%MENSAGEM%%/g, typeof mensagem === 'string' ? mensagem : '');
    res.send(htmlComMensagem);
  });
}

// Cadastro de usuário
async function cadastro(req, res) {
  try {
    const { nome, cpf, e_mail, senha, telefone } = req.body;

    if (!nome || !cpf || !e_mail || !senha) {
      return showCadastroForm(req, res, 'Preencha todos os campos obrigatórios');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e_mail)) {
      return showCadastroForm(req, res, 'E-mail inválido');
    }

    const existingEmail = await findByEmail(e_mail);
    if (existingEmail) {
      return showCadastroForm(req, res, 'E-mail já cadastrado');
    }

    const existingCpf = await Usuario.findOne({ where: { cpf } });
    if (existingCpf) {
      return showCadastroForm(req, res, 'CPF já cadastrado');
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      cpf,
      e_mail,
      senha_hash,
      telefone,
      data_cadastro: new Date(),
      ativo: 1,
      tipo_acesso: 'cliente',
    });

    res.redirect('/login');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return showCadastroForm(req, res, 'Erro ao cadastrar. Tente novamente.');
  }
}

module.exports = {
  showCadastroForm,
  cadastro
};
