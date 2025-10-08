const express = require('express');
const app = express();
const PORT = 3000;

const db = require("./connectionFactory/connectionFactory.js");

app.get('/', (req, res) => {
    res.send("Olá, devs!")
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`)
});
