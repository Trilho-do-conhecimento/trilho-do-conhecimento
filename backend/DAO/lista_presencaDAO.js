const ListaPresenca = require('../models/ListaPresenca'); 
const Usuario = require('../models/Usuario'); 
const ListaPresencaUsuario = require('../models/ListaPresencaUsuario'); 
const Turma = require('../models/Turma'); 
const Curso = require('../models/Curso');

const ListaPresencaDAO = { 
    // Criar lista de presença 
    criar(listaData) { 
        return ListaPresenca.create(listaData); 
    }, 


    // Buscar todas as listas 
    buscarTodos(options = { includeAlunos: false }) { 
        const include = [ 
            { 
                model: Turma, 
                attributes: ['local','horario'],
                include: [ //tem q incluir o curso dentro da turma
                    { 
                    model: Curso, 
                    attributes: ['nome', 'data_inicio', 'data_termino', 'status'] 
                }]
            } 
        ]; 

        if (options.includeAlunos) { 
            include.push({ 
                model: Usuario, 
                through: { attributes: ['status_assinatura'] }, 
                attributes: ['id_usuario', 'nome_completo', 'registro', 'cargo', 'area', 'tipo_usuario'], 
                as: 'alunos' 
            }); 
        } 
        return ListaPresenca.findAll({ include }); 
    }, 

    // Buscar lista por ID 
    buscarPorId(id_lista, options = { includeAlunos: false }) { 
        const include = [ 
            { 
                model: Turma, Curso, //não sei se fiz certo qlq coisa alg arruma - by lari
                attributes: ['local', 'horario'],
                include: [ //tem q incluir o curso dentro da turma
                    { 
                    model: Curso, 
                    attributes: ['nome', 'data_inicio', 'data_termino', 'status'] 
                }]
            } 
        ]; 

        if (options.includeAlunos) { 
            include.push({ 
                model: Usuario, 
                through: { attributes: ['status_assinatura'] }, 
                attributes: ['id_usuario', 'nome_completo', 'registro'], 
                as: 'alunos' 
            }); 
        } 

        return ListaPresenca.findByPk(id_lista, { include }); 
    }, 

    // Atualizar lista 
    async atualizar(id_lista, novosDados) { //tenho que add os dados dos alunos aq???
        const lista = await ListaPresenca.findByPk(id_lista); 
        if (!lista) throw new Error('Lista de presença não encontrada'); 
        return lista.update(novosDados); 
    }, 

    // Deletar lista e registros de alunos 
    async deletar(id_lista) { 
        await ListaPresencaUsuario.destroy({ where: { id_lista } }); 
        const numRowsDeleted = await ListaPresenca.destroy({ where: { id_lista } }); 
        if (numRowsDeleted === 0) throw new Error('Lista de presença não encontrada'); 
        return true; 
    } 
}; 

module.exports = ListaPresencaDAO; 