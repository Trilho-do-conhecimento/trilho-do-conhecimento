const Certificado = require('../models/Certificado');
const Usuario = require('../models/Usuario');

const CertificadoDAO = {

    async criar(dados) {
        try {
            return await Certificado.create(dados);
        } catch (err) {
            throw err;
        }
    },

    async buscarTodos() {
        try {
            return await Certificado.findAll({
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: ['id_usuario', 'nome_completo', 'registro', 'cargo', 'area'] }
                ]
            });
        } catch (err) {
            throw err;
        }
    },

    async buscarPorId(id_certificado) {
        try {
            return await Certificado.findByPk(id_certificado, {
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: ['id_usuario', 'nome_completo', 'registro', 'cargo', 'area'] }
                ]
            });
        } catch (err) {
            throw err;
        }
    },

    async buscarPorConcluinte(id_concluinte) {
        try {
            return await Certificado.findAll({
                where: { id_concluinte },
                include: [
                    { 
                        model: Usuario, 
                        as: 'concluinte', 
                        attributes: ['id_usuario', 'nome_completo', 'registro', 'cargo', 'area'] }
                ]
            });
        } catch (err) {
            throw err;
        }
    },

    async atualizar(id_certificado, novosDados) {
        try {
            const certificado = await Certificado.findByPk(id_certificado);
            if (!certificado) throw new Error('Certificado não encontrado');
            await certificado.update(novosDados);
            return certificado;
        } catch (err) {
            throw err;
        }
    },

    async deletar(id_certificado) {
        try {
            const certificado = await Certificado.findByPk(id_certificado);
            if (!certificado) throw new Error('Certificado não encontrado');
            await certificado.destroy();
            return true;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = CertificadoDAO;
