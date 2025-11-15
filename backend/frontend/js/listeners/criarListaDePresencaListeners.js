document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-lista");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCancelar = document.getElementById("btnCancelar");

  if (!form || !btnSalvar) return;

  // Util: pega valor "seguro" de um input por id
  const val = (id) => (document.getElementById(id)?.value || "").trim();

  // Serializa as linhas da tabela em arrays, ignorando linhas completamente vazias
  function coletarLinhasDaTabela() {
    const tbody = form.querySelector(".attendance-table tbody");
    const linhas = [...tbody.querySelectorAll("tr")];

    const nome_completo = [];
    const registro = [];
    const cargo = [];
    const area = [];
    const datas = [];
    const assinaturas = [];

    linhas.forEach((tr) => {
      const get = (name) =>
        (tr.querySelector(`input[name="${name}"]`)?.value || "").trim();

      const linha = {
        nome: get("nome_completo[]"),
        reg: get("registro[]"),
        car: get("cargo[]"),
        ar: get("area[]"),
        dt: get("datas[]"),
        ass: get("assinaturas[]"),
      };

      const tudoVazio =
        !linha.nome && !linha.reg && !linha.car && !linha.ar && !linha.dt && !linha.ass;

      if (!tudoVazio) {
        nome_completo.push(linha.nome);
        registro.push(linha.reg);
        cargo.push(linha.car);
        area.push(linha.ar);
        datas.push(linha.dt);
        assinaturas.push(linha.ass);
      }
    });

    return { nome_completo, registro, cargo, area, datas, assinaturas };
  }

  // Validação mínima 
  function validarCamposBasicos(payload) {
    const erros = [];

    if (!payload.atividade) erros.push("Informe a Atividade.");
    if (!payload.turma) erros.push("Informe a Turma.");

    const temParticipante = (payload.nome_completo || []).some((n) => n && n.trim() !== "");
    if (!temParticipante) erros.push("Inclua ao menos 1 participante (Nome completo).");

    return erros;
  }

  // Clique em Salvar 
  btnSalvar.addEventListener("click", async (e) => {
    e.preventDefault();

    // Monta payload no formato esperado pelas rotas/DAO
    const linhas = coletarLinhasDaTabela();
    const payload = {
      atividade: val("atividade"),
      turma: val("turma"),
      consultor: val("consultor"),
      horario: val("horario"),
      empresa: val("empresa"),
      local: val("local"),
      carga_horaria: val("carga_horaria"),
      data: val("data"),
      id_turma: val("id_turma"),
      // Arrays dos participantes (mantém o padrão name="campo[]")
      nome_completo: linhas.nome_completo,
      registro: linhas.registro,
      cargo: linhas.cargo,
      area: linhas.area,
      datas: linhas.datas,
      assinaturas: linhas.assinaturas,
    };

    // Validação simples
    const erros = validarCamposBasicos(payload);
    if (erros.length) {
      alert("Atenção:\n- " + erros.join("\n- "));
      return;
    }

    // Desabilita enquanto envia
    btnSalvar.setAttribute("aria-busy", "true");

    try {
      const resp = await fetch("/rotas/lista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // necessário para enviar o cookie do JWT
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const texto = await resp.text();
        throw new Error(texto || "Falha ao salvar.");
      }

      alert(" Lista salva com sucesso!");
      form.reset();
    } catch (err) {
      console.error("Erro ao salvar lista:", err);
      alert(" Erro ao salvar a lista de presença.\n" + (err?.message || ""));
    } finally {
      btnSalvar.removeAttribute("aria-busy");
    }
  });

 // limpa o formulário
    if (btnCancelar) {
        btnCancelar.addEventListener("click", (e) => {
          e.preventDefault();
                
        if (form) {
          form.reset();      
          alert("Formulário limpo com sucesso!"); 
        } else {
          console.error("Formulário 'form-cadastrar-usuario' não encontrado.");
        }
      });
    }
});
