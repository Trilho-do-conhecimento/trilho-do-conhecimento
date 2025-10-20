const Usuario = require('../models/Usuario');

const UsuarioDAO = {

    async criar(usuarioData) {
        try {
            return await Usuario.create(usuarioData);
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('E-mail já cadastrado.');
            }
            throw err;
        }
    },

    async buscarTodos() {
        return await Usuario.findAll();
    },

    async buscarPorId(id_usuario) {
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) throw new Error('Usuário não encontrado');
        return usuario;
    },

    async atualizar(id_usuario, novosDados) {
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) throw new Error('Usuário não encontrado');
        await usuario.update(novosDados);
        return usuario;
    },

    async deletar(id_usuario) {
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) throw new Error('Usuário não encontrado');
        await usuario.destroy();
        return true;
    },

    async validarLogin(email, senha) {
        const usuario = await Usuario.scope(null).findOne({ where: { email } });
        if (!usuario) return null;
        const senhaValida = await usuario.validarSenha(senha);
        if (!senhaValida) return null;
        return usuario;
    }
};

module.exports = UsuarioDAO;
