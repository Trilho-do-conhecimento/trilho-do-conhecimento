document.addEventListener("DOMContentLoaded", () => {

    const goBack = (event) => {
        if (event) {
            event.preventDefault();
        }
        
        window.location.href = "menuAdm.html"; 
    };

    // Ícone de Seta de Voltar (Link)
    const linkVoltar = document.getElementById('link-voltar');
    
    if (linkVoltar) {
        linkVoltar.addEventListener('click', goBack);
    }
});

    // Ícone de Seta de Voltar (Link)
    const linkVoltar = document.getElementById('link-voltar');
    
    if (linkVoltar) {
        linkVoltar.addEventListener('click', goBack);
    } else {
        console.error("Erro: Link de Voltar não encontrado.");
    }
