// Caminho: backend/frontend/js/listeners/loginListeners.js

import { handleLogin, handleOpenModal, handleCloseModal, handleRecoverySubmit } from "../controllers/loginController.js";

// Selecionar elementos do DOM
const loginForm = document.querySelector(".login-form");
const openModalLink = document.getElementById("forgot-password-link");
const closeModalBtn = document.getElementById("modal-close");
const modalOverlay = document.getElementById("modal-overlay");
const recoveryForm = document.getElementById("recovery-form");

// Evento de login
loginForm.addEventListener("submit", handleLogin);

// Abrir modal de recuperação
openModalLink.addEventListener("click", handleOpenModal);

// Fechar modal 
closeModalBtn.addEventListener("click", handleCloseModal);

// Fechar modal clicando fora
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) handleCloseModal();
});

// Envio do formulário de recuperação
recoveryForm.addEventListener("submit", handleRecoverySubmit);
