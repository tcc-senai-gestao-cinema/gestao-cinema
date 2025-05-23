const dataBase = require('./database/connection'); // importa conexão
const Usuario = require('./models/Usuario'); // importa modelo Usuario

async function criarUsuario() {
  try {
    // Sincroniza o modelo com o banco (cria a tabela se não existir)
    await dataBase.sync(); // ou await dataBase.sync({ force: true }) para recriar sempre (apaga dados!)

    // Criar um novo usuário
    const novoUsuario = await Usuario.create({
      data_cadastro: new Date().toISOString().slice(0,10), // yyyy-mm-dd
      nome: 'Irineu da Silva',
      cpf: '123.456.789-00',
      e_mail: 'irineu@email.com',
      senha_hash: 'hash_da_senha',
      telefone: '99999-9999',
      ativo: 1,
      ultimo_login: null,
      tipo_acesso: 'cliente',
    });

    console.log('Usuário criado:', novoUsuario.toJSON());
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await dataBase.close();  // fecha a conexão
  }
}

criarUsuario();
