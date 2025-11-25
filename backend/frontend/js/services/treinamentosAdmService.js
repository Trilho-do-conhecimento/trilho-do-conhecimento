const API_URL = "http://localhost:3000/rotas";

export async function buscarTreinamentos() {
  try {
    // Obter token do localStorage ou sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const headers = {
      "Content-Type": "application/json"
    };

    // Adicionar token se existir
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/cursos`, {
      method: "GET",
      headers: headers,
      credentials: "include"
    });

    console.log('📡 Status da resposta:', response.status);

    if (response.status === 401) {
      // Limpar token inválido
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro ${response.status} ao buscar cursos`);
    }

    const result = await response.json();
    return result.data || result;

  } catch (error) {
    console.error('Erro completo:', error);
    throw error;
  }
}