
export function configurarBotaoVoltar() {
    const linkVoltar = document.getElementById('link-voltar');

    if (linkVoltar) {
        linkVoltar.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.history.back(); 
        });
    }
}

document.addEventListener("DOMContentLoaded", configurarBotaoVoltar); 

