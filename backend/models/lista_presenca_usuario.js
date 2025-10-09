const { DataTypes } = require('sequelize'); 
const sequelize = require('backend/connectionFactory/connectionFactory.js'); //conecta com o bd

const Lista_presenca_usuario = sequelize.define('Lista_presenca_usuario', {
    id_lista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'lista_presenca',
            key: 'id_lista'
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { //chave estrangeira
            model: 'usuario',
            key: 'id_usuario'
        }
    },
    status_assinatura: {
        type: DataTypes.ENUM('Presente', 'Ausente', 'Justificado'), //criar classe enum
        allowNull: false
    }
}, {
    tableName: 'lista_presenca_usuario',
    timestamps: false
});

module.exports = Lista_presenca_usuario;
