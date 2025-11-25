const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory.js');

const AlunoTurma = sequelize.define('AlunoTurma', {
  id_turma: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'turma',
      key: 'id_turma'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'id_usuario'
    }
  },
  data_matricula: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ativo', 'concluido', 'em andamento'),
    allowNull: true
  }
}, {
  tableName: 'aluno_turma',
  timestamps: false
});

module.exports = AlunoTurma;