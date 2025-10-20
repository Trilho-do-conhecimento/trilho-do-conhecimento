// Importa o Express
const express = require('express');
const app = express();

// Importa as rotas
const authRoutes = require('./routes/authRoutes');

// Middleware para interpretar JSON
app.use(express.json());

// Usa as rotas de autenticação
app.use('/auth', authRoutes);

// Teste rápido de rota base
app.get('/', (req, res) => {
  res.send('Servidor Trilho do Conhecimento está rodando 🚆');
});

// Conexão com o banco de dados
const db = require('./connectionFactory/connectionFactory.js');

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    await db.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro: a conexão com o banco de dados falhou.', error.message);
  }
});


