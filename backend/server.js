require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOpt = {
    origin: ["http://127.0.0.1:5501", "http://localhost:5501", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Middlewares
app.use(express.json());
app.use(cors(corsOpt));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));
app.use(require('cookie-parser')());

// Banco e rotas
const sequelize = require('./connectionFactory/connectionFactory.js');
const usuarioRoute = require('./routes/usuarioRoutes.js');
const cursoRoute = require('./routes/cursoRoutes.js');
const certificadoRoute = require('./routes/certificadoRoutes.js');
const turmaRoute = require('./routes/turmaRoute.js')
const listaPresecaRoute = require('./routes/lista_presencaRoute.js')
const logger = require('./logs/logger.js');

// Rota principal (teste)
app.get('/', (req, res) => {
    res.redirect("/pages/index.html");
});

app.use('/rotas/cursos', cursoRoute);
app.use('/rotas/certificados', certificadoRoute);
app.use('/rotas/turma', turmaRoute);
app.use('/rotas/lista', listaPresecaRoute);
app.use('/rotas', usuarioRoute);

app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}/`);
});
