const { DataTypes } = require('sequelize'); 
const sequelize = require('../connectionFactory/connectionFactory.js'); 
const Turma = require('./Turma'); 
const Usuario = require('./Usuario'); 
const ListaPresencaUsuario = require('./ListaPresencaUsuario'); 

const ListaPresenca = sequelize.define('ListaPresenca', { 
    id_lista: 
    { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    }, 

    data: 
    { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    }, 

    id_turma: 
    { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: 
        { 
            model: 'turma', 
            key: 'id_turma' 
        } 
    } 
}, 
{ 
    tableName: 'lista_presenca', 
    timestamps: false 
}); 

// Relacionamentos 
ListaPresenca.belongsTo(Turma, 
    { 
    foreignKey: 'id_turma', 
    as: 'Turma' 
    }); 

ListaPresenca.belongsToMany(Usuario, {  
    through: ListaPresencaUsuario,  
    foreignKey: 'id_lista',  
    otherKey: 'id_usuario', 
    as: 'Usuarios' 
}); 

module.exports = ListaPresenca; 