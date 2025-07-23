// controllers/vagasController.js
const Vaga = require('../models/Vaga');

exports.getVagasPorLocal = async (req, res) => {
  const { id_local_de_exibicao } = req.params;

  try {
    const vagas = await Vaga.findAll({
      where: { id_local_de_exibicao },
      attributes: ['id_vaga', 'nome', 'pos_x', 'pos_y', 'status']
    });

    res.json(vagas);
  } catch (err) {
    console.error('Erro ao buscar vagas:', err);
    res.status(500).json({ erro: 'Erro interno ao buscar vagas' });
  }
};
