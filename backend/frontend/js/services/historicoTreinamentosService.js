const API_URL = "http://localhost:3000/rotas";

/**
 * Busca o histórico de treinamentos do aluno logado.
 */
export async function buscarHistoricoAluno() {
  try {
    const response = await fetch(`${API_URL}/turmas/historico`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include" // envia cookie JWT
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico de treinamentos.");
    }

    const result = await response.json();
    return result.data || result; // compatível com retorno do backend
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    throw error;
  }
}

/**
 * Solicita a emissão de certificado para um treinamento concluído.
 */
export async function emitirCertificado(idTreinamento) {
  try {
    const response = await fetch(`${API_URL}/certificados/${idTreinamento}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Erro ao emitir certificado.");
    }

    const result = await response.json();
    return result.link || "#"; // URL do certificado
  } catch (error) {
    console.error("Erro ao emitir certificado:", error);
    throw error;
  }
}
