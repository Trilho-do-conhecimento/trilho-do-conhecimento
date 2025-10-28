require('dotenv').config({path: '../.env'});

const logger = require("../logs/logger");
const Sequelize = require("sequelize");

const {DB_USER, DB_NAME, DB_PASS, DB_HOST} = process.env;
// const DB_USER = process.env.DB_USER;
// const DB_NAME = process.env.DB_NAME;
// const DB_PASS = process.env.DB_PASS;
// const DB_HOST = process.env.DB_HOST;

logger.info(`Tentando conectar com o usuário ${DB_USER}`)

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host : DB_HOST,
    dialect : "mysql"
}); // fazer conexão com bd na nuvem também

sequelize.sync()
.then(function(){
    logger.info("Conexão com o banco de dados realizada com sucesso!");
}).catch((err) => {
    logger.error("Erro: a conexão com o banco de dados falhou.", err.message);
});

module.exports = sequelize;