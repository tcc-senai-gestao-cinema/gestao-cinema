const { DataTypes } = require('sequelize');
const db = require('../config/dataBase');

const ProgramaFidelidade = db.define('programas_fidelidade', {
  id_programa_fidelidade: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  regra: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  pontos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  data_inicio: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'programas_fidelidade',
  timestamps: false
});

module.exports = ProgramaFidelidade;
