// models/Promocao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dataBase'); // 1. Ajuste o caminho para sua conexão

// Opcional: Se houver relação com Programas de Fidelidade
// const ProgramaFidelidade = require('./ProgramaFidelidade'); 

const Promocao = sequelize.define('Promocao', {
    // Define as colunas da tabela 'promocoes'
    id_promocao: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    id_programa_fidelidade: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permite nulo, já que nem toda promoção é de fidelidade
        references: {
            // model: ProgramaFidelidade, // Descomente se tiver o model 'ProgramaFidelidade'
            key: 'id_programa_fidelidade'
        }
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true // Pode ser nulo se a descrição for opcional
    },
    desconto_percentual: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true // Pode ser nulo se não houver desconto direto
    },
    data_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_fim: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('comum', 'programa_fidelidade'),
        allowNull: false,
        defaultValue: 'comum' // Um valor padrão é uma boa prática
    },
    imagem_url: {
        type: DataTypes.STRING(255),
        allowNull: true // A imagem pode ser opcional
    }
}, {
    // Opções do model
    tableName: 'promocoes', // 2. Garante que o nome da tabela seja exatamente 'promocoes'
    timestamps: false,      // 3. Desativa as colunas 'createdAt' e 'updatedAt' automáticas
    hooks: {
        // 4. Validação para garantir que a data de início não seja posterior à data de fim
        beforeValidate: (promocao) => {
            if (promocao.data_inicio && promocao.data_fim && promocao.data_inicio > promocao.data_fim) {
                throw new Error('A data de início não pode ser posterior à data de fim.');
            }
        }
    }
});


module.exports = { Promocao };