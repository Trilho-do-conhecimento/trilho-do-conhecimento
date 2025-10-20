const express = require('express');
const router = express.Router();
const CertificadoDAO = require('../DAO/CertificadoDAO.js');

// POST - criar certificado
router.post('/', async (req, res) => {
    try {
        const novoCertificado = await CertificadoDAO.criar(req.body);
        res.status(201).json({
            id_certificado: novoCertificado.id_certificado,
            nome_certificado: novoCertificado.nome_certificado,
            id_concluinte: novoCertificado.id_concluinte
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Não foi possível criar o certificado. Verifique a chave estrangeira (Concluinte).' });
    }
});

// GET 
router.get('/', async (req, res) => {
    try {
        const certificados = await CertificadoDAO.buscarTodos();
        res.json(certificados);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar certificados.' });
    }
});

// listar por ID
router.get('/:id', async (req, res) => {
    try {
        const certificado = await CertificadoDAO.buscarPorId(req.params.id);
        if (!certificado) return res.status(404).json({ error: 'Certificado não encontrado.' });
        res.json(certificado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar certificado.' });
    }
});

// PUT - atualizar certificado
router.put('/:id', async (req, res) => {
    try {
        const atualizado = await CertificadoDAO.atualizar(req.params.id, req.body);
        res.json(atualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE - deletar certificado
router.delete('/:id', async (req, res) => {
    try {
        await CertificadoDAO.deletar(req.params.id);
        res.json({ message: 'Certificado excluído com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
