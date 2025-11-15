
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