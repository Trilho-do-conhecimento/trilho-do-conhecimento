const API_URL = "http://localhost:3000/rotas";

/**
 * Verifica se o admin está autenticado.
 * Faz uma chamada GET à rota protegida de usuários.
 * O cookie 'auth_token' é enviado automaticamente com credentials: 'include'.
 */
export async function verifySession() {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include" // garante envio do cookie JWT
    });

    if (response.status === 401) {
      throw new Error("Sessão expirada ou inválida. Faça login novamente.");
    }

    if (!response.ok) {
      throw new Error("Erro ao verificar sessão do usuário.");
    }

    return await response.json(); // Retorna lista de usuários (pode ser usada para validar)
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    throw error;
  }
}

/**
 *  Logout — limpa o cookie e redireciona o usuário.
 */
export function clearAuthToken() {
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log("Auth token removido com sucesso.");
}
