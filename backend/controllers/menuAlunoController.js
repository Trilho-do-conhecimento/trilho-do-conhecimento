import {
  verifySessionAluno,
  buscarTreinamentos,
  buscarCertificados,
  clearAuthToken
} from "../services/menuAlunoService.js";

export async function initMenuAluno() {
  try {
    await verifySessionAluno();
    console.log("Sessão do aluno validada com sucesso.");
  } catch (error) {
    console.error("Sessão inválida:", error);
    alert("Sua sessão expirou. Faça login novamente.");
    window.location.href = "../pages/login.html";
  }
}

// === Meus treinamentos ===
export async function handleOpenTreinamentos(event) {
  event.preventDefault();

  try {
    const cursos = await buscarTreinamentos();

    const container = document.querySelector(".trainings-control .container");
    container.innerHTML = `
      <h1>Meus Treinamentos</h1>
      <ul class="lista-treinamentos">
        ${cursos
          .map(
            c => `
            <li>
              <strong>${c.nome}</strong> — ${c.area} <br>
              <em>Status: ${c.status}</em> • 
              <span>${c.carga_horaria}h</span>
            </li>
          `
          )
          .join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Erro ao carregar treinamentos:", error);
    alert("Não foi possível carregar seus treinamentos.");
  }
}

// === Meus certificados ===
export async function handleOpenCertificados(event) {
  event.preventDefault();

  try {
    const certificados = await buscarCertificados();

    const container = document.querySelector(".trainings-control .container");
    container.innerHTML = `
      <h1>Meus Certificados</h1>
      <ul class="lista-certificados">
        ${certificados
          .map(
            cert => `
            <li>
              <strong>${cert.nome_certificado}</strong> <br>
              <em>ID:</em> ${cert.id_certificado}
            </li>
          `
          )
          .join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Erro ao carregar certificados:", error);
    alert("Não foi possível carregar seus certificados.");
  }
}

// === Logout opcional ===
export function handleLogout(event) {
  event.preventDefault();
  clearAuthToken();
  window.location.href = "../pages/login.html";
}
