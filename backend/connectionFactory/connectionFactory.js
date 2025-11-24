// require('dotenv').config({path: '../.env'});

// const logger = require("../logs/logger");
// const Sequelize = require("sequelize");

// const {DB_USER, DB_NAME, DB_PASS, DB_HOST} = process.env;
// // const DB_USER = process.env.DB_USER;
// // const DB_NAME = process.env.DB_NAME;
// // const DB_PASS = process.env.DB_PASS;
// // const DB_HOST = process.env.DB_HOST;

// logger.info(`Tentando conectar com o usuário ${DB_USER}`)

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//     host : DB_HOST,
//     dialect : "mysql"
// }); // fazer conexão com bd na nuvem também

// sequelize.sync()
// .then(function(){
//     logger.info("Conexão com o banco de dados realizada com sucesso!");
// }).catch((err) => {
//     logger.error("Erro: a conexão com o banco de dados falhou.", err.message);
// });

// module.exports = sequelize;

//conexão com Aiven
// require('dotenv').config({ path: '../.env' });
const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env') 
});
const Sequelize = require('sequelize');
const moment = require('moment');
const logger = require('../logs/logger');

const AIVEN_USER = 'avnadmin';
const AIVEN_PASS = process.env.AIVEN_DB_PASS; 
const AIVEN_HOST = 'mysql-1da21f4d-studylarih-ff4a.k.aivencloud.com';
const AIVEN_PORT = 22782;
const AIVEN_DB   = 'defaultdb';

const AIVEN_DB_URI = `mysql://${AIVEN_USER}:${encodeURIComponent(AIVEN_PASS)}@${AIVEN_HOST}:${AIVEN_PORT}/${AIVEN_DB}`;

const sequelizeAiven = new Sequelize(AIVEN_DB_URI, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});
// tenta conectar e exibe se foi ou não
async function conectarAiven() {
  try {
    await sequelizeAiven.authenticate();
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('[${timestamp}] Conexão com Aiven realizada com sucesso!');
    logger.info('Conexão com Aiven realizada com sucesso!');
    
    Object.keys(sequelizeAiven.models).forEach(modelName => {
      if(sequelizeAiven.models[modelName].associate) {
        sequelizeAiven.models[modelName].associate(sequelizeAiven.models);
      }
    });
    
    await sequelizeAiven.sync({alter: true})
    logger.info("Tabelas sincronizadas!")

    // caso não conecte - trata o erro e tenta novamente
  } catch (err) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.error('[${timestamp}] Falha ao conectar no Aiven:');
    console.error('Mensagem: ${err.message}');
    console.error('Stack: ${err.stack}');
    logger.error('Falha ao conectar no Aiven: ${err.message}');

    // tenta reconectar 
    setTimeout(() => {
      console.log('Tentando reconectar ao Aiven...');
      conectarAiven();
    }, 5000);
  }
}

conectarAiven();
module.exports = sequelizeAiven;