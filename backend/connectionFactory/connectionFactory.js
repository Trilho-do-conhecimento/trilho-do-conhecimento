const Sequelize = require("sequelize");
const sequelize = new Sequelize("metrodb", "root", "19282322Lfs#", {
    host : "localhost",
    dialect : "mysql"
}); // fazer conexão com bd na nuvem também

sequelize.authenticate()
.then(function(){
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(function(){
    console.log("Erro: a conexão com o banco de dados falhou.")
});

module.exports = sequelize;

