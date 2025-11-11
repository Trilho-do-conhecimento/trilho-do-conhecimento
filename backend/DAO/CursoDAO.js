const Curso = require('../models/Curso');
const Turma = require('../models/Turma');

const CursoDAO = {
  async criar(dados) {
    return await Curso.create(dados);
  },

  async buscarTodos() {
    return await Curso.findAll(
      { 
        //include: 
        //{ 
        //  model: Turma, 
        //  as: 'Turmas' 
        //} 
      });
  },

  async buscarPorId(id_curso) {
    return await Curso.findByPk(id_curso, 
      {
         include: 
        {
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
  }
};

module.exports = CursoDAO;
