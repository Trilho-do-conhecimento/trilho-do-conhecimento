const ListaPresencaUsuario = require('../models/lista_presenca_usuario'); 
const Usuario = require('../models/Usuario'); 
const ListaPresencaUsuarioDAO = { 

    // Adiciona um aluno a uma lista 
    adicionarAluno(id_usuario, nome_completo, registro, cargo, area, tipo_usuario, status_assinatura) { 
        return ListaPresencaUsuario.create(id_usuario, nome_completo, registro, cargo, area, tipo_usuario, status_assinatura); 
    }, 

    // Atualiza o status de assinatura de um aluno em uma lista 
    async atualizarStatus(id_lista, id_usuario, status_assinatura) { 
        const [numRowsUpdated] = await ListaPresencaUsuario.update( 
            { status_assinatura }, 
            { where: { id_lista, id_usuario } } 
        ); 
        return numRowsUpdated; // retorna 0 se nada foi atualizado 
    }, 

    // Deleta todos os registros de alunos de uma lista 
    deletarPorLista(id_lista) { 
        return ListaPresencaUsuario.destroy({ where: { id_lista } }); 
    }, 

    // Opcional: busca os alunos de uma lista 
    buscarAlunosPorLista(id_lista) { 
        return ListaPresencaUsuario.findAll({ 
            where: { id_lista } 
        }); 
    } 
}; 

module.exports = ListaPresencaUsuarioDAO; 