const ListaDePresencaService = require('../services/criarListaPresencaService');
const logger = require('../../../logs/logger');

class ListaDePresencaController {
  static async filtrar(req, res) {
        try {
            const filtros = req.body;
            const alunosFiltrados = await ListaDePresencaService.filtrarAlunos(filtros);
            
            res.json({
                sucesso: true,
                participantes: alunosFiltrados
            });
        } catch (err) {
            logger.error("Erro ao aplicar filtros na lista de presença:", err);
            res.status(500).json({ 
                sucesso: false, 
                error: 'Não foi possível aplicar os filtros na lista.' 
            });
        }
    }
  static async criar(req, res) {
    try {
      const resultado = await ListaDePresencaService.criar(req.body);
      logger.info("Nova lista criada com sucesso.");
      res.status(201).json(resultado);
    } catch (err) {
      logger.error("Erro ao criar lista", err);
      res.status(500).json({ error: 'Não foi possível criar a lista.' });
    }
  }

  static async buscarTodas(req, res) {
    try {
      const listas = await ListaDePresencaService.buscarTodas();
      res.json(listas);
    } catch (err) {
      logger.error("Erro ao listar listas.", err);
      res.status(500).json({ error: 'Erro ao buscar listas de presença.' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const lista = await ListaDePresencaService.buscarPorId(req.params.id);
      if (!lista) {
        logger.warn(`Lista id ${req.params.id} não encontrada.`);
        return res.status(404).json({ error: 'Lista não encontrada.' });
      }
      res.json(lista);
    } catch (err) {
      logger.error("Erro ao buscar lista.", err);
      res.status(500).json({ error: 'Erro ao buscar lista de presença.' });
    }
  }

  static async atualizar(req, res) {
    try {
      const listaAtualizada = await ListaDePresencaService.atualizar(req.params.id, req.body);
      res.json(listaAtualizada);
    } catch (err) {
      logger.error("Erro ao atualizar lista:", err);
      if (err.message.includes('não encontrada')) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar lista de presença.' });
      }
    }
  }

  static async atualizarStatusAluno(req, res) {
    try {
      const { status_assinatura } = req.body;
      const { id, id_usuario } = req.params;
      const StatusAssinatura = req.StatusAssinatura;

      // validação do enum
      if (!Object.values(StatusAssinatura).includes(status_assinatura)) {
        logger.error(`Status inválido recebido: ${status_assinatura}`);
        return res.status(400).json({ error: 'Status inválido.' });
      }

      const atualizado = await ListaDePresencaService.atualizarStatusAluno(id, id_usuario, status_assinatura);

      if (atualizado === 0) {
        logger.warn(`Aluno ou lista não encontrado: lista=${id}, usuario=${id_usuario}`);
        return res.status(404).json({ error: 'Aluno ou lista não encontrado.' });
      }

      logger.info(`Status atualizado com sucesso: lista=${id}, usuario=${id_usuario}`);
      res.json({ message: 'Status atualizado com sucesso!' });

    } catch (err) {
      logger.error("Erro ao atualizar status:", err);
      res.status(500).json({ error: 'Erro ao atualizar status de presença.' });
    }
  }

  static async deletar(req, res) {
    try {
      await ListaDePresencaService.deletar(req.params.id);
      logger.info(`Lista ${req.params.id} deletada com sucesso.`);
      res.json({ message: 'Lista de presença deletada com sucesso!' });
    } catch (err) {
      logger.error("Erro ao deletar lista:", err);
      if (err.message.includes('não encontrada')) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Erro ao deletar lista.' });
      }
    }
  }
}

module.exports = ListaDePresencaController;

