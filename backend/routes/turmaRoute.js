const express = require('express');
const router = express.Router();
const TurmaDAO = require('../DAO/TurmaDAO');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');

// BUSCAR TURMA POR ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const turma = await TurmaDAO.buscarPorId(id);
        if (!turma) 
            return res.status(404).json({ error: 'Turma não encontrada.' }); 
            res.json({ data: turma });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar turma.' });
    }
});

// ATUALIZAR TURMA
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { horario, local, id_curso, id_instrutor } = req.body;

    try {
        const turmaExistente = await TurmaDAO.buscarPorId(id);
        if (!turmaExistente) 
            return res.status(404).json({ error: 'Turma não encontrada.' });

        if (id_curso) {
            const curso = await Curso.findByPk(id_curso);
            if (!curso) 
                return res.status(404).json({ error: 'Curso não encontrado.' });
        }

        if (id_instrutor) {
            const instrutor = await Usuario.findByPk(id_instrutor);
            if (!instrutor) 
                return res.status(404).json({ error: 'Instrutor não encontrado.' });
        }

        // Atualiza turma
        const turmaAtualizada = await TurmaDAO.atualizar(id, {
            horario: horario ? new Date(horario) : undefined,
            local,
            id_curso,
            id_instrutor
        });

        res.json({
            message: 'Turma atualizada com sucesso!',
            data: turmaAtualizada
        });
    } catch (error) {
        if (error.message === 'Turma não encontrada') {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
});

// DELETAR TURMA 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await TurmaDAO.deletar(id);
        res.json({ message: "Turma excluída com sucesso!" });

    } catch (error) {
        if (error.message === 'Turma não encontrada') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;