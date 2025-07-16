const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');

const LocalDeExibicao = sequelize.define('LocalDeExibicao', {
  id_local_de_exibicao: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  capacidade: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('aberto', 'fechado'),
    allowNull: true
  }
}, {
  tableName: 'locais_de_exibicoes',
  timestamps: false
});

module.exports = LocalDeExibicao;
