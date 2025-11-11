import {
  handleOpenTreinamentos,
  handleOpenListaPresenca,
  handleOpenMenuAluno,
  handleOpenCertificados,
  handleOpenCadastroUsuario,
  // initMenuAdm
} from "../controllers/menuAdmController.js";

//  Escuta o carregamento da página
// window.addEventListener("DOMContentLoaded", initMenuAdm);

//  Pega os botões do HTML
const btnTreinamentos = document.querySelector(".button-grid a:nth-child(1)");
const btnListaPresenca = document.querySelector(".button-grid a:nth-child(2)");
const btnEuAluno = document.querySelector(".button-grid a:nth-child(3)");
const btnCertificados = document.querySelector(".button-grid a:nth-child(4)");
const btnCadastroUsuario = document.querySelector(".single-button-container a");

//  Registra eventos de clique
btnTreinamentos.addEventListener("click", handleOpenTreinamentos);
btnListaPresenca.addEventListener("click", handleOpenListaPresenca);
btnEuAluno.addEventListener("click", handleOpenMenuAluno);
btnCertificados.addEventListener("click", handleOpenCertificados);
btnCadastroUsuario.addEventListener("click", handleOpenCadastroUsuario);
