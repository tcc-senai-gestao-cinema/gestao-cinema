const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/Usuario');

// Função para MOSTRAR o formulário de alteração de senha
function showChangePasswordForm(req, res) {
    // Agora, em vez de receber um parâmetro, a função LÊ a URL
    // Ex: /perfil/alterar-senha?erro=senha_incorreta
    const { erro } = req.query;
    let mensagem = '';

    // Cria a mensagem de erro baseada no que veio na URL
    if (erro === 'confirmacao') {
        mensagem = '<div class="alert alert-danger">A nova senha e a confirmação não são iguais.</div>';
    } else if (erro === 'senha_incorreta') {
        mensagem = '<div class="alert alert-danger">A senha atual está incorreta.</div>';
    } else if (erro === 'nao_encontrado') {
        mensagem = '<div class="alert alert-danger">Usuário não encontrado.</div>';
    }

    const caminho = path.join(__dirname, '../pages/perfil/altera-senha.html');
    
    fs.readFile(caminho, 'utf8', (err, html) => {
        if (err) {
            console.error("Erro ao ler o arquivo altera-senha.html:", err);
            return res.status(500).send('Erro ao carregar o formulário de alteração de senha.');
        }
        const htmlComMensagem = html.replace('%%MENSAGEM%%', mensagem);
        res.send(htmlComMensagem);
    });
}

// Função para PROCESSAR a alteração de senha
async function changePassword(req, res) {
    try {
        const { id } = req.session.usuario;
        const { senha_atual, nova_senha, confirmar_senha } = req.body;

        if (nova_senha !== confirmar_senha) {
            // Agora, em vez de chamar a outra função, apenas redirecionamos com um parâmetro de erro
            return res.redirect('/perfil/altera-senha?erro=confirmacao');
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.redirect('/perfil/altera-senha?erro=nao_encontrado');
        }

        const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha_hash);
        if (!senhaCorreta) {
            return res.redirect('/perfil/altera-senha?erro=senha_incorreta');
        }

        const novoHash = await bcrypt.hash(nova_senha, 10);

        await Usuario.update(
            { senha_hash: novoHash },
            { where: { id_usuario: id } }
        );
        
        // Redireciona para o perfil (poderia adicionar uma msg de sucesso, ex: ?status=ok)
        res.redirect('/perfil');

    } catch (error) {
        console.error('Erro ao alterar a senha:', error);
        res.redirect('/perfil/altera-senha?erro=interno');
    }
}

module.exports = {
    showChangePasswordForm,
    changePassword
};