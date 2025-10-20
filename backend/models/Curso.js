const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory');
const Turma = require('./Turma');

const Curso = sequelize.define('Curso', {
  id_curso: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  nome: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
    
  },
  data_inicio: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 

  },
  data_termino: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 

  },
  status: { 
    type: DataTypes.ENUM('concluido','em andamento','cancelado'), 
    allowNull: false 

  },
  area: { 
    type: DataTypes.STRING(100), 
    allowNull: false 

  },
  carga_horaria: { 
    type: DataTypes.INTEGER, 
    allowNull: false 

  }
}, 
{
  tableName: 'curso',
  timestamps: false
});

module.exports = Curso;
