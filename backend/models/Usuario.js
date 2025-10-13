const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory.js');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false, //NÃO PODE SER NULO
        unique: true
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: false
        //PRECISA COLOCAR CRIPTOGRAFIA AINDA
    },
    nome_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    registro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    area: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo_usuario: {
        type: DataTypes.ENUM('aluno', 'professor', 'admin'), //Ver se o enum por conta da logica precisa ser criado uma classe so para ele
        allowNull: false
    }
}, {
    tableName: 'usuario', // O nome igual ao da tabela no MySQL
    timestamps: false // não registra no bd que horas foi criado e tals
});

module.exports = Usuario; //para conseguir utilizar a model em outros lugares