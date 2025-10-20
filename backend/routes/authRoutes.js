const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcrypt');

// POST - Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ success: false, message: 'Senha incorreta.' });
    }

    const token = `${usuario.id_usuario}-${Date.now()}`;

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      id_usuario: usuario.id_usuario,
      nome: usuario.nome_completo,
      tipo_usuario: usuario.tipo_usuario,
      token
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
});

module.exports = router;
