document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");
    const input = document.querySelector(".search-bar input");
    const button = document.querySelector(".search-bar button");

    if (!input || !button || !searchBar) return;

    //  sugestões
    const suggestionBox = document.createElement("div");
    suggestionBox.classList.add("suggestion-box");
    suggestionBox.style.display = "none";
    searchBar.appendChild(suggestionBox);

    function positionSuggestionBox() {
        requestAnimationFrame(() => {
            const rect = searchBar.getBoundingClientRect();
            suggestionBox.style.position = "fixed";
            suggestionBox.style.width = `${rect.width}px`;
            suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            suggestionBox.style.left = `${rect.left + window.scrollX}px`;
        });
    }

    window.addEventListener("resize", positionSuggestionBox);
    window.addEventListener("scroll", positionSuggestionBox);

    const paginas = {
        aluno: {
            "institucional": "/pages/institucional.html",
            "treinamentos": "/pages/treinamentos.html",
            "menu aluno": "/pages/menuAluno.html",
            "certificado": "/pages/telaCertificado.html",
            "Ajuda" : "/pages/ajuda.html"
        },
        admin: {
            "Cadastrar usuário": "/pages/cadastrarUsuario.html",
            "Lista de presença": "/pages/criarListaDePresenca.html",
            "Histórico de treinamento": "/pages/historicoTreinamentosAluno.html",
            "institucional": "/pages/institucional.html",
            "Menu Admin": "/pages/menuAdm.html",
            "Eu aluno": "/pages/menuEuAluno.html",
            "Certificado": "/pages/telaCertificado.html",
            "Treinamento": "/pages/treinamentosAdm.html",
            "Treinamentos": "/pages/treinamentosAdm.html",
            "Ajuda" : "/pages/ajuda.html"

        }
    };

    const tipo = localStorage.getItem("userType") || "admin";
    const permitidas = paginas[tipo];

    let resultados = [];
    let selectedIndex = -1;

    function filtrarSugestoes(termo) {
        const t = termo.toLowerCase();
        const todas = Object.keys(permitidas);
        const maisRelevantes = [
            ...todas.filter(k => k.toLowerCase().startsWith(t)),
            ...todas.filter(k => k.toLowerCase().includes(t) && !k.toLowerCase().startsWith(t))
        ];
        return maisRelevantes.map(key => ({ nome: key, url: permitidas[key] }));
    }

    function destacarTexto(nome, termo) {
        const regex = new RegExp(`(${termo})`, "gi");
        return nome.replace(regex, "<strong>$1</strong>");
    }

    function mostrarSugestoes(termo) {
        suggestionBox.innerHTML = "";
        selectedIndex = -1;
        if (!termo) {
            suggestionBox.style.display = "none";
            return;
        }

        resultados = filtrarSugestoes(termo);
        suggestionBox.style.display = "block";
        positionSuggestionBox();

        if (resultados.length === 0) {
            const aviso = document.createElement("div");
            aviso.classList.add("suggestion-item", "no-results");
            aviso.textContent = `Nenhuma página encontrada para "${termo}".`;
            suggestionBox.appendChild(aviso);
            return;
        }

        resultados.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("suggestion-item");
            div.innerHTML = destacarTexto(item.nome, termo);
            div.addEventListener("click", () => {
                window.location.href = item.url;
            });
            suggestionBox.appendChild(div);
        });
    }

    function atualizarSelecao(items) {
        items.forEach((item, i) => {
            item.classList.toggle("selected", i === selectedIndex);
        });
    }
    function redirecionarOuAlertar(termo) {
        const t = termo.trim();
        if (t.length === 1) {
            alert(`Entrada inválida: "${t}". Digite pelo menos duas letras.`);
            return;
        }
        // vazio
        if (!t) {
            alert("Por favor, digite algo para pesquisar.");
            return;
        }
        const resultadosAtuais = filtrarSugestoes(t);

        const matchExato = resultadosAtuais.find(
            item => item.nome.toLowerCase() === t.toLowerCase()
        );
        if (matchExato) {
            window.location.href = matchExato.url;
            return;
        }

        if (resultadosAtuais.length === 0) {
            alert(`Nenhuma página encontrada para "${t}".`);
            return;
        }
        suggestionBox.style.display = "block";
        positionSuggestionBox();
    }

    input.addEventListener("input", e => {
        mostrarSugestoes(e.target.value);
        positionSuggestionBox();
    });

    input.addEventListener("keydown", e => {
        const items = suggestionBox.querySelectorAll(".suggestion-item");

        if (e.key === "Escape") {
            suggestionBox.style.display = "none";
            return;
        }
        if (e.key === "Enter" && !items.length) {
            e.preventDefault();
            redirecionarOuAlertar(e.target.value);
            return;
        }
        if (!items.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            atualizarSelecao(items);
            items[selectedIndex]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            atualizarSelecao(items);
            items[selectedIndex]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && resultados[selectedIndex]) {
                window.location.href = resultados[selectedIndex].url;
            } else {
                redirecionarOuAlertar(e.target.value);
            }
        }
        positionSuggestionBox();
    });

    button.addEventListener("click", () => {
        redirecionarOuAlertar(input.value);
    });

    document.addEventListener("click", e => {
        if (!input.contains(e.target) && !suggestionBox.contains(e.target) && !button.contains(e.target)) {
            suggestionBox.innerHTML = "";
            selectedIndex = -1;
            suggestionBox.style.display = "none";
        }
    });
});
