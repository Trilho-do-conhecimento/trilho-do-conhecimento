const express = require('express');
const router = express.Router();
const UsuarioDAO = require('../DAO/UsuarioDAO');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY } = process.env;
const authMiddleware = require('../middlewares/authMiddleware');
const logger = require('../logs/logger.js')

// Rotas públicas, não necessitam de middleware. 
// Com a privacidade definida dessa forma fica possível cadastrar novos usuários e realizar login 
// POST - criar usuario
router.post('/', async (req, res) => {
    try {
        const novoUsuario = await UsuarioDAO.criar(req.body);

        logger.info('Novo usuário criado com sucesso!', {
            id_usuario: novoUsuario.id_usuario,
            nome_completo: novoUsuario.nome_completo,
            email: novoUsuario.email
        });

        res.status(201).json({
            message: 'Novo usuário criado com sucesso!',
            id_usuario: novoUsuario.id_usuario,
            nome_completo: novoUsuario.nome_completo,
            email: novoUsuario.email
        });

    } catch (error) {
        logger.error("Falha ao tentar criar usuário.", error)

        if (error.message.includes('E-mail já cadastrado')) {
            logger.warn(`Atenção: tentativa de cadastro com um e-mail duplicado ${req.body.email}`);
            return res.status(409).json({ error: error.message });
        }
    }
});

// POST /login - Autenticação do usuario
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await UsuarioDAO.validarLogin(email, senha);

        if (!usuario) {
            logger.warn("Atenção: credenciais de login incorretas!");
            return res.status(401).json({ error: "Email ou senha inválidos!" });
        }
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

        logger.info('Usuário logado com sucesso.', {
            idUsuario: usuario.id_usuario,
            email: usuario.email
        })
        return res.status(200).json({ success: true, message: "Usuário logado!", userType: usuario.perfil});

    } catch (error) {
        logger.error("Erro no login:", error);
        res.status(500).json({ error: "Erro ao tentar realizar login." });
    }
});

// Rotas privadas, necessitam de middleware
router.use(authMiddleware);
// GET - listar
router.get('/', async (req, res) => {
    try {
        const usuarios = await UsuarioDAO.buscarTodos();
        logger.info("Usuários encontrados com sucesso!");
        res.json(usuarios);

    } catch (error) {
        logger.error("Erro ao listar usuários", error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

// GET/:id - Buscar por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await UsuarioDAO.buscarPorId(req.params.id);
        logger.info(`Usuários encontrados por id ${id.params.id} com sucesso!`);
        res.json(usuario);

    } catch (error) {
        
        if (error.message.includes('não encontrado')){
            logger.error("Usuário não encontrado (404).");
            return res.status(404).json({ error: error.message });
        }     
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
        logger.error("Erro ao buscar usuários", error);
    }
});

// PUT/:id - Atualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const usuarioAtualizado = await UsuarioDAO.atualizar(req.params.id, req.body);
        res.json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
        logger.info("Usuário atualizado com sucesso!", {
            idUsuario: req.params.id
        });
    } catch (error) {
        logger.error("Erro ao atualizar usuário:", error);
        if (error.message.includes('não encontrado')){
            logger.error("Usuário não encontrado (404).")
            return res.status(404).json({ error: error.message });
        }
        logger.error("Erro ao atualizar usuário", error);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// DELETE/:id - Excluir usuario
router.delete('/:id', async (req, res) => {
    try {
        await UsuarioDAO.deletar(req.params.id);
        res.json({ message: 'Usuário excluído com sucesso.' });
        logger.info(`Usuário id ${req.params.id} excluido com sucesso.`);
    } catch (error) {
        logger.error("Erro ao deletar usuário:", error);
        
        if (error.message.includes('não encontrado')){
            logger.error(`Erro ao deletar usuário id ${req.params.id}`);
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
        logger.error("Erro ao excluir usuário.");
    }
});


module.exports = router;
