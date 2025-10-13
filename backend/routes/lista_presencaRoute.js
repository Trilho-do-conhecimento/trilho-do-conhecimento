// a route de lista de presença é uma so tanto pra a lista completa ou apenas por usuario

const express = require('express');
const router = express.Router();
const ListaPresenca = require('../models/ListaPresenca.js'); // lista em sí
const ListaPresencaUsuario = require('../models/ListaPresencaUsuario.js'); // Relacionamento N:N ( lista e os usuario)
const Turma = require('../models/Turma.js'); //relacionamento e bd
const Usuario = require('../models/Usuario.js'); 
const db = require("../connectionFactory/connectionFactory.js")

//POST - criação de nova lista de presença
router.post('/', async (req, res) => {

    const { data, id_turma } = req.body;

    try {
        const novaLista = await ListaPresenca.create({
            data,
            id_turma
        });
        res.status(201).json({ 
            id_lista: novaLista.id_lista, 
            data: novaLista.data,
            id_turma: novaLista.id_turma
        });

    } catch (error) {
        console.error("Erro ao criar lista de presença:", error);
        res.status(500).json({ error: 'Não foi possível criar a lista de presença. Verifique a chave estrangeira (Turma).' });
    }
});

//GET - listar todas as listas de presença ou apenas por id
router.get('/', async (req, res) => {

    try {
        const listas = await ListaPresenca.findAll({
            include: [
                { model: Turma, attributes: ['local'] }
            ]
        });
        res.json(listas);

    } catch (error) {
        console.error("Erro ao listar listas de presença:", error);
        res.status(500).json({ error: 'Erro ao buscar listas de presença.' });
    }
});

router.get('/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const lista = await ListaPresenca.findByPk(id, {
            include: [
                { model: Turma, attributes: ['local'] },
                { 
                    model: Usuario, 
                    through: { attributes: ['status_assinatura'] }, //ve se foi assinado ou não
                    attributes: ['id_usuario', 'nome_completo', 'registro']
                }
            ]
        });
        if (!lista) {
            return res.status(404).json({ error: 'Lista de Presença não encontrada.' });
        }
        res.json(lista);

    } catch (error) {
        console.error("Erro ao buscar lista de presença por ID:", error);
        res.status(500).json({ error: 'Erro ao buscar lista de presença.' });
    }
});

//PUT - atualiza a presença de um aluno
router.put('/:id/aluno/:idAluno', async (req, res) => {

    const { id, idAluno } = req.params;
    const { status_assinatura } = req.body; // 'Presente', 'Ausente', 'Justificado'
    
    try {
        const [numRowsUpdated] = await ListaPresencaUsuario.update(
            { status_assinatura }, 
            {
                where: { 
                    id_lista: id, 
                    id_usuario: idAluno 
                }
            }
        );
        if (numRowsUpdated === 0) {
            return res.status(404).json({ 
                error: 'Aluno ou Lista não encontrado, ou nenhum dado para atualizar.' 
            });
        }
        res.json({ message: 'Status de presença atualizado com sucesso!' });

    } catch (error) {
        console.error("Erro ao atualizar status de presença:", error);
        res.status(500).json({ error: 'Erro ao atualizar status de presença.' });
    }
});


//DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await ListaPresencaUsuario.destroy({ // exclui as presenças
            where: { id_lista: id }
        });
        const numRowsDeleted = await ListaPresenca.destroy({ //exclui o cabeçalho e tals
            where: { id_lista: id }
        });
        
        if (numRowsDeleted === 0) {
            return res.status(404).json({ error: 'Lista de Presença não encontrada.' });
        }
        res.json({ message: 'Lista de Presença e registros de presença excluídos com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar lista de presença:", error);
        res.status(500).json({ error: 'Erro ao excluir lista de presença.' });
    }
});

module.exports = router;