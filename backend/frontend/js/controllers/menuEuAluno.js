import {
  clearAuthToken
} from "../services/menuEuAlunoService.js";

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
