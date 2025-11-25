import { buscarTreinamentos } from "../services/treinamentosAdmService.js"; // Remover espaço extra

export async function initTreinamentosAdm() {
  try {
    const cursos = await buscarTreinamentos();
    renderTabelaTreinamentos(cursos);
    adicionarEventListeners(); // Adicionar listeners após renderizar
  } catch (error) {
    console.error("Erro ao carregar treinamentos:", error);
    mostrarErro("Não foi possível carregar os treinamentos.");
  }
}

export function renderTabelaTreinamentos(cursos) {
  const tbody = document.querySelector(".trainings-table tbody");
  
  if (!tbody) {
    console.error('Elemento tbody não encontrado');
    return;
  }

  if (!cursos || cursos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">Nenhum treinamento encontrado</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  cursos.forEach((curso, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${curso.nome || 'N/A'}</td>
      <td>${formatarData(curso.data_inicio)}</td>
      <td><span class="status-${(curso.status || '').replace(' ', '-').toLowerCase()}">${curso.status || 'N/A'}</span></td>
      <td><a href="#" class="lista-presenca-link" data-id="${curso.id}">Lista de presença</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarEventListeners() {
  // Listener para links de lista de presença
  const linksPresenca = document.querySelectorAll('.lista-presenca-link');
  linksPresenca.forEach(link => {
    link.addEventListener('click', handleAbrirListaPresenca);
  });

  // Listener para botão de filtro
  const btnFiltro = document.getElementById('btnFiltro');
  if (btnFiltro) {
    btnFiltro.addEventListener('click', handleFiltrarTreinamentos);
  }

  // Listener para formulário de filtro
  const formFiltro = document.getElementById('formFiltro');
  if (formFiltro) {
    formFiltro.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFiltrarTreinamentos();
    });
  }

  // Listener para fechar filtro
  const fecharFiltro = document.getElementById('fecharFiltro');
  if (fecharFiltro) {
    fecharFiltro.addEventListener('click', () => {
      const painelFiltro = document.getElementById('painelFiltro');
      painelFiltro.classList.remove('ativo');
    });
  }
}

export function handleFiltrarTreinamentos() {
  const painelFiltro = document.getElementById('painelFiltro');
  painelFiltro.classList.toggle('ativo');
}

export function handleAbrirListaPresenca(event) {
  event.preventDefault();
  const idCurso = event.target.dataset.id;
  
  if (!idCurso) {
    console.error('ID do curso não encontrado');
    return;
  }
  
  window.location.href = `../pages/criarListaDePresenca.html?id=${idCurso}`;
}

function formatarData(data) {
  if (!data) return 'N/A';
  return new Date(data).toLocaleDateString("pt-BR");
}

function mostrarErro(mensagem) {
  // Substituir alert por uma mensagem mais amigável
  const erroDiv = document.createElement('div');
  erroDiv.className = 'erro-mensagem';
  erroDiv.style.cssText = `
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 4px;
    margin: 10px 0;
    text-align: center;
  `;
  erroDiv.textContent = mensagem;
  
  const container = document.querySelector('.container');
  const primeiroFilho = container.firstElementChild;
  container.insertBefore(erroDiv, primeiroFilho);
  
  // Remover após 5 segundos
  setTimeout(() => {
    erroDiv.remove();
  }, 5000);
}