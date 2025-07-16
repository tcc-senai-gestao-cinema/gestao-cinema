// models/Sessao.js
const { DataTypes } = require('sequelize');
const dataBase = require('../config/dataBase');

const Sessao = dataBase.define('Sessao', {
  id_sessao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_filme: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'filmes', 
      key: 'id_filme'
    }
  },
  id_sala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'salas', 
      key: 'id_sala'
    }
  },
  data: {
    type: DataTypes.DATEONLY, 
    allowNull: false
  },
  horario: {
    type: DataTypes.TIME, 
    allowNull: false
  }
}, {
  tableName: 'sessoes',
  timestamps: false 
});

module.exports = Sessao;