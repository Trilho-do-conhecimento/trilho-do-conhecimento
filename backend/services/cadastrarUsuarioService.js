const API_URL = "http://localhost:3000/rotas";

export async function cadastrarUsuario(formData) {
  const response = await fetch(`${API_URL}/usuarios/cadastrar`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Erro ao cadastrar usuário.");
  return result;
}
