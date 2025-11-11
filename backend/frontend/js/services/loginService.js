const API_URL = "http://localhost:3000/rotas"; // ajuste conforme o backend

// 🔹 Login do usuário
export async function loginUser(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) throw new Error("Erro ao fazer login");

  return response.json();
}

// 🔹 Enviar e-mail de recuperação
export async function sendRecoveryEmail(email) {
  const response = await fetch(`${API_URL}/recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Erro ao enviar e-mail");

  return response.json();
}
