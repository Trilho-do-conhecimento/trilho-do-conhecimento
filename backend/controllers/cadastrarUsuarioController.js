import { cadastrarUsuario } from "../services/cadastrarUsuarioService.js";

export async function handleSubmitCadastro(event) {
  event.preventDefault();
  const form = event.target;
  const dataNascimento = form.querySelector("#nascimento").value;
  const regexData = /^\d{2}\/\d{2}\/\d{4}$/;

  if (dataNascimento && !regexData.test(dataNascimento)) {
    alert("Por favor, insira uma data válida no formato dd/mm/aaaa.");
    return;
  }

  const formData = new FormData(form);

  try {
    const result = await cadastrarUsuario(formData);
    alert(result.message || "Usuário cadastrado com sucesso!");
    window.location.href = "/pages/menuAdm.html";
  } catch (error) {
    alert(error.message || "Erro ao cadastrar usuário.");
  }
}

export function handleCancelarCadastro() {
  window.location.href = "/pages/menuAdm.html";
}

export function handleMascaraData(event) {
  let valor = event.target.value.replace(/\D/g, '');
  if (valor.length > 2 && valor.length <= 4) valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
  else if (valor.length > 4) valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
  event.target.value = valor.substring(0, 10);
}
