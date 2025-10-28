const express = require('express');
const router = express.Router();
const TurmaDAO = require('../DAO/TurmaDAO');
const Curso = require('../models/Curso');
const logger = require('../logs/logger.js');
const Usuario = require('../models/Usuario');

// BUSCAR TURMA POR ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const turma = await TurmaDAO.buscarPorId(id);
        if (!turma) {
            logger.warn(`Atenção: turma id ${id} não encontrada (404).`);
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }
        logger.info(`Turma id ${id} encontrada com sucesso`);
        res.json({ data: turma });
    } catch (error) {
        logger.error(`Erro ao buscar turma ${id}`, error);
        res.status(500).json({ error: 'Erro ao buscar turma.' });
    }
});

// ATUALIZAR TURMA
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { horario, local, id_curso, id_instrutor } = req.body;

    try {
        const turmaExistente = await TurmaDAO.buscarPorId(id);
        if (!turmaExistente){
            logger.warn(`Atenção: falha na tentativa de atualizar turma id ${id}. Turma não encontrada (404).`);
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }

        if (id_curso) {
            const curso = await Curso.findByPk(id_curso);
            if (!curso){
                logger.warn(`Atenção: falha na tentativa de atualizar turma. Curso id ${id} não encontrado (404).`);
                return res.status(404).json({ error: 'Curso não encontrado.' });
            }
        }

        if (id_instrutor) {
            const instrutor = await Usuario.findByPk(id_instrutor);
            if (!instrutor){
                logger.warn(`Atenção: falha na tentativa de atualizar turma. Instrutor id ${id} não encontrado (404).`);
                return res.status(404).json({ error: 'Instrutor não encontrado.' });
            }
        }

        // Atualiza turma
        const turmaAtualizada = await TurmaDAO.atualizar(id, {
            horario: horario ? new Date(horario) : undefined,
            local,
            id_curso,
            id_instrutor
        });

        logger.info(`Turma id ${id} atualizada com sucesso!`);

        res.json({
            message: 'Turma atualizada com sucesso!',
            data: turmaAtualizada
        });
    } catch (error) {
        logger.error(`Erro ao atualizar turma id ${id}`, error)
        res.status(500).json({ error: error.message });
    }
});

// DELETAR TURMA 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await TurmaDAO.deletar(id);
        logger.info(`Turma id ${id} excluida com sucesso!`);
        res.json({ message: "Turma excluída com sucesso!" });

    } catch (error) {
        logger.error(`Erro ao atualizar turma id ${id}`, error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;