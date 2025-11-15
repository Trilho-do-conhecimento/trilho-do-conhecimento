import {
  initHistoricoAluno,
  handleFiltrarTreinamentos,
  handleToggleExpandir,
  handleEmitirCertificado
} from "../controllers/historicoTreinamentosAlunoController.js";

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", initHistoricoAluno);

// Botão de filtro
const btnFiltro = document.querySelector(".filter-button");
btnFiltro.addEventListener("click", handleFiltrarTreinamentos);

// Evento delegando cliques na tabela
document.querySelector(".table-container").addEventListener("click", (event) => {
  const target = event.target;

  // Expandir / recolher módulos
  if (target.classList.contains("expand-icon")) {
    handleToggleExpandir(event);
  }

  // Emitir certificado
  if (target.classList.contains("action-link")) {
    event.preventDefault();
    handleEmitirCertificado(event);
  }
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

});
