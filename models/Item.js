const { DataTypes } = require('sequelize');  
const db = require('../config/dataBase');

class Item {

    static async criarVarios(itens, connection) {
        // Este método é feito para ser usado dentro da transação de Venda.js
        const conn = connection || db;
        try {
            // Prepara os valores para uma inserção em massa (bulk insert)
            const valores = itens.map(item => [
                item.id_venda,
                item.id_produto,
                item.tipo,
                item.quantidade,
                item.preco_unitario
            ]);

            const sql = `
                INSERT INTO itens (id_venda, id_produto, tipo, quantidade, preco_unitario)
                VALUES ?
            `;
            await conn.query(sql, [valores]);

        } catch (error) {
            console.error("Erro ao inserir itens:", error);
            throw error;
        }
    }

    static async buscarPorVenda(id_venda) {
        const sql = `
            SELECT i.*, p.nome as nome_produto
            FROM itens i
            JOIN produtos_diversos p ON i.id_produto = p.id_produto
            WHERE i.id_venda = ? AND i.tipo = 'produto'
        `;
        try {
            const [itens] = await db.query(sql, [id_venda]);
            return itens;
        } catch (error) {
            console.error(`Erro ao buscar itens da venda ${id_venda}:`, error);
            throw error;
        }
    }
}

module.exports = Item;
