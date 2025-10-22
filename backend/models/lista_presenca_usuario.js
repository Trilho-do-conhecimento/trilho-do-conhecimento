const { DataTypes } = require('sequelize'); 
const sequelize = require('../connectionFactory/connectionFactory.js'); 
const ListaPresenca = require('./ListaPresenca'); 
const Usuario = require('./Usuario'); 

const ListaPresencaUsuario = sequelize.define('ListaPresencaUsuario', { 
    id_lista:  
    { 
        type: DataTypes.INTEGER,  
        primaryKey: true,  
        references: 
        { 
            model: 'lista_presenca', 
            key: 'id_lista' 
        }  
    }, 

    id_usuario:  
    { 
        type: DataTypes.INTEGER,  
        primaryKey: true, 
        references: 
        { 
            model: 'usuario', 
            key: 'id_usuario' 
        }  
    }, 

    status_assinatura:  
    { 
        type: DataTypes.ENUM('Presente','Ausente','Justificado'),  
        allowNull: false  
    } 
},  

{  
    tableName: 'lista_presenca_usuario',  
    timestamps: false  
});  

module.exports = ListaPresencaUsuario; 