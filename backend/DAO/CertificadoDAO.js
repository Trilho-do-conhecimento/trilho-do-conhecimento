const Certificado = require('../models/Certificado');
const Usuario = require('../models/Usuario');

// Cada certificado pertence a um usuário (concluinte), o belongsTo dinamiza a busca.
Certificado.belongsTo(Usuario, {
  as: 'concluinte',
  foreignKey: 'id_concluinte'
});

const CertificadoDAO = {

    async criar(dados) {
        try {
            return await Certificado.create(dados);
        } catch (err) {
            throw new Error(`Erro ao criar certificado: ${err.message}`);
        }
    },

    async buscarTodos() {
        try {
            return await Certificado.findAll({
                attributes: [
                    'id_certificado',
                    'nome_certificado',
                    'nivel',
                    'cidade',
                    'data_certificado',
                    'certificador',
                    'cargo_certificador'
                ],
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: ['id_usuario', 'nome_completo', 'area']
                    }
                ]
            });
        } catch (err) {
            throw new Error(`Erro ao buscar certificados: ${err.message}`);
        }
    },

    async buscarPorId(id_certificado) {
        try {
            const certificado = await Certificado.findByPk(id_certificado, {
                attributes: [
                    'id_certificado',
                    'certificador',
                    'registro_certificador',
                    'cargo_certificador',
                    'id_concluinte',
                    'nome_certificado',
                    'descricao',
                    'nivel',
                    'tabela',
                    'cidade',
                    'data_certificado',
                    'normas' 
                ],
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: [
                            'id_usuario',
                            'nome_completo',
                            'registro',
                            'cargo',
                            'area',
                            'email'
                        ]
                    }
                ]
            });

            if (!certificado) {
                throw new Error('Certificado não encontrado');
            }

            return certificado;

        } catch (err) {
            throw new Error(`Erro ao buscar certificado por ID: ${err.message}`);
        }
    },

    async buscarPorConcluinte(id_concluinte) {
        try {
            return await Certificado.findAll({
                where: { id_concluinte },
                attributes: [
                    'id_certificado',
                    'nome_certificado',
                    'nivel',
                    'cidade',
                    'data_certificado',
                    'certificador'
                ],
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: ['id_usuario', 'nome_completo', 'area']
                    }
                ]
            });
        } catch (err) {
            throw new Error(`Erro ao buscar certificados do concluinte: ${err.message}`);
        }
    },

    async atualizar(id_certificado, novosDados) {
        try {
            const certificado = await Certificado.findByPk(id_certificado);
            if (!certificado) throw new Error('Certificado não encontrado');

            await certificado.update(novosDados);
            return certificado;

        } catch (err) {
            throw new Error(`Erro ao atualizar certificado: ${err.message}`);
        }
    },

    async deletar(id_certificado) {
        try {
            const certificado = await Certificado.findByPk(id_certificado);
            if (!certificado) throw new Error('Certificado não encontrado');

            await certificado.destroy();
            return true;

        } catch (err) {
            throw new Error(`Erro ao deletar certificado: ${err.message}`);
        }
    }
};

module.exports = CertificadoDAO;
