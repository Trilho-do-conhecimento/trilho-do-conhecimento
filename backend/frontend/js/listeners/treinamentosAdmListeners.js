import {
  initTreinamentosAdm,
  handleFiltrarTreinamentos,
  handleAbrirListaPresenca
} from "../controllers/treinamentosAdmController.js";

// Página carregada: inicializa listagem
window.addEventListener("DOMContentLoaded", initTreinamentosAdm);

// Botão de filtro
const btnFiltro = document.querySelector(".filter-button");
btnFiltro.addEventListener("click", handleFiltrarTreinamentos);

// Delegação de evento para links da tabela
document.querySelector(".table-container").addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    event.preventDefault();
    handleAbrirListaPresenca(event);
  }
});
