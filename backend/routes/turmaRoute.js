const express = require('express');
const router = express.Router();
const Turma = require('../models/Turma.js'); // Importa a Model e bd
const Curso = require('../models/Curso.js'); // tem que importar a model de curso e usuario tambem por causa dos Relacionamentos
const Usuario = require('../models/Usuario.js'); 
const db = require("../connectionFactory/connectionFactory.js")

//POST - criação de novas turmas
router.post('/', async (req, res) => {

    const { horario, local, id_curso, id_instrutor } = req.body;

    try {
        const novaTurma = await Turma.create({
            horario,
            local,
            id_curso,
            id_instrutor
        });
        res.status(201).json({ 
            id_turma: novaTurma.id_turma, 
            local: novaTurma.local,
            id_curso: novaTurma.id_curso //relacionamento com curso
        });

    } catch (error) {
        console.error("Erro ao criar turma:", error);
        res.status(500).json({ error: 'Não foi possível criar a turma. Verifique as chaves estrangeiras (Curso, Instrutor).' });
    }
});

//GET - listar todas as turmas ou uma especifica por id
router.get('/', async (req, res) => {

    try {
        const turmas = await Turma.findAll({
            include: [
                { model: Curso, attributes: ['nome', 'area'] }, //inclui o curso e o instrutor
                { model: Usuario, as: 'Instrutor', attributes: ['nome_completo', 'registro'] }
            ]
        });
        res.json(turmas);

    } catch (error) {
        console.error("Erro ao listar turmas:", error);
        res.status(500).json({ error: 'Erro ao buscar turmas.' });
    }
});

router.get('/:id', async (req, res) => { //por id

    const { id } = req.params;
    
    try {
        const turma = await Turma.findByPk(id, {
            include: [
                { model: Curso, attributes: ['nome', 'area', 'carga_horaria'] },//inclui o curso e o instrutor
                { model: Usuario, as: 'Instrutor', attributes: ['nome_completo', 'cargo', 'area'] }
            ]
        });
        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }
        res.json(turma);

    } catch (error) {
        console.error("Erro ao buscar turma por ID:", error);
        res.status(500).json({ error: 'Erro ao buscar turma.' });
    }
});

//PUT - atualiza as turmas
router.put('/:id', async (req, res) => {

    const { id } = req.params;
    const novosDados = req.body;
    
    try {
        const [numRowsUpdated] = await Turma.update(novosDados, {
            where: { id_turma: id }
        });
        
        if (numRowsUpdated === 0) {
            return res.status(404).json({ error: 'Turma não encontrada ou nenhum dado para atualizar.' });
        }
        res.json({ message: 'Turma atualizada com sucesso!' })
        ;
    } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        res.status(500).json({ error: 'Erro ao atualizar turma. Verifique as chaves estrangeiras.' });
    }
});

//DELETE - deleta a turma 
router.delete('/:id', async (req, res) => {

    const { id } = req.params;
    
    try {
        const numRowsDeleted = await Turma.destroy({
            where: { id_turma: id }
        });
        
        if (numRowsDeleted === 0) {
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }
        res.json({ message: 'Turma excluída com sucesso.' });

    } catch (error) {
        console.error("Erro ao deletar turma:", error);
        res.status(500).json({ error: 'Erro ao excluir. Pode haver listas de presença vinculadas a esta turma.' });
    }
});

module.exports = router;