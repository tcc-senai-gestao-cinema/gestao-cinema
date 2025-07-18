const { DataTypes } = require('sequelize');
const dataBase = require('../config/dataBase');

const Usuario = dataBase.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  data_cadastro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
  },
  e_mail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  ativo: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tipo_acesso: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'cliente',
    validate: {
      is: /^cliente$/,
    }
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

// 👉 Função findByEmail separada
async function findByEmail(email) {
  return await Usuario.findOne({ where: { e_mail: email } });
}

// Exporta o model e a função
module.exports = {
  Usuario,
  findByEmail
};
