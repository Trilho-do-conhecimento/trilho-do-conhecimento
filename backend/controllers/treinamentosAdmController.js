import { buscarTreinamentos } from "../services/treinamentosAdmService.js";

export async function initTreinamentosAdm() {
  try {
    const cursos = await buscarTreinamentos();
    renderTabelaTreinamentos(cursos);
  } catch (error) {
    console.error("Erro ao carregar treinamentos:", error);
    alert("Não foi possível carregar os treinamentos.");
  }
}

export function renderTabelaTreinamentos(cursos) {
  const tbody = document.querySelector(".trainings-table tbody");
  tbody.innerHTML = "";

  cursos.forEach((curso, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${curso.nome}</td>
      <td>${formatarData(curso.data_inicio)}</td>
      <td><span class="status-${curso.status.replace(' ', '-').toLowerCase()}">${curso.status}</span></td>
      <td><a href="#" data-id="${curso.id}">Lista de presença</a></td>
    `;
    tbody.appendChild(tr);
  });
}

export function handleFiltrarTreinamentos() {
  alert("Função de filtro em desenvolvimento.");
}

export function handleAbrirListaPresenca(event) {
  const idCurso = event.target.dataset.id;
  window.location.href = `../pages/criarListaDePresenca.html?id=${idCurso}`;
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}
