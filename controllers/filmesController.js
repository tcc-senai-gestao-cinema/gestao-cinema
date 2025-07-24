// controllers/filmeControllers.js
const Filme = require('../models/Filme');

const filmeController = {
    async getAllFilmes(req, res) {
        try {
            const filmes = await Filme.findAll();
            res.json(filmes);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            res.status(500).json({ message: 'Erro interno do servidor ao buscar filmes.' });
        }
    },

   async getFilmeById(req, res) {
    try {
        const { id } = req.params;
        const filme = await Filme.findByPk(id);  
        if (filme) {
            res.json(filme);
        } else {
            res.status(404).json({ message: 'Filme não encontrado.' });
        }
    } catch (error) {
        console.error(`Erro ao buscar filme com ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar o filme.' });
    }
}

};

module.exports = filmeController;