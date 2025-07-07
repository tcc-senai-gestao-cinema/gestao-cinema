const { DataTypes } = require('sequelize');
const db = require('../config/dataBase');

class Produto {

    static async listarDisponiveis() {
        const sql = 'SELECT * FROM produtos_diversos WHERE estoque > 0';
        try {
            const [produtos] = await db.query(sql);
            return produtos;
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            throw error;
        }
    }

    static async buscarPorId(id_produto) {
        const sql = 'SELECT * FROM produtos_diversos WHERE id_produto = ?';
        try {
            const [produtos] = await db.query(sql, [id_produto]);
            return produtos[0] || null;
        } catch (error) {
            console.error(`Erro ao buscar produto ${id_produto}:`, error);
            throw error;
        }
    }


    static async atualizarEstoque(itens, connection) {
        // Este método é pensado para ser usado dentro de uma transação.
        const conn = connection || db; // Usa a conexão da transação ou o pool padrão.
        try {
            for (const item of itens) {
                const sql = 'UPDATE produtos_diversos SET estoque = estoque - ? WHERE id_produto = ?';
                await conn.query(sql, [item.quantidade, item.id_produto]);
            }
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error);
            throw error; // Lança o erro para que a transação possa ser revertida (ROLLBACK).
        }
    }
}

module.exports = Produto;