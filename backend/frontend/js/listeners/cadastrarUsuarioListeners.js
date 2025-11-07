import { handleSubmitCadastro, handleCancelarCadastro } from "../controllers/cadastrarUsuarioController.js";

const form = document.getElementById('form-cadastrar-usuario');
const btnCancelar = document.getElementById('btn-cancelar');
const inputNascimento = document.getElementById('nascimento');

// Máscara de data
inputNascimento.addEventListener('input', handleMascaraData);

// Submissão
form.addEventListener('submit', handleSubmitCadastro);

// Cancelar
btnCancelar.addEventListener('click', handleCancelarCadastro);

