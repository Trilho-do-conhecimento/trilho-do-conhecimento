const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso.js'); //importa model e bd
const db = require("../connectionFactory/connectionFactory.js")

//POST - cria novo curso
router.post('/', async (req, res) => {
    const { nome, data_inicio, data_termino, status, area, carga_horaria } = req.body;
    try {
        const novoCurso = await Curso.create({
            nome,
            data_inicio,
            data_termino,
            status,
            area,
            carga_horaria
        });
        res.status(201).json({ 
            id_curso: novoCurso.id_curso, 
            nome: novoCurso.nome 
        });
    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).json({ error: 'Não foi possível criar o curso.' });
    }
});

//GET - lista todos os cursos ou algum especifico por id
router.get('/', async (req, res) => { //todos os cursos

    try {
        const cursos = await Curso.findAll({
            attributes: ['id_curso', 'nome', 'status', 'area', 'carga_horaria', 'data_inicio', 'data_termino']
        });
        res.json(cursos);

    } catch (error) {
        console.error("Erro ao listar cursos:", error);
        res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }
});

router.get('/:id', async (req, res) => { //por id

    const { id } = req.params;

    try {
        const curso = await Curso.findByPk(id); //retorna todos os atributos de curso do id especifico
        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado.' });
        }
        res.json(curso);

    } catch (error) {
        console.error("Erro ao buscar curso por ID:", error);
        res.status(500).json({ error: 'Erro ao buscar curso.' });
    }
});

//PUT - atualiza alguma informação do curso
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const novosDados = req.body;
    
    try {
        const [numRowsUpdated] = await Curso.update(novosDados, {
            where: { id_curso: id }
        });
        
        if (numRowsUpdated === 0) {
            return res.status(404).json({ error: 'Curso não encontrado ou nenhum dado para atualizar.' });
        }
        res.json({ message: 'Curso atualizado com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar curso:", error);
        res.status(500).json({ error: 'Erro ao atualizar curso.' });
    }
});

//DELETE - deleta o curso
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const numRowsDeleted = await Curso.destroy({
            where: { id_curso: id }
            
        });
        if (numRowsDeleted === 0) {
            return res.status(404).json({ error: 'Curso não encontrado.' });
        }
        res.json({ message: 'Curso excluído com sucesso.' });

    } catch (error) {
        console.error("Erro ao deletar curso:", error);
        // Sugestão de erro para Foreign Key (Chave Estrangeira)
        res.status(500).json({ error: 'Erro ao excluir. Pode haver turmas vinculadas a este curso.' });
    }
});

module.exports = router;