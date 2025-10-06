const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Olá, devs!")
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na http://localhost:${PORT}/`)
});
