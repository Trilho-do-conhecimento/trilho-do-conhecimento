const express = require('express'); 

const router = express.Router(); 

const Usuario = require('../models/Usuario.js'); // Importa a Model Usuario 

const db = require("../connectionFactory/connectionFactory.js")
 
// --- 1. CREATE (POST) /api/usuarios --- 

router.post('/', async (req, res) => { 

    // Em um ambiente real, use bcrypt para hashear a senha antes de salvar! 

    const { email, senha, nome_completo, registro, cargo, area, tipo_usuario } = req.body; 

     

    try { 

        const novoUsuario = await Usuario.create({ 

            email, 

            senha, // Lembre-se de hashear! 

            nome_completo, 

            registro, 

            cargo, 

            area, 

            tipo_usuario 

        }); 

        // Retorna o usuário criado (sem a senha, por segurança) 

        res.status(201).json({  

            id_usuario: novoUsuario.id_usuario,  

            nome: novoUsuario.nome_completo  

        }); 

    } catch (error) { 

        console.error("Erro ao criar usuário:", error); 

        res.status(500).json({ error: 'Não foi possível criar o usuário. Verifique se o e-mail já existe.' }); 

    } 

}); 

 
 

// --- 2. READ (GET) /api/usuarios e /api/usuarios/:id --- 

// Listar todos 

router.get('/', async (req, res) => { 

    try { 

        const usuarios = await Usuario.findAll({ 

            attributes: ['id_usuario', 'email', 'nome_completo', 'cargo', 'tipo_usuario'] // Seleciona apenas campos seguros 

        }); 

        res.json(usuarios); 

    } catch (error) { 

        console.error("Erro ao listar usuários:", error); 

        res.status(500).json({ error: 'Erro ao buscar usuários.' }); 

    } 

}); 

 
 

// Buscar por ID 

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

 
 

// --- 3. UPDATE (PUT) /api/usuarios/:id --- 

router.put('/:id', async (req, res) => { 

    const { id } = req.params; 

    const novosDados = req.body; 

     

    try { 

        const [numRowsUpdated, updatedUsers] = await Usuario.update(novosDados, { 

            where: { id_usuario: id } 

            // Se você permitir a atualização da senha, deve hasheá-la aqui 

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

 
 

// --- 4. DELETE (DELETE) /api/usuarios/:id --- 

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

        // O Sequelize trata o erro de chave estrangeira, você pode capturá-lo aqui. 

        console.error("Erro ao deletar usuário:", error); 

        res.status(500).json({ error: 'Erro ao excluir. Pode haver registros vinculados (turmas, certificados).' }); 

    } 

}); 

 
 

module.exports = router; 