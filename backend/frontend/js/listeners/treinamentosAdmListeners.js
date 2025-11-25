import { initTreinamentosAdm, handleFiltrarTreinamentos, handleAbrirListaPresenca } from "../controllers/treinamentosAdmController.js";

// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, inicializando treinamentos...');
  
  // Inicializar a página
  initTreinamentosAdm();
  
  // Adicionar listener para o botão de voltar
  const linkVoltar = document.getElementById('link-voltar');
  if (linkVoltar) {
    linkVoltar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'menuAdm.html';
    });
  }
  
  // Adicionar funcionalidade de pesquisa
  const searchBar = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const termo = searchBar.value.trim();
      if (termo) {
        console.log('Pesquisando por:', termo);
        // Implementar lógica de pesquisa
      }
    });
  }
  
  if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const termo = searchBar.value.trim();
        if (termo) {
          console.log('Pesquisando por:', termo);
          // Implementar lógica de pesquisa
        }
      }
    });
  }
});