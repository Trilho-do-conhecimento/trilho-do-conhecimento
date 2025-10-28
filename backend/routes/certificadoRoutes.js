const express = require('express');
const router = express.Router();
const CertificadoDAO = require('../DAO/CertificadoDAO.js');
const logger = require('../logs/logger.js')

// POST - criar certificado
router.post('/', async (req, res) => {
    try {
        const novoCertificado = await CertificadoDAO.criar(req.body);

        logger.info('Novo certificado criado com sucesso!', {
            id_certificado: novoCertificado.id_certificado,
            nome_certificado: novoCertificado.nome_certificado,
            id_concluinte: novoCertificado.id_concluinte
        });

        res.status(201).json({
            id_certificado: novoCertificado.id_certificado,
            nome_certificado: novoCertificado.nome_certificado,
            id_concluinte: novoCertificado.id_concluinte
        });

    } catch (err) {
        console.error('Erro ao criar certificado', err);
        logger.error(err);
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
        logger.error('Erro ao buscar todos os certificados', err);
        res.status(500).json({ error: 'Erro ao buscar certificados.' });
    }
});

// listar por ID
router.get('/:id', async (req, res) => {
    try {
        const certificado = await CertificadoDAO.buscarPorId(req.params.id);
        if (!certificado) {
            logger.warn(`Atenção: Certificado ID ${req.params.id} não encontrado (404).`);
            return res.status(404).json({ error: 'Certificado não encontrado.' });
        }
        res.json(certificado);
    } catch (err) {
        console.error(err);
        logger.error(`Erro ao buscar certificados por id ${req.params.id}`, err);
        res.status(500).json({ error: 'Erro ao buscar certificado.' });
    }
});

// PUT - atualizar certificado
router.put('/:id', async (req, res) => {
    try {
        const atualizado = await CertificadoDAO.atualizar(req.params.id, req.body);

        logger.info("Certificado atualizado com sucesso!", {
            id_certificado: req.params.id
        });

        res.json(atualizado);
    } catch (err) {
        console.error(err);
        logger.error(`Erro ao atualizar certificado ${req.params.id}.`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE - deletar certificado
router.delete('/:id', async (req, res) => {
    try {
        await CertificadoDAO.deletar(req.params.id);
        
        logger.info('Certificado excluido com sucesso!', {
            id_certificado: req.params.id
        });

        res.json({ message: 'Certificado excluído com sucesso.' });
    } catch (err) {
        console.error(err);
        logger.error(`Erro ao deletar certificado ${req.params.id}.`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
