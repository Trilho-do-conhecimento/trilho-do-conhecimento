const express = require('express');
const router = express.Router();
const UsuarioDAO = require('../DAO/UsuarioDAO');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY } = process.env;
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas, não necessitam de middleware. 
// Com a privacidade definida dessa forma fica possível cadastrar novos usuários e realizar login 
// POST - criar usuario
router.post('/', async (req, res) => {
    try {
        const novoUsuario = await UsuarioDAO.criar(req.body);

        res.status(201).json({
            id_usuario: novoUsuario.id_usuario,
            nome_completo: novoUsuario.nome_completo,
            email: novoUsuario.email
        });

    } catch (error) {
        console.error("Erro ao criar usuário:", error);

        if (error.message.includes('E-mail já cadastrado'))
            return res.status(409).json({ error: error.message });

        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

// POST /login - Autenticação do usuario
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await UsuarioDAO.validarLogin(email, senha);

        if (!usuario) return res.status(401).json({ error: "Email ou senha inválidos!" });
        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: "24h" }
        );

        res.cookie('auth_token', token, {
            httpOnly: true, // nomeia o cookie, proteção contra xss
            secure: process.env.NODE_ENV === 'prod', // token só é enviado se for https
            domain: process.env.COOKIE_DOMAIN, // define o domínio
            sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'Lax', // protege contra csrf (croos-site), bloqueia envio de cookies em navegação de terceiros
            maxAge: 60 * 60 * 1000
        }); // Quanto tempo dura um cookie (uma hora)

        return res.status(200).json({ message: "Usuário logado!" });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro ao tentar realizar login." });
    }
});

// Rotas privadas, necessitam de middleware
router.use(authMiddleware);
// GET - listar
router.get('/', async (req, res) => {
    try {
        const usuarios = await UsuarioDAO.buscarTodos();

        res.json(usuarios);

    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

// GET/:id - Buscar por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await UsuarioDAO.buscarPorId(req.params.id);

        res.json(usuario);

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);

        if (error.message.includes('não encontrado'))
            return res.status(404).json({ error: error.message });

        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// PUT/:id - Atualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const usuarioAtualizado = await UsuarioDAO.atualizar(req.params.id, req.body);

        res.json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error.message.includes('não encontrado'))
            return res.status(404).json({ error: error.message });

        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// DELETE/:id - Excluir usuario
router.delete('/:id', async (req, res) => {
    try {
        await UsuarioDAO.deletar(req.params.id);
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        if (error.message.includes('não encontrado'))
            return res.status(404).json({ error: error.message });

        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
});


module.exports = router;
