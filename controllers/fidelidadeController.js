const ProgramaFidelidade = require('../models/ProgramaFidelidade');

exports.adicionarPonto = async (req, res) => {
  const { id_usuario } = req.body;

  let programa = await ProgramaFidelidade.findOne({ where: { id_usuario } });

  if (!programa) {
    await ProgramaFidelidade.create({
      id_usuario,
      regra: '1 ponto por ingresso',
      pontos: 1
    });
  } else {
    programa.pontos += 1;
    await programa.save();
  }

  res.sendStatus(200);
};

exports.obterPontos = async (req, res) => {
  const { id_usuario } = req.params;

  const programa = await ProgramaFidelidade.findOne({ where: { id_usuario } });
  const pontos = programa ? programa.pontos : 0;

  res.json({ pontos });
};

exports.trocarPontos = async (req, res) => {
  const { id_usuario, custo } = req.body;

  const programa = await ProgramaFidelidade.findOne({ where: { id_usuario } });

  if (programa && programa.pontos >= custo) {
    programa.pontos -= custo;
    await programa.save();
    res.json({ sucesso: true });
  } else {
    res.json({ sucesso: false });
  }
};
