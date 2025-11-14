const { DataTypes } = require('sequelize');
const sequelize = require('../connectionFactory/connectionFactory.js');
const Usuario = require('./Usuario.js');

const Certificado = sequelize.define('Certificado', {
    id_certificado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Dados do certificador
    certificador: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    registro_certificador: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cargo_certificador: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    id_concluinte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },

    // Dados do certificado
    nome_certificado: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    nivel: {
        type: DataTypes.ENUM('iniciante', 'intermediario', 'avancado'),
        allowNull: false
    },
    tabela: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    normas: {
    type: DataTypes.TEXT,
    allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    data_certificado: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'certificado',
    timestamps: false
});

// Associação (caso haja alguma dificuldade analizar o CertificadoDAO.js)
Certificado.belongsTo(Usuario, {
    as: 'concluinte',
    foreignKey: 'id_concluinte'
});

module.exports = Certificado;
