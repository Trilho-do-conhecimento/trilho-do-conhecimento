const ListaPresencaDAO = require('../../../DAO/lista_presencaDAO');
const ListaPresencaUsuarioDAO = require('../../../DAO/lista_presenca_usuarioDAO');

class ListaDePresencaService {
  static async criar(body) {
    return await ListaPresencaDAO.criar(body);
  }

  static async buscarTodas() {
    return await ListaPresencaDAO.buscarTodos({ includeAlunos: true });
  }

  static async buscarPorId(id) {
    return await ListaPresencaDAO.buscarPorId(id, { includeAlunos: true });
  }

  static async atualizar(id, body) {
    return await ListaPresencaDAO.atualizar(id, body);
  }

  static async atualizarStatusAluno(id, id_usuario, status_assinatura) {
    return await ListaPresencaUsuarioDAO.atualizarStatus(id, id_usuario, status_assinatura);
  }

  static async deletar(id) {
    return await ListaPresencaDAO.deletar(id);
  }
}

module.exports = ListaDePresencaService;


