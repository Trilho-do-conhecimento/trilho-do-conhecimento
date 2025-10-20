require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const path = require('path'); //ajuda na busca e manipulação de caminhos de arquivos e diretórios
const app = express();
const PORT = 3000;

app.use(express.json());
// app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend'))) //possibilita a busca de arquivos estáticos no diretorio. Permite que o index.html seja o principal 

const sequelize = require("./connectionFactory/connectionFactory.js");
const route = require("./routes/usuarioRoutes.js")

app.get('/', (req, res) => {
    res.redirect("/pages/index.html")
});

app.use('/rotas', route);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`)
});
