
// controllers/sessaoController.js
const Sessao = require('../models/Sessoes'); 


exports.getSessoesPorFilme = async (req, res) => {
  const { id } = req.params;
  try {
    const sessoes = await Sessao.findAll({
      where: { id_filme: id }
    });

    console.log('Sessões encontradas:', sessoes); 
    res.json(sessoes);
    
  } catch (err) {
    console.error('Erro ao buscar sessões:', err);
    res.status(500).json({ erro: 'Erro ao buscar sessões.' });
  }
};
