const sequelize = require('../connectionFactory/connectionFactory.js'); // conexão com o bd

// Importação das models
const Usuario = require('./Usuario');
const Curso = require('./Curso');
const Turma = require('./Turma');
const Certificado = require('./Certificado');
const Lista_presenca = require('./Lista_presenca');
const Lista_presenca_usuario = require('./lista_presenca_usuario');
const AlunoTurma = require('/backend/models/AlunoTurma.js'); // NOVO

// Relacionamento Professor – Turma
Usuario.hasMany(Turma, { 
    foreignKey: 'id_instrutor',
    as: 'TurmasMinistradas' 
});
Turma.belongsTo(Usuario, {
    foreignKey: 'id_instrutor',
    as: 'Instrutor'
});

// Curso – Turma (1:N)
Curso.hasMany(Turma, {
    foreignKey: 'id_curso',
    as: 'Turmas',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Turma.belongsTo(Curso, {
    foreignKey: 'id_curso',
    as: 'Curso'
});

// NOVO: Turma – AlunoTurma (1:N)
Turma.hasMany(AlunoTurma, {
    foreignKey: 'id_turma',
    as: 'AlunosTurma'
});

AlunoTurma.belongsTo(Turma, {
    foreignKey: 'id_turma',
    as: 'Turma'
});

// NOVO: Usuario – AlunoTurma (1:N)
Usuario.hasMany(AlunoTurma, {
    foreignKey: 'id_usuario',
    as: 'MinhasTurmas'
});

AlunoTurma.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'Aluno'
});

// Aluno – Certificado 
Usuario.hasMany(Certificado, {
    foreignKey: 'id_concluinte',
    as: 'Certificados'
});
Certificado.belongsTo(Usuario, {
    foreignKey: 'id_concluinte',
    as: 'Concluinte'
});

// Presença - Turma
Turma.hasMany(Lista_presenca, {
    foreignKey: 'id_turma',
    as: 'Listas_presencas'
});
Lista_presenca.belongsTo(Turma, {
    foreignKey: 'id_turma',
    as: 'Turma'
});

// Lista de Presença - Aluno
Usuario.belongsToMany(Lista_presenca, {
    through: Lista_presenca_usuario,
    foreignKey: 'id_usuario',
    otherKey: 'id_lista',
    as: 'ListasPresenca'
});

Lista_presenca.belongsToMany(Usuario, {
    through: Lista_presenca_usuario,
    foreignKey: 'id_lista',
    otherKey: 'id_usuario',
    as: 'Alunos'
});

Lista_presenca_usuario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Lista_presenca_usuario.belongsTo(Lista_presenca, { foreignKey: 'id_lista' });

// Exportação das model e conexão de arquivos
module.exports = {
    sequelize,
    Usuario,
    Curso,
    Turma,
    Certificado,
    Lista_presenca,
    Lista_presenca_usuario,
    AlunoTurma // NOVO
};