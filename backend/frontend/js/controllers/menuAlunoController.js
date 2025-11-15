import {
  clearAuthToken
} from "../services/menuAlunoService.js";

// export async function initMenuAluno() {
//   try {
//     await verifySessionAluno();
//     console.log("Sessão do aluno validada com sucesso.");
//   } catch (error) {
//     console.error("Sessão inválida:", error);
//     alert("Sua sessão expirou. Faça login novamente.");
//     window.location.href = "../pages/index.html";
//   }
// }

// === Meus treinamentos ===
export function handleOpenTreinamentos(event) {
    event.preventDefault(); 
        window.location.href = "historicoTreinamentosAluno.html"; 
}

// === Meus certificados ===
export function handleOpenCertificados(event) {
    event.preventDefault(); 
        window.location.href = "telaCertificado.html"; 
}

// === Logout opcional ===
export function handleLogout(event) {
  event.preventDefault();
  clearAuthToken();
  window.location.href = "/pages/index.html";
}
