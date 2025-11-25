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
    } else {
        console.error("Erro: Link de Voltar não encontrado.");
    }

    // configura logout
    const linkSair = document.getElementById('link-sair');

    function logout() {

        // Limpar dados do localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('ultimaTela');

        // Limpar sessionStorage
        sessionStorage.clear();

        // Redirecionar para index.html
        window.location.href = '../index.html';
    }

    function SairSessao() {
        linkSair.removeAttribute('href');
        linkSair.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    SairSessao();
});
