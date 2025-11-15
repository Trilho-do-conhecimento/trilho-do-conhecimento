import {
  // initMenuAluno,
  handleOpenTreinamentos,
  handleOpenCertificados
} from "../controllers/menuAlunoController.js";

// Garante inicialização ao carregar a página
// window.addEventListener("DOMContentLoaded", initMenuAluno);

// Botões do HTML
const btnTreinamentos = document.querySelector(".button-group a:nth-child(1)");
const btnCertificados = document.querySelector(".button-group a:nth-child(2)");

// Eventos de clique
btnTreinamentos.addEventListener("click", handleOpenTreinamentos);
btnCertificados.addEventListener("click", handleOpenCertificados);


    //voltar para a tela anterior
  document.addEventListener('DOMContentLoaded', () => {
      // Ação de Voltar para tela anterior
      const goBack = (event) => {
          if (event) {
              event.preventDefault();
          }
          window.history.back();
      };

      // Ícone de Seta de Voltar (Link)
      const linkVoltar = document.getElementById('link-voltar');
      if (linkVoltar) {
          linkVoltar.addEventListener('click', goBack);
      }
  });