import { loginUser, sendRecoveryEmail } from "../services/loginService.js"

// Login
export async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await loginUser(email, senha);
    if (response.success) {

      localStorage.setItem("userId", response.userId);   // ID do usuário
      localStorage.setItem("userType", response.userType);  // tipo (admin/aluno)
      localStorage.setItem("email", email);  // email

      if (response.userType === 'admin') {
        window.location.href = "/pages/menuAdm.html";
      } else {
        window.location.href = "/pages/menuAluno.html";
      }
    } else {
      alert(response.message || "Usuário ou senha inválidos.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao tentar fazer login. Tente novamente.");
  }
}

//  Abrir modal
export function handleOpenModal(event) {
  event.preventDefault();
  const modal = document.getElementById("modal-overlay");
  modal.classList.add("active");
}

//  Fechar modal
export function handleCloseModal() {
  const modal = document.getElementById("modal-overlay");
  modal.classList.remove("active");
}

// Envio de recuperação de senha
export async function handleRecoverySubmit(event) {
  event.preventDefault();

  const email = document.getElementById("recovery-email").value.trim();
  if (!email) {
    alert("Digite um e-mail válido.");
    return;
  }

  try {
    const response = await sendRecoveryEmail(email);
    alert(response.message);
    handleCloseModal();
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    alert("Erro ao enviar e-mail de recuperação.");
  }
}
