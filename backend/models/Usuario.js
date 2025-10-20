const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory.js');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: { msg: 'O e-mail fornecido já está em uso.' },
        validate: { isEmail: { msg: 'Formato de e-mail inválido.' } } //validação do email
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nome_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    registro: { type: DataTypes.STRING(100), 
    allowNull: true 
    },
    cargo: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },
    area: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },
    tipo_usuario: {
        type: DataTypes.ENUM('aluno', 'professor', 'admin'),
        allowNull: false, //não pode ser nulo
        defaultValue: 'aluno' //tipo normalmente atribuido quando criado
    }
}, 
{
    tableName: 'usuario',
    timestamps: false,

    defaultScope: {
        attributes: { exclude: ['senha'] } // nunca retorna senha
    },
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.senha) usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('senha')) usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
        }
    }
});

//validar senha
Usuario.prototype.validarSenha = async function (senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = Usuario;