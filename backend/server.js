require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('js', express.static(path.join(__dirname, 'frontend', 'js')));
app.use(require('cookie-parser')());

// Banco e rotas
const sequelize = require('./connectionFactory/connectionFactory.js');
const route = require('./routes/usuarioRoutes.js');
const logger = require('./logs/logger.js');

// Rota principal (teste)
app.get('/', (req, res) => {
    res.redirect("/pages/index.html");
});

app.use('/rotas', route);

app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}/`);
});
