const Turma = require('../models/Turma');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');

const TurmaDAO = {

    async criar(turmaData) {
        return await Turma.create(turmaData);
    },

    async buscarTodos() {
        return await Turma.findAll({
            include: [
                { 
                    model: Curso, 
                    as: 'Curso', 
                    attributes: ['nome', 'area', 'carga_horaria'] },
                { 
                    model: Usuario, 
                    as: 'Instrutor', 
                    attributes: ['nome_completo', 'registro', 'cargo'] }
            ]
        });
    },

    async buscarPorId(id_turma) {
        return await Turma.findByPk(id_turma, {
            include: [
                { 
                    model: Curso, 
                    as: 'Curso', 
                    attributes: ['nome', 'area', 'carga_horaria'] },
                { 
                    model: Usuario, 
                    as: 'Instrutor', 
                    attributes: ['nome_completo', 'registro', 'cargo'] }
            ]
        });
    },

    async buscarPorCurso(id_curso) {
        return await Turma.findAll({
            where: { id_curso },
            include: [
                { 
                    model: Curso, 
                    as: 'Curso', 
                    attributes: ['nome', 'area', 'carga_horaria'] },
                { 
                    model: Usuario, 
                    as: 'Instrutor', 
                    attributes: ['nome_completo', 'registro', 'cargo'] }
            ]
        });
    },

    async buscarPorInstrutor(id_instrutor) {
        return await Turma.findAll({
            where: { id_instrutor },
            include: [
                { 
                    model: Curso, 
                    as: 'Curso', 
                    attributes: ['nome', 'area', 'carga_horaria'] },
                { 
                    model: Usuario, 
                    as: 'Instrutor', 
                    attributes: ['nome_completo', 'registro', 'cargo'] }
            ]
        });
    },

    async atualizar(id_turma, novosDados) {
        const turma = await Turma.findByPk(id_turma);
        if (!turma) throw new Error('Turma não encontrada');
        await turma.update(novosDados);
        return turma;
    },

    async deletar(id_turma) {
        const turma = await Turma.findByPk(id_turma);
        if (!turma) throw new Error('Turma não encontrada');
        await turma.destroy();
        return true;
    }
};

module.exports = TurmaDAO;
