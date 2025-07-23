// models/Vaga.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase'); // ajuste o caminho se necessário

const Vaga = sequelize.define('Vaga', {
  id_vaga: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_local_de_exibicao: DataTypes.INTEGER,
  nome: DataTypes.STRING,
  categoria: DataTypes.ENUM('assento', 'drive_in'),
  tipo: DataTypes.ENUM('normal', 'casal', 'acessivel', 'preferencial', 'veiculo_pequeno', 'veiculo_medio', 'veiculo_grande'),
  status: DataTypes.ENUM('disponível', 'reservado', 'ocupado'),
  reserva_data: DataTypes.DATE,
  pos_x: DataTypes.INTEGER,
  pos_y: DataTypes.INTEGER,
  andar: DataTypes.INTEGER
}, {
  tableName: 'vagas',
  timestamps: false
});

module.exports = Vaga;
