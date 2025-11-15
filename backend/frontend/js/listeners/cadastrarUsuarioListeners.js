import { handleSubmitCadastro, handleCancelarCadastro, handleMascaraData } from "../controllers/cadastrarUsuarioController.js";

const form = document.getElementById('form-cadastrar-usuario');
const btnCancelar = document.getElementById('btn-cancelar');
const inputNascimento = document.getElementById('nascimento');

// Máscara de data
inputNascimento.addEventListener('input', handleMascaraData);

// Submissão
form.addEventListener('submit', handleSubmitCadastro);

// Cancelar
btnCancelar.addEventListener('click', handleCancelarCadastro);

//voltar para a tela anterior
document.addEventListener('DOMContentLoaded', () => {
    // Ação de Voltar para tela anterior
    const goBack = (event) => {
        if (event) {
            event.preventDefault();
        }
        window.history.back();
    };

    // Ícone de Seta de Voltar 
    const linkVoltar = document.getElementById('link-voltar');
    if (linkVoltar) {
        linkVoltar.addEventListener('click', goBack);
    }
});