const API_URL = "http://localhost:3000/rotas";

function formDataParaJson(formData) {
  var objeto = {};
  formData.forEach((value, key) => {objeto[key] = value;    
  });
  return objeto;
}

export async function cadastrarUsuario(formData) {
  const dadosJson = formDataParaJson(formData);
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosJson),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Erro ao cadastrar usuário.");
  return result;
}
