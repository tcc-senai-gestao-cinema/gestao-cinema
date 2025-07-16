const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase');
const LocalDeExibicao = require('./LocalDeExibicao');

const Vaga = sequelize.define('Vaga', {
  id_vaga: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_local_de_exibicao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LocalDeExibicao,
      key: 'id_local_de_exibicao'
    },
    onDelete: 'CASCADE'
  },
  tipo: {
    type: DataTypes.ENUM(
      'normal',
      'casal',
      'cadeira de rodas',
      'preferencial',
      'veiculo_pequeno',
      'veiculo_medio',
      'veiculo_grande'
    ),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('disponível', 'reservado', 'ocupado'),
    defaultValue: 'disponível'
  },
  reserva_data: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vagas',
  timestamps: false
});

// Relacionamento
Vaga.belongsTo(LocalDeExibicao, {
  foreignKey: 'id_local_de_exibicao',
  as: 'local'
});

module.exports = Vaga;
