const Transport = require("winston-transport");
const mysql = require('mysql2');
const logger = require('./logger')

const { DB_HOST, DB_LOGGER_USER, DB_LOGGER_PASS, DB_LOGGER_NAME } = process.env;

class MySQLTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.connection = mysql.createConnection({
            host: DB_HOST,
            user: DB_LOGGER_USER,
            password: DB_LOGGER_PASS,
            database: DB_LOGGER_NAME,
        });

        console.log(`bagulhos: ${DB_HOST}, ${DB_LOGGER_USER}, ${DB_LOGGER_PASS}, ${DB_LOGGER_NAME}}`)
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        const {level, message, timestamp} = info;

        const sql = `INSERT INTO infologs(level, message, timestamp) VALUES (?, ?, ?)`
        this.connection.query(sql, [level, message, timestamp], (err => {
            if(err){
                logger.log(err);
            }
        }))

        callback();
    }
};

module.exports = MySQLTransport;