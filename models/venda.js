const { DataTypes } = require('sequelize');  
const db = require('../config/dataBase');
const Item = require('./Item'); // Usaremos o model Item
const Produto = require('./Produto'); // Usaremos o model Produto

class Venda {

    static async criar(dadosVenda) {
        const connection = await db.getConnection(); // Pega uma conexão do pool para a transação

        try {
            await connection.beginTransaction(); // Inicia a transação

            // 1. Inserir na tabela 'vendas'
            const vendaSql = `
                INSERT INTO vendas (id_usuario, data_venda, preco_total, forma_pagamento, origem)
                VALUES (?, NOW(), ?, ?, ?)
            `;
            const [resultVenda] = await connection.query(vendaSql, [
                dadosVenda.id_usuario,
                dadosVenda.preco_total,
                dadosVenda.forma_pagamento,
                dadosVenda.origem
            ]);
            const id_venda = resultVenda.insertId;

            // 2. Inserir na tabela 'itens'
            const itensParaInserir = dadosVenda.itens.map(item => ({
                id_venda: id_venda,
                id_produto: item.id_produto,
                tipo: 'produto',
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario
            }));
            await Item.criarVarios(itensParaInserir, connection);

            // 3. Atualizar o estoque na tabela 'produtos_diversos'
            await Produto.atualizarEstoque(dadosVenda.itens, connection);

            // Se tudo deu certo, confirma a transação
            await connection.commit();
            console.log(`Venda ${id_venda} criada com sucesso.`);
            return id_venda;

        } catch (error) {
            // Se algo deu errado, desfaz todas as operações
            await connection.rollback();
            console.error("Erro ao criar venda, transação revertida.", error);
            throw error; // Lança o erro para o controller tratar
        } finally {
            // Libera a conexão de volta para o pool
            connection.release();
        }
    }

    static async buscarPorUsuario(id_usuario) {
        const sql = 'SELECT * FROM vendas WHERE id_usuario = ? ORDER BY data_venda DESC';
        try {
            const [vendas] = await db.query(sql, [id_usuario]);
            return vendas;
        } catch (error) {
            console.error(`Erro ao buscar vendas do usuário ${id_usuario}:`, error);
            throw error;
        }
    }
}

module.exports = Venda;