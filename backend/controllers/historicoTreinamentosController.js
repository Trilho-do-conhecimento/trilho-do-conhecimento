import { buscarHistoricoAluno, emitirCertificado } from "../services/historicoTreinamentosAlunoService.js";

/**
 * Inicializa a tela: busca treinamentos e renderiza tabela.
 */
export async function initHistoricoAluno() {
  try {
    const treinamentos = await buscarHistoricoAluno();
    renderTabelaTreinamentos(treinamentos);
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    alert("Não foi possível carregar seu histórico de treinamentos.");
  }
}

/**
 * Renderiza a tabela com os treinamentos do aluno.
 */
export function renderTabelaTreinamentos(treinamentos) {
  const tbody = document.querySelector(".trainings-table tbody");
  tbody.innerHTML = "";

  treinamentos.forEach((treinamento, index) => {
    // Linha principal
    const mainRow = document.createElement("tr");
    mainRow.classList.add("training-main-row");
    mainRow.innerHTML = `
      <td class="expand-icon" data-id="${treinamento.id}">></td>
      <td class="training-name">${treinamento.nome}</td>
      <td>${formatarData(treinamento.data_inicio)}</td>
      <td><span class="status status-${treinamento.status.toLowerCase()}">${treinamento.status}</span></td>
      <td>
        ${
          treinamento.status.toLowerCase() === "concluído"
            ? `<a href="#" class="action-link" data-id="${treinamento.id}">Emitir certificado</a>`
            : `<span class="action-disabled">Emitir certificado</span>`
        }
      </td>
    `;
    tbody.appendChild(mainRow);

    // Sub-linhas (módulos do treinamento)
    if (treinamento.modulos && treinamento.modulos.length > 0) {
      treinamento.modulos.forEach((modulo) => {
        const subRow = document.createElement("tr");
        subRow.classList.add("sub-row", "hidden");
        subRow.setAttribute("data-parent", treinamento.id);
        subRow.innerHTML = `
          <td></td>
          <td class="sub-row-title">${modulo.nome}</td>
          <td>${formatarData(modulo.data)}</td>
          <td><span class="status status-${modulo.presenca?.toLowerCase() || "faltante"}">${modulo.presenca || "Faltante"}</span></td>
          <td></td>
        `;
        tbody.appendChild(subRow);
      });
    }
  });
}

/**
 * Alterna a exibição dos módulos (sub-linhas) ao clicar no ícone.
 */
export function handleToggleExpandir(event) {
  const icon = event.target;
  const treinamentoId = icon.dataset.id;

  // Alterna ícone ">" ↔ "V"
  icon.classList.toggle("expanded");
  icon.textContent = icon.classList.contains("expanded") ? "V" : ">";

  // Mostra/esconde sub-linhas do mesmo ID
  document.querySelectorAll(`.sub-row[data-parent="${treinamentoId}"]`).forEach((row) => {
    row.classList.toggle("hidden");
  });
}

/**
 * Dispara o filtro (placeholder para futuras melhorias)
 */
export function handleFiltrarTreinamentos() {
  alert("Filtro de treinamentos em desenvolvimento!");
}

/**
 * Solicita emissão de certificado via Service.
 */
export async function handleEmitirCertificado(event) {
  const idTreinamento = event.target.dataset.id;

  try {
    const linkCertificado = await emitirCertificado(idTreinamento);
    alert("Certificado emitido com sucesso!");
    window.open(linkCertificado, "_blank");
  } catch (error) {
    console.error("Erro ao emitir certificado:", error);
    alert("Não foi possível emitir o certificado.");
  }
}

/**
 * Formata data (ISO → dd/mm/aaaa)
 */
function formatarData(data) {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
}
