const express = require('express'); 
const router = express.Router(); 
const Usuario = require('../models/Usuario.js');  // importa model e bd
const db = require("../connectionFactory/connectionFactory.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY } = process.env;

const saltRounds = 10; // número de rounds para hash da senha

// POST - Criação de novos usuários
router.post('/', async (req, res) => { 
    const { email, senha, nome_completo, registro, cargo, area, tipo_usuario } = req.body; 

    try { 
        // senha é hasheada pelo hook beforeCreate na model 
        const novoUsuario = await Usuario.create(req.body); 
        
        // retornar o usuário sem mostrar a senha 
        res.status(201).json({  
            id_usuario: novoUsuario.id_usuario,  
            nome: novoUsuario.nome_completo  
        }); 

    } catch (error) { 
        console.error("Erro ao criar usuário:", error); 
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'O e-mail fornecido já está em uso.' });
        }
        res.status(500).json({ error: 'Não foi possível criar o usuário.' }); 
    } 
}); 

// GET - Listar todos os usuários
router.get('/', async (req, res) => { 
    try { 
        const usuarios = await Usuario.findAll({ 
            attributes: ['id_usuario', 'email', 'nome_completo', 'cargo', 'tipo_usuario'] // Não seleciona a senha
        }); 
        res.json(usuarios); 
    } catch (error) { 
        console.error("Erro ao listar usuários:", error); 
        res.status(500).json({ error: 'Erro ao buscar usuários.' }); 
    } 
}); 

// GET/:id - Buscar usuário por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    try { 
        const usuario = await Usuario.findByPk(id, { 
            attributes: ['id_usuario', 'email', 'nome_completo', 'cargo', 'area', 'tipo_usuario'] 
        }); 
        if (!usuario) { 
            return res.status(404).json({ error: 'Usuário não encontrado.' }); 
        } 
        res.json(usuario); 
    } catch (error) { 
        console.error("Erro ao buscar usuário por ID:", error); 
        res.status(500).json({ error: 'Erro ao buscar usuário.' }); 
    } 
}); 

// PUT - Atualizar usuário
router.put('/:id', async (req, res) => { 
    const { id } = req.params; 
    let novosDados = req.body; 

    try {
        if (novosDados.senha) { 
            novosDados.senha = await bcrypt.hash(novosDados.senha, saltRounds);
        }
        const [numRowsUpdated] = await Usuario.update(novosDados, { 
            where: { id_usuario: id } 
        }); 

        if (numRowsUpdated === 0) { 
            return res.status(404).json({ error: 'Usuário não encontrado ou nenhum dado para atualizar.' }); 
        } 
        res.json({ message: 'Usuário atualizado com sucesso!' }); 

    } catch (error) { 
        console.error("Erro ao atualizar usuário:", error); 
        res.status(500).json({ error: 'Erro ao atualizar usuário.' }); 
    } 
}); 

// DELETE - Deletar usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params; 

    try { 
        const numRowsDeleted = await Usuario.destroy({ 
            where: { id_usuario: id } 
        }); 
        if (numRowsDeleted === 0) { 
            return res.status(404).json({ error: 'Usuário não encontrado.' }); 
        } 
        res.json({ message: 'Usuário excluído com sucesso.' }); 

    } catch (error) { 
        console.error("Erro ao deletar usuário:", error); 
        res.status(500).json({ error: 'Erro ao excluir. Pode haver registros vinculados (turmas, certificados).' }); 
    } 
}); 

// =====================
// LOGIN - Autenticação de usuário
// =====================
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const u = await Usuario.findOne({ where: { email } });

        if (!u) {
            return res.status(401).json({ error: "Solicitação não autorizada: email inválido!" });
        }

        const senhaCorreta = await bcrypt.compare(senha, u.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: "Solicitação não autorizada: senha inválida!" });
        }

        const token = jwt.sign(
            { id: u.id_usuario, email: u.email }, 
            ACCESS_TOKEN_KEY, 
            { expiresIn: "10m" }
        );

        res.json({ token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro ao tentar realizar login. Problema no servidor." });
    }
});

module.exports = router;
