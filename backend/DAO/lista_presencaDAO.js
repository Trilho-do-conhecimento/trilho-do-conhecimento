const { DataTypes, Op } = require('sequelize');
const ListaPresenca = require('../models/Lista_presenca'); 
const Usuario = require('../models/Usuario'); 
const ListaPresencaUsuario = require('../models/lista_presenca_usuario'); 
const Turma = require('../models/Turma'); 
const Curso = require('../models/Curso');
const sequelize = require('../connectionFactory/connectionFactory')

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
                as: 'Turma',
                attributes: ['local','horario'],
                // include: [ //tem q incluir o curso dentro da turma
                //     { 
                //     model: Curso, 
                //     attributes: ['nome', 'data_inicio', 'data_termino', 'status'] 
                // }]
            } 
        ]; 

        if (options.includeAlunos) { 
            include.push({ 
                model: Usuario, 
                through: { attributes: ['status_assinatura'] }, 
                attributes: ['id_usuario', 'nome_completo', 'registro', 'cargo', 'area', 'tipo_usuario'], 
                as: 'Usuarios' 
            }); 
        } 
        return ListaPresenca.findAll({ include }); 
    }, 

    // Buscar lista por ID 
    buscarPorId(id_lista, options = { includeAlunos: false }) { 
        const include = [ 
            { 
                model: Turma, 
                as: 'Turma', 
                attributes: ['local', 'horario'],
                // include: [ //tem q incluir o curso dentro da turma
                //     { 
                //     model: Curso, 
                //     attributes: ['nome', 'data_inicio', 'data_termino', 'status'] 
                // }]
            } 
        ]; 

        if (options.includeAlunos) { 
            include.push({ 
                model: Usuario,
                through: { attributes: ['status_assinatura'] }, 
                attributes: ['id_usuario', 'nome_completo', 'registro'], 
                as: 'Usuarios' 
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
    },
    
    async filtrarAlunos(filtros) {
        const where = {};
        
        if (filtros.Nome) {
            where.nome_completo = { [Op.like]: `%${filtros.Nome}%` };
        }
        if (filtros.Registro) {
            where.registro = filtros.Registro;
        }
        if (filtros.Cargo) {
            where.cargo = filtros.Cargo;
        }
        if (filtros.Area) {
            where.area = filtros.Area;
        }

        const resultados = await Usuario.unscoped().findAll({
            attributes: ['nome_completo', 'registro', 'cargo', 'area'], 
            where: where, 
            limit: 100
        });
                return resultados.map(usuario => ({
            nome_completo: usuario.nome_completo,
            registro: usuario.registro,
            cargo: usuario.cargo,
            area: usuario.area,
            // datas: usuario.Listas.map(l => l.data).join(', '),
            // assinaturas: usuario.Listas.map(l => l.ListaPresencaUsuario.status_assinatura).join(', '),
        }));
    }
}; 

module.exports = ListaPresencaDAO; 