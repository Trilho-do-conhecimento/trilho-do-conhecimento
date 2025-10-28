const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CursoDAO = require('../DAO/CursoDAO');
const Turma = require('../models/Turma');
const logger = require('../logs/logger.js')

// POST - criar novo curso
router.post(
  '/',
  [ //camada de validação de dados garante que os dados enviados pelo cliente no corpo da requisição atendam a critérios específicos 
    //antes de serem processados e salvos.
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('data_inicio').isDate().withMessage('Data de início inválida'),
    body('data_termino').isDate().withMessage('Data de término inválida'),
    body('status').isIn(['concluido','em andamento','cancelado'])
      .withMessage('Status inválido'),
    body('area').notEmpty().withMessage('Área é obrigatória'),
    body('carga_horaria').isInt({ min: 1 }).withMessage('Carga horária deve ser um número positivo')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Atenção: falha na tentativa de criação de curso. O formulário possui campos não preeenchidos.', {
        errors: errors.array(),
        body: req.body
      });
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const novoCurso = await CursoDAO.criar(req.body);
      res.status(201).json({ success: true, data: novoCurso });
      logger.info("Curso criado com sucesso!", {
        cursoID: novoCurso.id,
        nome: novoCurso.nome
      })
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      logger.error("Erro ao criar curso", error);
      res.status(500).json({ success: false, error: 'Não foi possível criar o curso.' });
    }
  }
);

// GET - listar todos os cursos com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { status, area } = req.query;
    let cursos = await CursoDAO.buscarTodos();

    if (status) cursos = cursos.filter(c => c.status === status);
    if (area) cursos = cursos.filter(c => c.area === area);

    res.json({ success: true, data: cursos });
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    logger.error("Erro ao buscar cursos.", error);
    res.status(500).json({ success: false, error: 'Erro ao buscar cursos.' });
  }
});

// GET - buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const curso = await CursoDAO.buscarPorId(req.params.id);
    if (!curso) {
      logger.warn(`Atenção: curso ${req.params.id} não encontrado (404).`)
      return res.status(404).json({ success: false, error: 'Curso não encontrado.' });
    }

    res.json({ success: true, data: curso });

  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    logger.error("Erro ao criar curso", error);
    res.status(500).json({ success: false, error: 'Erro ao buscar curso.' });
  }
});

// PUT - atualizar curso
router.put(
  '/:id',
  [
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('data_inicio').optional().isDate().withMessage('Data de início inválida'),
    body('data_termino').optional().isDate().withMessage('Data de término inválida'),
    body('status').optional().isIn(['concluido','em andamento','cancelado']).withMessage('Status inválido'),
    body('area').optional().notEmpty().withMessage('Área não pode ser vazia'),
    body('carga_horaria').optional().isInt({ min: 1 }).withMessage('Carga horária deve ser positiva')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Atenção: falha na tentativa de atualizar curso ID ${req.params.id}.`, {
        errors: errors.array()
      });
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const cursoAtualizado = await CursoDAO.atualizar(req.params.id, req.body);
      logger.info(`Curso atualizado com sucesso!`, {
        cursoID: req.params.id
      })
      
      res.json({ success: true, data: cursoAtualizado });

    } catch (error) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ success: false, error: error.message });
        logger.error(`Falha na tentativa de atualização do curso ${req.params.id}. Curso não encontrado (404).`)
      } else {
        console.error("Erro ao atualizar curso:", error);
        logger.error("Error ao tentar atualizar curso", error)
        res.status(500).json({ success: false, error: 'Erro ao atualizar curso.' });
      }
    }
  }
);


// DELETE - excluir curso
router.delete('/:id', async (req, res) => {
  try {
    await CursoDAO.deletar(req.params.id);
    res.status(204).send();
    logger.info(`Curso id ${req.params.id} excluido com sucesso.`)
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      res.status(404).json({ success: false, error: error.message });
      logger.warn(`Atenção: falha na tentativa de deletar o curso ID ${req.params.id}. Não encontrado (404).`)
    } else {
      console.error("Erro ao excluir curso:", error);
      logger.error("Error ao excluir curso", error);
      res.status(500).json({ success: false, error: 'Erro ao excluir. Pode haver turmas vinculadas a este curso.' });
    }
  }
});

module.exports = router;
