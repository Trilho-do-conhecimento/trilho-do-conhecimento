const express = require('express');
const router = express.Router();
const CertificadoDAO = require('../DAO/CertificadoDAO.js');
const logger = require('../logs/logger.js');
const { gerarCertificadoStream } = require('../../backend/frontend/js/services/certificadoService.js')
const { enviarParaAssinatura } = require('../externalServices/clickSignService.js')

// Função para validar campos obrigatórios 
function validarCamposObrigatorios(body) {
    const obrigatorios = [
        'certificador',
        'registro_certificador',
        'cargo_certificador',
        'id_concluinte',
        'nome_certificado',
        'descricao',
        'nivel',
        'tabela',
        'cidade',
        'data_certificado',
        'normas' 
    ];

    const faltando = obrigatorios.filter(campo => !body[campo]);
    return faltando;
}

// POST - criar certificado
router.post('/', async (req, res) => {
    try {
        // valida campos obrigatórios
        const faltando = validarCamposObrigatorios(req.body);

        if (faltando.length > 0) {
            return res.status(400).json({
                error: 'Campos obrigatórios faltando.',
                campos: faltando
            });
        }

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
        res.status(500).json({
            error: 'Não foi possível criar o certificado. Verifique a chave estrangeira (Concluinte).'
        });
    }
});

// GET - buscar todos
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

// GET - buscar por ID
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

// GET - certificados de um aluno
router.get('/aluno/:id_concluinte', async (req, res) => {
    try {
        const certificados = await CertificadoDAO.buscarPorConcluinte(req.params.id_concluinte);
        res.json(certificados);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar certificados do aluno.' });
    }
});

// GET - download do certificado em PDF
router.get('/:id/download', async (req, res) => {
    try {
        await gerarCertificadoStream(req, res);

    } catch (err) {
        console.error('Erro ao gerar PDF do certificado:', err);
        logger.error(`Erro ao gerar PDF do certificado ${req.params.id}`, err);

        res.status(500).json({
            error: 'Erro ao gerar o PDF do certificado.'
        });
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

// rota da api
router.post('/enviarAssinatura', async (req, res) => {
    try {
        const { fileBase64, filename, signatarios } = req.body;

        console.log('Body recebido:', req.body);

        if (!fileBase64 || !filename) {
            return res.status(400).json();
        }

        const resultado = await enviarParaAssinatura(fileBase64, filename, signatarios);

        console.log("Resultado da função:", resultado);

        if (resultado.success) {
            logger.info('Sucesso! Envelope ID:', resultado.envelopeId);
            res.json(resultado);
        } else {
            res.status(500).json({error: resultado.error});
        }

    } catch (error) {
        logger.error('Erro na rota de assinatura:', error);
        res.status(500).json({error: error.message});
    }
}); 

module.exports = router;
