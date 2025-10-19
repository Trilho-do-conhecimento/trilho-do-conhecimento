require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json()) // testar isso 

const db = require("./connectionFactory/connectionFactory.js");
const route = require("./routes/usuarioRoutes.js")

app.get('/', (req, res) => {
    res.send("Olá, devs!")
});

app.use('/rotas', route);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`)
});
