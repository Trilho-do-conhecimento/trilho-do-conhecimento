document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".search-bar input");
    const button = document.querySelector(".search-bar button");

    if (!input || !button) return;

    const suggestionBox = document.createElement("div");
    suggestionBox.classList.add("suggestion-box");
    input.parentNode.appendChild(suggestionBox);

    const paginas = {
        aluno: {
            "institucional": "/pages/institucional.html",
            "treinamentos": "/pages/treinamentos.html",
            "menu aluno": "/pages/menuAluno.html",
            "certificado": "/pages/telaCertificado.html"
        },
        admin: {
            "Cadastrar usuário": "/pages/cadastrarUsuario.html",
            "Lista de presença": "/pages/criaListaDePresenca.html",
            "Histórico de treinamento": "/pages/historicoTreinamentosAluno.html",
            "institucional": "/pages/institucional.html",
            "Menu Admin": "/pages/menuAdm.html",
            "Menu eu aluno": "/pages/menuEuAluno.html",
            "certificado": "/pages/telaCertificado.html",
            "treinamentos": "/pages/treinamentosAdm.html",
        }
    };

    const tipo = localStorage.getItem("userType") || "aluno";
    const permitidas = paginas[tipo];

    let resultados = [];
    let selectedIndex = -1;

    function filtrarSugestoes(termo) {
        return Object.keys(permitidas)
            .filter(key => key.toLowerCase().includes(termo.toLowerCase()))
            .map(key => ({ nome: key, url: permitidas[key] }));
    }

    function mostrarSugestoes(termo) {
        suggestionBox.innerHTML = "";
        selectedIndex = -1;

        if (!termo) return;

        resultados = filtrarSugestoes(termo);

        resultados.forEach((item, index) => {
            const div = document.createElement("div");
            div.textContent = item.nome;
            div.classList.add("suggestion-item");

            div.addEventListener("click", () => {
                window.location.href = item.url; // redireciona
            });

            suggestionBox.appendChild(div);
        });
    }

    input.addEventListener("input", e => mostrarSugestoes(e.target.value));

    input.addEventListener("keydown", e => {
        const items = suggestionBox.querySelectorAll(".suggestion-item");
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            atualizarSelecao(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            atualizarSelecao(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0) {
                window.location.href = resultados[selectedIndex].url;
            } else if (resultados.length > 0) {
                window.location.href = resultados[0].url;
            } else {
                alert("Nenhuma página encontrada ou você não tem acesso.");
            }
        }
    });

    function atualizarSelecao(items) {
        items.forEach((item, i) => {
            item.classList.toggle("selected", i === selectedIndex);
        });
    }

    button.addEventListener("click", () => {
        if (resultados.length > 0) window.location.href = resultados[0].url;
        else alert("Nenhuma página encontrada ou você não tem acesso.");
    });

    document.addEventListener("click", e => {
        if (!input.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
            selectedIndex = -1;
        }
    });

    // Estilo da box
    const style = document.createElement("style");
    style.textContent = `
        .search-bar { position: relative; width: 100%; max-width: 400px; }
        .suggestion-box {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 1000;
            margin-top: 4px;
            font-size: 0.95rem;
        }
        .suggestion-item { padding: 10px 14px; cursor: pointer; }
        .suggestion-item:hover, .suggestion-item.selected { background-color: #f0f4ff; }
    `;
    document.head.appendChild(style);
});
