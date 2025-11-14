const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const CertificadoDAO = require('../DAO/CertificadoDAO');

async function gerarCertificado(id_certificado) {
  // 1. Busca os dados no banco
  const certificado = await CertificadoDAO.buscarPorId(id_certificado);
  if (!certificado) throw new Error('Certificado não encontrado');

  // 2. Extrai os dados conforme banco
  const dados = {
    nomeAluno: certificado.concluinte.nome_completo,
    cpfAluno: certificado.concluinte.registro,

    nomeCurso: certificado.nome_certificado,
    descricao: certificado.descricao,
    normas: certificado.normas,
    tabela: certificado.tabela,
    nivel: certificado.nivel,

    cidade: certificado.cidade,

    dia: new Date(certificado.data_certificado).getDate(),
    mes: new Date(certificado.data_certificado).toLocaleString('pt-BR', { month: 'long' }),
    ano: new Date(certificado.data_certificado).getFullYear(),

    certificador: certificado.certificador,
    cargoCertificador: certificado.cargo_certificador,
    registroCertificador: certificado.registro_certificador
  };

  // 3. Carrega o modelo PDF 
  const modeloPath = path.join(__dirname, '../templates/certificado_0.pdf');
  const modeloBytes = fs.readFileSync(modeloPath);

  const pdfDoc = await PDFDocument.load(modeloBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = rgb(0, 0, 0);

  // 4. Preenche os campos conforme coordenadas do PDF

  // Nome do curso
  page.drawText(dados.nomeCurso, { x: 180, y: 430, size: 12, font: bold, color });

  // Normas
  page.drawText(dados.normas, { x: 180, y: 410, size: 12, font, color });

  // Tabela
  page.drawText(dados.tabela, { x: 180, y: 390, size: 12, font, color });

  // Nível
  page.drawText(dados.nivel, { x: 120, y: 370, size: 12, font, color });

  // Cidade e data
  const textoData = `${dados.cidade}, ${dados.dia} de ${dados.mes} de ${dados.ano}`;
  page.drawText(textoData, { x: 120, y: 340, size: 12, font, color });

  // Nome do aluno
  page.drawText(dados.nomeAluno, { x: 120, y: 310, size: 12, font: bold, color });

  // CPF aluno
  page.drawText(dados.cpfAluno, { x: 120, y: 290, size: 12, font, color });

  // Certificador
  page.drawText(dados.certificador, { x: 120, y: 250, size: 12, font: bold, color });

  // Cargo do certificador
  page.drawText(dados.cargoCertificador, { x: 120, y: 230, size: 12, font, color });

  // Registro do certificador
  page.drawText(dados.registroCertificador, { x: 120, y: 210, size: 12, font, color });

  // 5. Salva o PDF gerado
  const pdfFinal = await pdfDoc.save();
  const outputPath = path.join(__dirname, `../tmp/certificado-${certificado.id_certificado}.pdf`);

  fs.writeFileSync(outputPath, pdfFinal);

  return outputPath;
}

module.exports = { gerarCertificado };


