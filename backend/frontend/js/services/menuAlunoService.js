const API_URL = "http://localhost:3000/rotas";

export async function verifySessionAluno() {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include" // envia cookie JWT
    });

    if (response.status === 401) {
      throw new Error("Sessão expirada ou inválida. Faça login novamente.");
    }

    if (!response.ok) {
      throw new Error("Erro ao verificar sessão do aluno.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    throw error;
  }
}

// Buscar treinamentos 
export async function buscarTreinamentos() {
  try {
    const response = await fetch(`${API_URL}/cursos`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro ao buscar cursos.");
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Erro ao buscar treinamentos:", error);
    throw error;
  }
}

// Buscar certificados
export async function buscarCertificados() {
  try {
    const response = await fetch(`${API_URL}/certificados`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro ao buscar certificados.");
    const result = await response.json();
    return result.data || result; // adapta à resposta do DAO
  } catch (error) {
    console.error("Erro ao buscar certificados:", error);
    throw error;
  }
}

// Logout 
export function clearAuthToken() {
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log("Auth token removido (aluno).");
}
