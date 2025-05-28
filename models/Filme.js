// models/Filme.js
const { DataTypes } = require('sequelize');  // Corrigir a importação
const dataBase = require('../database/connection');  // Importa a conexão com o banco de dados

const Filme = dataBase.define('Filme', {
  id_filme: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  duracao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classificacao_indicativa: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  sinopse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagem_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'filmes',
  timestamps: false // Desativa createdAt/updatedAt
});

module.exports = Filme;
