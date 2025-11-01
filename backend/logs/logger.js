require('dotenv').config();

const winston = require('winston');
const { timestamp, json, combine, colorize, simple, printf} = winston.format;
const path = require('path');
const MySQLTransport = require('./mysqlTransport')

// função para criar um logger 
const logger = winston.createLogger({
    // definir o nível mínimo para os transports
    level: "info",
    // define o transport 
    // formato de registro dos logs (como será salvo?)  
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((timestamp, level, message)=>{
            return `${timestamp} [${level}]: ${message}`
        }),
        json() // armazena no json
    ),
    // onde será salvo 
    transports: [
        new winston.transports.Console(),
        // erros crítios
        new winston.transports.File({ filename: path.join(__dirname, 'error.log'), level: "error" }),
        // erros mais básicos
        new winston.transports.File({ filename: path.join(__dirname, 'combined.log') }),
        // mysql
        new MySQLTransport()
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        // Vão existir dois arquivos de texto sempre, mas essa parte do 
        // código permite que apareça no terminal também
        level: "info",
        format: combine(
            // colore o nível para facilitar a leitura no terminal 
            colorize(),
            // simple = uma linha de texto. 
            simple()
        )
    }));
}

module.exports = logger;