const express = require('express');
const router = express.Router();
const Certificado = require('../models/Certificado.js');  //importa model e bd
const Usuario = require('../models/Usuario.js'); // relacionamento - saber se foi concluido o curso ou n
const db = require("../connectionFactory/connectionFactory.js")

//POST - criação de um novo certificado
router.post('/', async (req, res) => {

    const { certificador1, registro_c1, cargo_c1, id_concluinte, nome_certificado, descricao } = req.body;

    try {
        const novoCertificado = await Certificado.create({
            certificador1,
            registro_c1,
            cargo_c1,
            id_concluinte,
            nome_certificado,
            descricao
        });
        res.status(201).json({ 
            id_certificado: novoCertificado.id_certificado, 
            nome_certificado: novoCertificado.nome_certificado,
            id_concluinte: novoCertificado.id_concluinte //concluido
        });

    } catch (error) {
        console.error("Erro ao criar certificado:", error);
        res.status(500).json({ error: 'Não foi possível criar o certificado. Verifique a chave estrangeira (Concluinte).' });
    }
});

//GET - listar todos os certificados ou por id
router.get('/', async (req, res) => {

    try {
        const certificados = await Certificado.findAll({
            attributes: ['id_certificado', 'nome_certificado', 'certificador1', 'cargo_c1'],
            include: [
                { model: Usuario, attributes: ['nome_completo'], foreignKey: 'id_concluinte' }
            ]
        });
        res.json(certificados);

    } catch (error) {
        console.error("Erro ao listar certificados:", error);
        res.status(500).json({ error: 'Erro ao buscar certificados.' });
    }
});

router.get('/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const certificado = await Certificado.findByPk(id, {
            include: [
                { model: Usuario, attributes: ['nome_completo', 'registro', 'cargo', 'area'], foreignKey: 'id_concluinte' }
            ]
        });
        if (!certificado) {
            return res.status(404).json({ error: 'Certificado não encontrado.' });
        }
        res.json(certificado);

    } catch (error) {
        console.error("Erro ao buscar certificado por ID:", error);
        res.status(500).json({ error: 'Erro ao buscar certificado.' });
    }
});

//PUT - atualizar certificado --> não sei se é necessario qualquer coisa a gnt apaga
router.put('/:id', async (req, res) => {

    const { id } = req.params;
    const novosDados = req.body;
    
    try {
        const [numRowsUpdated] = await Certificado.update(novosDados, {
            where: { id_certificado: id }
        });
        if (numRowsUpdated === 0) {
            return res.status(404).json({ error: 'Certificado não encontrado ou nenhum dado para atualizar.' });
        }
        res.json({ message: 'Certificado atualizado com sucesso!' });

    } catch (error) {
        console.error("Erro ao atualizar certificado:", error);
        res.status(500).json({ error: 'Erro ao atualizar certificado. Verifique a chave estrangeira.' });
    }
});

//DELETE - deleta certificado --> não sei se é necessario qualquer coisa a gnt apaga
router.delete('/:id', async (req, res) => {

    const { id } = req.params;
    
    try {
        const numRowsDeleted = await Certificado.destroy({
            where: { id_certificado: id }
        });
        if (numRowsDeleted === 0) {
            return res.status(404).json({ error: 'Certificado não encontrado.' });
        }
        res.json({ message: 'Certificado excluído com sucesso.' });
        
    } catch (error) {
        console.error("Erro ao deletar certificado:", error);
        res.status(500).json({ error: 'Erro ao excluir certificado.' });
    }
});

module.exports = router;