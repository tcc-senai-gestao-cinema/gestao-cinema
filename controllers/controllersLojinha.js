
const Produto = require('../models/Produto');
// Os outros models (Venda, Item) continuam iguais.

// ATENÇÃO: Esta função mudou. Agora ela se chama 'listarProdutos'
// e funciona como um endpoint de API.
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.listarDisponiveis();
        // Em vez de res.render, enviamos os dados como JSON.
        res.status(200).json(produtos);
    } catch (error) {
        console.error("Erro ao listar produtos via API:", error);
        res.status(500).json({ mensagem: "Erro ao buscar produtos." });
    }
};

// A função de realizar a compra continua exatamente a mesma,
// pois ela já esperava receber dados JSON e responder com JSON.
exports.realizarCompra = async (req, res) => {
    // ... (nenhuma alteração necessária aqui, pode usar a versão sem auth)
    // Lembre-se de usar o usuário de teste se não tiver login.
    const utilizadorDeTeste = { id_usuario: 1, nome: 'Utilizador Teste' };
    try {
        const { itens, forma_pagamento } = req.body;
        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Carrinho vazio." });
        }

        let precoTotalCalculado = 0;
        const itensValidados = [];
        for (const itemCarrinho of itens) {
            const produtoNoBanco = await Produto.buscarPorId(itemCarrinho.id_produto);
            if (!produtoNoBanco) {
                return res.status(404).json({ sucesso: false, mensagem: `Produto não encontrado.` });
            }
            if (produtoNoBanco.estoque < itemCarrinho.quantidade) {
                return res.status(409).json({ sucesso: false, mensagem: `Estoque insuficiente para "${produtoNoBanco.nome}".` });
            }
            precoTotalCalculado += produtoNoBanco.preco * itemCarrinho.quantidade;
            itensValidados.push({
                id_produto: produtoNoBanco.id_produto,
                quantidade: itemCarrinho.quantidade,
                preco_unitario: produtoNoBanco.preco
            });
        }

        const dadosVenda = {
            id_usuario: utilizadorDeTeste.id_usuario,
            preco_total: precoTotalCalculado,
            forma_pagamento: forma_pagamento || 'Cartão de Crédito',
            origem: 'online',
            itens: itensValidados
        };

        const novaVendaId = await Venda.criar(dadosVenda);
        res.status(201).json({
            sucesso: true,
            vendaId: novaVendaId,
            mensagem: "Compra realizada com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao processar a compra:", error);
        res.status(500).json({ sucesso: false, mensagem: "Ocorreu um erro interno." });
    }
};

// As outras funções (historicoDeCompras, detalhesDaCompra) também não precisam mudar
// se as páginas delas forem renderizadas pelo controller de perfil.
// Se elas também forem estáticas, precisarão seguir o mesmo modelo de API.
