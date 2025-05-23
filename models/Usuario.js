const { Sequelize, DataTypes } = require('sequelize');  // Corrigir a importação
const dataBase = require('../database/connection');  // Importa a conexão com o banco de dados

// Definindo o modelo Usuario
const Usuario = dataBase.define('Usuario', {
  // id_usuario: Chave primária e auto-incremento
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto-incremento
    allowNull: false,
  },

  // data_cadastro: Data de cadastro
  data_cadastro: {
    type: DataTypes.DATEONLY, // DATEONLY para armazenar apenas a data
    allowNull: false,
  },

  // nome: Nome do usuário
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  // cpf: CPF do usuário
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true, // Se você deseja garantir que o CPF seja único
  },

  // e_mail: E-mail do usuário
  e_mail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Garantir que o e-mail seja único
  },

  // senha_hash: Hash da senha
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  // telefone: Número de telefone
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true, // Opcional
  },

  // ativo: Se o usuário está ativo ou não (0 ou 1)
  ativo: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1, // 1 = ativo, 0 = inativo
  },

  // ultimo_login: Data e hora do último login
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true, // Pode ser nulo se o usuário nunca fez login
  },

  // tipo_acesso: Tipo de acesso do usuário (aqui está com 'client')
  tipo_acesso: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'cliente',
  validate: {
    is: /^cliente$/  // Aceita apenas 'cliente'
  }
},
}, {
  tableName: 'usuarios', // Nome da tabela no banco de dados
  timestamps: false, // Não há colunas createdAt/updatedAt
});

// Exportar o modelo Usuario
module.exports = Usuario;
