// A rota de lista de presença é uma só — tanto para a lista completa quanto por usuário
const express = require('express'); 
const router = express.Router(); 
const ListaDePresencaController = require('../frontend/js/controllers/criarListaPresencaController'); 
const logger = require('../logs/logger');
const authMiddleware = require('../middlewares/authMiddleware'); // se quiser proteger as rotas

// Enum de status 
const StatusAssinatura = { 
    PRESENTE: 'Presente', 
    AUSENTE: 'Ausente', 
    JUSTIFICADO: 'Justificado' 
}; 

// Rotas de Lista de Presença

// POST - criar nova lista
router.post('/', authMiddleware, (req, res) => {
    ListaDePresencaController.criar(req, res);
});

// GET - listar todas as listas
router.get('/', authMiddleware, (req, res) => {
    ListaDePresencaController.buscarTodas(req, res);
});

// GET - listar por ID
router.get('/:id', authMiddleware, (req, res) => {
    ListaDePresencaController.buscarPorId(req, res);
});

// PUT - atualizar lista completa
router.put('/:id', authMiddleware, (req, res) => {
    ListaDePresencaController.atualizar(req, res);
});

// PUT - atualizar status individual de aluno
router.put('/:id/aluno/:id_usuario', authMiddleware, (req, res) => {
    // Envia o enum para validação dentro do Controller/Service
    req.StatusAssinatura = StatusAssinatura;
    ListaDePresencaController.atualizarStatusAluno(req, res);
});

// DELETE - deletar lista completa
router.delete('/:id', authMiddleware, (req, res) => {
    ListaDePresencaController.deletar(req, res);
});

// NOVO: Rota POST para aplicar filtros
router.post('/filtrar', authMiddleware, (req, res) => {
    ListaDePresencaController.filtrar(req, res);
});

module.exports = router;
