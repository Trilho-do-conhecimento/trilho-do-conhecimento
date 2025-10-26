const winston = require('winston');
const MySQLTransport = require('winston-mysql')
const { timestamp, errors, json, combine, colorize, simple } = winston.format;
const { DB_HOST, DB_USER, DB_PASS, DB_NAME_LOGGER } = process.env;

const dbConfig = {
    client: "mysql2",
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME_LOGGER,
    table: "infologs"
}

const transporteMySQL = new MySQLTransport(dbConfig);

// função para criar um logger 
const logger = winston.createLogger({
    // definir o nível mínimo para os transports
    level: "debug",
    // define o transport 
    // formato de registro dos logs (como será salvo?)  
    format: combine(
        timestamp(),
        errors({ stack: true }), // registro de chamadas de função quando o erro ocorreu (o que fez ele chegar no topo da pilha?)
        json() // armazena no json
    ),
    // onde será salvo 
    transports: [
        // erros crítios
        new winston.transports.File({ filename: "../logs/error.log", level: "error" }),
        // erros mais básicos
        new winston.transports.File({ filename: "../logs/combined.log" }),
        // mysql
        transporteMySQL
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        // Vão existir dois arquivos de texto sempre, mas essa parte do 
        // código permite que apareça no terminal também
        level: "debug",
        format: combine(
            // colore o nível para facilitar a leitura no terminal 
            colorize(),
            // simple = uma linha de texto. 
            simple()
        )
    }));
}

module.exports = logger;