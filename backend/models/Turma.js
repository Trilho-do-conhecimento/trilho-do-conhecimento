const { DataTypes } = require('sequelize');
const sequelize = require('backend/connectionFactory/connectionFactory.js');

const Turma = sequelize.define('Turma', {
    id_turma: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    horario: {
        type: DataTypes.DATE,
        allowNull: false
    },
    local: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    id_curso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { //chave estrangeira 
            model: 'curso',
            key: 'id_curso' 
        }
    },
    id_instrutor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id_usuario' // aq é só id usuario pq se usa o id como ponte
        }
    }
}, {
    tableName: 'turma',
    timestamps: false
});

module.exports = Turma;
