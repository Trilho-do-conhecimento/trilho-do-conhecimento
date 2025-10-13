const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory.js');
const bcrypt = require('bcrypt'); //Importar BCrypt

const saltRounds = 10; // Fator de custo do hash

const Usuario = sequelize.define('Usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    senha: {
        type: DataTypes.STRING(100),
        allowNull: false
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
        type: DataTypes.ENUM('aluno', 'professor', 'admin'),
        allowNull: false
    }
    }, 

    {
    tableName: 'usuario',
    timestamps: false,
    
    //GANCHO (HOOK)de hashing : basicamente hash antes de ir pro CRUD realmente, roda uma função antes ou depois do post/put
    hooks: { 
        //criação em massa --> acho que talvez não seja tão necessario a em massa
        beforeBulkCreate: async (usuarios) => {
            for (const usuario of usuarios) {
                if (usuario.senha) {
                    usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
                }
            }
        },
        //criação individual
        beforeCreate: async (usuario) => {
            if (usuario.senha) {
                usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
            }
        },
        //Atualização em massa --> acho que talvez não seja tão necessario a em massa
        beforeBulkUpdate: async (options) => {
            if (options.attributes.senha) {
                options.attributes.senha = await bcrypt.hash(options.attributes.senha, saltRounds);
            }
        },
         //atualização individual
        beforeUpdate: async (usuario) => {
            if (usuario.changed('senha')) {
                 usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
            }
        }
    }//todas sendo hasheada antes de ir pro crud
});

//método para comparação de senha 
Usuario.prototype.validarSenha = function (senha) {
    return bcrypt.compare(senha, this.senha);
};


module.exports = Usuario;