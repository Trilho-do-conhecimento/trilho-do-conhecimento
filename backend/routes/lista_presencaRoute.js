// a route de lista de presença é uma so tanto pra a lista completa ou apenas por usuario
const express = require('express'); 
const router = express.Router(); 
const ListaPresencaDAO = require('../DAO/ListaPresencaDAO'); 
const ListaPresencaUsuarioDAO = require('../DAO/ListaPresencaUsuarioDAO'); 
const logger = require('../logs/logger.js')

//enum 
const StatusAssinatura = { 
    PRESENTE: 'Presente', 
    AUSENTE: 'Ausente', 
    JUSTIFICADO: 'Justificado' 
}; 

router.post('/', async (req, res) => { 
    try { 
        const lista = await ListaPresencaDAO.criar(req.body); 
        logger.info("Nova lista criada com sucesso.")
        res.status(201).json(lista); 

    } catch (err) { 
        logger.error("Erro ao criar lista", err);
        res.status(500).json({ error: 'Não foi possível criar a lista.' }); 

    } 
}); 

//get -listar
router.get('/', async (req, res) => { 

    try { 
        const listas = await ListaPresencaDAO.buscarTodos({ includeAlunos: true }); 
        res.json(listas); 

    } catch (err) { 
        logger.error("Erro ao listar listas.", err);
        res.status(500).json({ error: 'Erro ao buscar listas de presença.' }); 

    } 
}); 

//get by id - listar
router.get('/:id', async (req, res) => { 

    try { 
        const lista = await ListaPresencaDAO.buscarPorId(req.params.id, { includeAlunos: true }); 
        if (!lista) {
            logger.warn(`Atenção: lista id ${req.params.id} não encontrada (404).`);
            return res.status(404).json({ error: 'Lista não encontrada.' }); 
        }    
        res.json(lista); 

    } catch (err) { 
        logger.error("Erro ao buscar lista.", err);
        res.status(500).json({ error: 'Erro ao buscar lista de presença.' }); 
    } 
});

//put - atualizar
router.put('/:id', async (req, res) => { 

    try { 
        const listaAtualizada = await ListaPresencaDAO.atualizar(req.params.id, req.body); 
        res.json(listaAtualizada); 

    } catch (err) { 
        logger.error("Erro ao atualizar lista:", err); 
        if (err.message.includes('não encontrada')) { 
            res.status(404).json({ error: err.message }); 
            logger.error("Erro ao atualizar lista (404):", err); 

        } else { 
            res.status(500).json({ error: 'Erro ao atualizar a lista de presença.' }); 
            logger.error("Erro ao atualizar lista (404):", err); 
        } 
    } 
}); 

// atualiza individualmente
router.put('/:id/aluno/:id_usuario', async (req, res) => { 

    try { 
        const { status_assinatura } = req.body; 
        if (!Object.values(StatusAssinatura).includes(status_assinatura)) { 
            logger.error("Status status inválido", error);
            return res.status(400).json({ error: 'Status inválido.' }); 

        } 

        const atualizado = await ListaPresencaUsuarioDAO.atualizarStatus( 
            req.params.id, 
            req.params.id_usuario, 
            status_assinatura 

        ); 

        if (atualizado === 0) {
            logger.error("Aluno ou lista não encontrado (404):", err); 
            return res.status(404).json({ error: 'Aluno ou lista não encontrado.' }); 
        }

        logger.info("Status atualizado com sucesso!");
        res.json({ message: 'Status atualizado com sucesso!' }); 

    } catch (err) { 
        logger.error("Erro ao atualizar status:", err); 
        res.status(500).json({ error: 'Erro ao atualizar status de presença.' }); 

    } 
}); 

// deletar individualmente
router.delete('/:id', async (req, res) => { 

    try { 
        await ListaPresencaDAO.deletar(req.params.id); 
        logger.warn(`Atenção: falha na tentativa de deletar o lista de presença ID ${req.params.id}. Não encontrado (404).`);
        res.json({ message: 'Lista de presença e registros de alunos deletados com sucesso!' }); 

    } catch (err) { 
        logger.error("Erro ao deletar lista:", err); 
        if (err.message.includes('não encontrada')) { 
            res.status(404).json({ error: err.message }); 
            logger.error("Erro ao deletar lista (404):", err); 
        } else { 
            res.status(500).json({ error: 'Erro ao deletar lista.' }); 
            logger.error("Erro ao deletar lista:", err); 
        } 
    } 
}); 

module.exports = router; 