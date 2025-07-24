
// controllers/programacaoController.js
const programacao = require('../models/programacao'); 


exports.getProgramacoesPorExibicao = async (req, res) => {
  const { id } = req.params;
  try {
    const programacoes = await programacao.findAll({
      where: { id_filme: id }
    });

    console.log('Programações encontradas:', programacoes); 
    res.json(programacoes);
    
  } catch (err) {
    console.error('Erro ao buscar programações:', err);
    res.status(500).json({ erro: 'Erro ao buscar programações.' });
  }
};