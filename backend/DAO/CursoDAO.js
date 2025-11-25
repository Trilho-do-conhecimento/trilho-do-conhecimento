const Curso = require('../models/Curso');
const Turma = require('../models/Turma');
const AlunoTurma = require('../models/AlunoTurma'); // Precisa desse model
const { Op } = require('sequelize');

const CursoDAO = {
  async criar(dados) {
    return await Curso.create(dados);
  },

  async buscarTodos() {
    return await Curso.findAll();
  },

  async buscarPorUsuario(idUsuario) {
    if (!idUsuario) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const cursos = await Curso.findAll({
        attributes: ['id_curso', 'nome', 'data_inicio', 'data_termino', 'status', 'area', 'carga_horaria'],
        order: [['data_inicio', 'DESC']],
        raw: true
      });

      console.log(`${cursos.length} cursos encontrados`);
      return cursos;
    } catch (error) {
      console.error('Erro ao buscar cursos por usuário:', error);
      throw new Error('Erro ao buscar cursos do usuário');
    }
  },

  async buscarPorId(id_curso) {
    return await Curso.findByPk(id_curso, {
      include: {
        model: Turma,
        as: 'Turmas'
      }
    });
  },

  async atualizar(id_curso, novosDados) {
    const curso = await Curso.findByPk(id_curso);
    if (!curso) throw new Error('Curso não encontrado');
    await curso.update(novosDados);
    return curso;
  },

  async deletar(id_curso) {
    const curso = await Curso.findByPk(id_curso);
    if (!curso) throw new Error('Curso não encontrado');
    await curso.destroy();
    return true;
  },

  async buscarTodosSimples() {
    try {
      const cursos = await Curso.findAll({
        attributes: ['id_curso', 'nome', 'data_inicio', 'data_termino', 'status', 'area', 'carga_horaria'],
        raw: true
      });
      return cursos;
    } catch (error) {
      console.error('Erro ao buscar cursos simples:', error);
      throw new Error('Erro ao buscar cursos');
    }
  }
};

module.exports = CursoDAO;