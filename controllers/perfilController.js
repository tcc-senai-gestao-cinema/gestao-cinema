const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/Usuario');

// Função para ver o perfil
function showProfile(req, res) {
    const usuario = req.session.usuario;
    if (!usuario) {
        return res.redirect('/login');
    }
    const caminho = path.join(__dirname, '../pages/perfil/perfil.html');
    fs.readFile(caminho, 'utf8', (err, html) => {
        if (err) {
            console.error('Erro ao ler o arquivo perfil.html:', err);
            return res.status(500).send('Erro ao carregar a página de perfil.');
        }
        let htmlFinal = html.replace('%NOME%', usuario.nome);
        htmlFinal = htmlFinal.replace('%EMAIL%', usuario.email);
        htmlFinal = htmlFinal.replace('%CPF%', usuario.cpf);
        htmlFinal = htmlFinal.replace('%TELEFONE%', usuario.telefone);
        res.send(htmlFinal);
    });
}

// Função para exibir o formulário de edição
function showEditForm(req, res) {
    const usuario = req.session.usuario;
    if (!usuario) {
        return res.redirect('/login');
    }
    const caminho = path.join(__dirname, '../pages/perfil/editarPerfil.html');
    fs.readFile(caminho, 'utf8', (err, html) => {
        if (err) {
            console.error('Erro ao ler o arquivo editarPerfil.html:', err);
            return res.status(500).send('Erro ao carregar o formulário de edição.');
        }
        let htmlFinal = html.replace('%NOME%', usuario.nome);
        htmlFinal = htmlFinal.replace('%EMAIL%', usuario.email);
        htmlFinal = htmlFinal.replace('%TELEFONE%', usuario.telefone);
        res.send(htmlFinal);
    });
}

// Função para salvar as alterações (AGORA MAIS INTELIGENTE)
async function updateProfile(req, res) {
    try {
        const programacaoUsuario = req.session.usuario;
        const dadosDoFormulario = req.body;

        const dadosParaAtualizar = {};

        if (dadosDoFormulario.nome !== programacaoUsuario.nome) {
            dadosParaAtualizar.nome = dadosDoFormulario.nome;
        }
        if (dadosDoFormulario.e_mail !== programacaoUsuario.email) {
            dadosParaAtualizar.e_mail = dadosDoFormulario.e_mail;
        }

        if (dadosDoFormulario.telefone !== programacaoUsuario.telefone) {
            dadosParaAtualizar.telefone = dadosDoFormulario.telefone;
        }


        if (Object.keys(dadosParaAtualizar).length > 0) {
            console.log('Alterações detectadas. Atualizando o banco de dados com:', dadosParaAtualizar);
            await Usuario.update(dadosParaAtualizar, {
                where: { id_usuario: programacaoUsuario.id }
            });

            req.session.usuario = Object.assign(programacaoUsuario, {
                nome: dadosParaAtualizar.nome || programacaoUsuario.nome,
                email: dadosParaAtualizar.e_mail || programacaoUsuario.email,
                telefone: dadosParaAtualizar.telefone || programacaoUsuario.telefone,
            });
        } else {
            console.log('Nenhuma alteração detectada. O banco de dados não foi acessado.');
        }

        res.redirect('/perfil');

    } catch (error) {
        console.error('Erro ao atualizar o perfil:', error);
        res.status(500).send('Ocorreu um erro ao salvar as alterações.');
    }
}

module.exports = {
    showProfile,
    showEditForm,
    updateProfile
};