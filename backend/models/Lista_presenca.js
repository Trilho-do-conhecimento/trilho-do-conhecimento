const { DataTypes } = require('sequelize');
const sequelize = require('backend/connectionFactory/connectionFactory.js');

const Lista_presenca = sequelize.define('Lista_presenca', {
    id_lista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    id_turma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { //chave estrangeira
            model: 'turma',
            key: 'id_turma'
        }
    }
}, {
    tableName: 'lista_presenca',
    timestamps: false
});

module.exports = Lista_presenca;
