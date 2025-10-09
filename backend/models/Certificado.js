const { DataTypes } = require('sequelize');
const sequelize = require('backend/connectionFactory/connectionFactory.js');

const Certificado = sequelize.define('Certificado', {
    id_certificado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    certificador1: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    registro_c1: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cargo_c1: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_concluinte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id_usuario'
        }
    },
    nome_certificado: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'certificado',
    timestamps: false
});

module.exports = Certificado;
