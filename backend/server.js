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

// Banco e rotas
const sequelize = require('./connectionFactory/connectionFactory.js');
const route = require('./routes/usuarioRoutes.js');

// Rota principal (teste)
app.get('/', (req, res) => {
    res.send("Olá, devs! 🚀");

});

app.use('/rotas', route);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
