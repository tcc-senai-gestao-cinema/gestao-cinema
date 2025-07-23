// models/programacao.js
const { DataTypes } = require('sequelize');
const dataBase = require('../config/dataBase');

const programacao = dataBase.define('programacao', {
  id_programacao: {
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
  id_local_de_exibicao: {
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
  tableName: 'programacoes',
  timestamps: false 
});

module.exports = programacao;