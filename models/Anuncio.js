const { DataTypes } = require('sequelize');
const dataBase = require('../config/dataBase');

const Anuncio = dataBase.define('Anuncio', {
  id_anuncio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: DataTypes.STRING,
  descricao: DataTypes.TEXT,
  imagem_url: DataTypes.STRING,
  data_inicio: DataTypes.DATE,
  data_fim: DataTypes.DATE,
  ativo: DataTypes.BOOLEAN,
  tipo: DataTypes.ENUM('banner', 'destaque', 'notícia', 'carrossel'),
  link_destino: DataTypes.STRING,
  prioridade: DataTypes.INTEGER,
}, {
  tableName: 'anuncios',
  timestamps: false,
});

module.exports = Anuncio;
