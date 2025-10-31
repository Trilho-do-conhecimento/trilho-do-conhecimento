const API_URL = "http://localhost:3000/rotas";

export async function buscarTreinamentos() {
  try {
    const response = await fetch(`${API_URL}/cursos`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar cursos.");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Erro ao carregar treinamentos:", error);
    throw error;
  }
}
