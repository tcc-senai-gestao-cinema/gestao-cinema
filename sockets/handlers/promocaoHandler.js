const { Promocao } = require('../../models/Promocao'); // <-- CORRIGIDO: "Promocao" com "P" maiúsculo
const { Op } = require('sequelize');

module.exports = async (socket) => {
    try {
        const hoje = new Date();
        
        // Esta linha agora vai funcionar
        const promocoes = await Promocao.findAll({
            where: {
                data_inicio: { [Op.lte]: hoje },
                data_fim: { [Op.gte]: hoje },
            },
            order: [['id_promocao', 'DESC']],
        });

        // Envia as promoções encontradas para o cliente que acabou de se conectar
        socket.emit('promocoesAtualizadas', promocoes);

    } catch (error) {
        console.error('❌ Erro: Falha ao buscar promoções!', error);
        // Opcional: informar o cliente sobre o erro
        socket.emit('promocoesAtualizadas', []); // Envia um array vazio em caso de erro
    }
};