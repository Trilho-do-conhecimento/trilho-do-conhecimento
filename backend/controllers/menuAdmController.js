import { verifySession, clearAuthToken } from "../services/menuAdmService.js";

/**
 * Inicializa a página e valida a sessão do administrador.
 */
export async function initMenuAdm() {
  try {
    await verifySession();
    console.log("Sessão válida. Menu carregado com sucesso.");
  } catch (error) {
    console.error("Sessão inválida:", error);
    alert("Sua sessão expirou. Faça login novamente.");
    window.location.href = "../pages/login.html";
  }
}

/**
 * Redireciona para a página de treinamentos.
 */
export function handleOpenTreinamentos(event) {
  event.preventDefault();
  window.location.href = "../pages/treinamentosAdm.html";
}

/**
 * Redireciona para a página de criação de listas de presença.
 */
export function handleOpenListaPresenca(event) {
  event.preventDefault();
  window.location.href = "../pages/criarListaDePresenca.html";
}

/**
 * Redireciona para o modo simulado de aluno.
 */
export function handleOpenMenuAluno(event) {
  event.preventDefault();
  window.location.href = "../pages/menuAluno.html";
}

/**
 * Redireciona para a tela de certificados.
 */
export function handleOpenCertificados(event) {
  event.preventDefault();
  window.location.href = "../pages/telaCertificado.html";
}

/**
 * Redireciona para a página de cadastro de novos usuários.
 */
export function handleOpenCadastroUsuario(event) {
  event.preventDefault();
  window.location.href = "../pages/cadastrarUsuario.html";
}

/**
 * Efetua logout e redireciona para o login.
 * (Opcional — caso adicione um botão de sair no HTML)
 */
export function handleLogout(event) {
  event.preventDefault();
  clearAuthToken();
  window.location.href = "../pages/login.html";
}
