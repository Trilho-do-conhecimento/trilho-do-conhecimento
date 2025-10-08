const sequelize = require('../config/database'); // conexão com o bd

// Importação das models
const Usuario = require('/Usuario');
const Curso = require('/Curso');          
const Turma = require('/Turma');
const Certificado = require('/Certificado');
const Lista_presenca = require('/Lista_presenca');
const Lista_presenca_usuario = require('/Lista_presenca_usuario');

// Relacionamento Professor – Turma
Usuario.hasMany(Turma, { 
    foreignKey: 'id_instrutor',
    as: 'TurmasMinistrada' 
});
Turma.belongsTo(Usuario, { //cada turma pertence a um instrutor
    foreignKey: 'id_instrutor',
    as: 'Instrutor'
});

//Curso – Turma (1:N)
Curso.hasMany(Turma, {
    foreignKey: 'id_curso',
    as: 'Turmas'
});
Turma.belongsTo(Curso, {
    foreignKey: 'id_curso',
    as: 'Curso'
});

//Aluno – Certificado 
Usuario.hasMany(Certificado, {
    foreignKey: 'id_concluinte',
    as: 'Certificados'
});
Certificado.belongsTo(Usuario, {
    foreignKey: 'id_concluinte',
    as: 'CertificadoEmitido'
});

//Presença - Turma
Turma.hasMany(Lista_presenca, {
    foreignKey: 'id_turma',
    as: 'Lista_presencas'
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
    as: 'Lista_presenca_usuario'
});

Lista_presenca.belongsToMany(Usuario, {
    through: Lista_presenca_usuario,
    foreignKey: 'id_lista',
    otherKey: 'id_usuario',
    as: 'Lista_presenca'
});

Lista_presenca_usuario.belongsTo(Usuario, { foreignKey: 'id_usuario' }); //lista do usuario pertence ao usuario
Lista_presenca_usuario.belongsTo(Lista_presenca, { foreignKey: 'id_lista' }); //lista de presença do usuario tambem pertence as listas de presença

// Exportação das model e conexão de arquivos
module.exports = {
    sequelize,
    Usuario,
    Curso,
    Turma,
    Certificado,
    Lista_presenca,
    Lista_presenca_usuario,
};
