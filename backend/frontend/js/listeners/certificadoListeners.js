// === BOTÃO DE VOLTAR ===
function configurarBotaoVoltar() {
    const linkVoltar = document.getElementById('link-voltar');

    if (linkVoltar) {
        linkVoltar.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
}

async function carregarCertificados() {
    const grid = document.getElementById("certificate-grid");
    const loading = document.getElementById("loading-certificados");
    const errorMsg = document.getElementById("error-message");

    grid.innerHTML = "";
    errorMsg.textContent = "";
    loading.style.display = "block";

    const userId = localStorage.getItem("userId");

    if (!userId) {
        loading.style.display = "none";
        errorMsg.textContent = "Usuário não identificado.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/certificados/aluno/${userId}`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar certificados.");
        }

        const certificados = await response.json();
        renderizarCertificados(certificados);

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Erro ao carregar certificados.";
    }

    loading.style.display = "none";
}

function renderizarCertificados(certificados) {
    const grid = document.getElementById("certificate-grid");

    if (!certificados || certificados.length === 0) {
        grid.innerHTML = `<p style="text-align:center;width:100%">Nenhum certificado encontrado.</p>`;
        return;
    }

    certificados.forEach(cert => {
        const item = document.createElement("div");
        item.classList.add("certificate-item");

        item.innerHTML = item.innerHTML = `
    <div class="certificate-card">
        
        <div class="certificate-info">
            <div class="certificate-name">${cert.nome_certificado}</div>
            <div class="certificate-date">Emitido em: ${formatarData(cert.data_emissao)}</div>
        </div>

        <button class="download-icon" onclick="baixarCertificado(${cert.id_certificado})" title="Baixar Certificado">
            <i class="fa-solid fa-download"></i>
        </button>
    </div>
`;

        grid.appendChild(item);
    });
}

// formata a data do certificado
function formatarData(data) {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// DOWNLOAD
window.baixarCertificado = function (idCertificado) {
    window.open(`http://localhost:3000/certificados/${idCertificado}/download`, "_blank");
};

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    configurarBotaoVoltar();
    carregarCertificados();
});

