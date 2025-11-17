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

  // 4. Preenchimento
  page.drawText(dados.nomeCurso, { x: 180, y: 430, size: 12, font: bold, color });
  page.drawText(dados.normas, { x: 180, y: 410, size: 12, font, color });
  page.drawText(dados.tabela, { x: 180, y: 390, size: 12, font, color });
  page.drawText(dados.nivel, { x: 120, y: 370, size: 12, font, color });

  const textoData = `${dados.cidade}, ${dados.dia} de ${dados.mes} de ${dados.ano}`;
  page.drawText(textoData, { x: 120, y: 340, size: 12, font, color });

  page.drawText(dados.nomeAluno, { x: 120, y: 310, size: 12, font: bold, color });
  page.drawText(dados.cpfAluno, { x: 120, y: 290, size: 12, font, color });

  page.drawText(dados.certificador, { x: 120, y: 250, size: 12, font: bold, color });
  page.drawText(dados.cargoCertificador, { x: 120, y: 230, size: 12, font, color });
  page.drawText(dados.registroCertificador, { x: 120, y: 210, size: 12, font, color });

  const pdfFinal = await pdfDoc.save();
  const outputPath = path.join(__dirname, `../tmp/certificado-${certificado.id_certificado}.pdf`);
  fs.writeFileSync(outputPath, pdfFinal);

  return outputPath;
}

async function gerarCertificadoStream(req, res) {
  const id_certificado = req.params.id;

  const certificado = await CertificadoDAO.buscarPorId(id_certificado);
  if (!certificado) throw new Error('Certificado não encontrado');

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

  const modeloPath = path.join(__dirname, '../templates/certificado_0.pdf');
  const modeloBytes = fs.readFileSync(modeloPath);

  const pdfDoc = await PDFDocument.load(modeloBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = rgb(0, 0, 0);

  page.drawText(dados.nomeCurso, { x: 180, y: 430, size: 12, font: bold, color });
  page.drawText(dados.normas, { x: 180, y: 410, size: 12, font, color });
  page.drawText(dados.tabela, { x: 180, y: 390, size: 12, font, color });
  page.drawText(dados.nivel, { x: 120, y: 370, size: 12, font, color });

  const textoData = `${dados.cidade}, ${dados.dia} de ${dados.mes} de ${dados.ano}`;
  page.drawText(textoData, { x: 120, y: 340, size: 12, font, color });

  page.drawText(dados.nomeAluno, { x: 120, y: 310, size: 12, font: bold, color });
  page.drawText(dados.cpfAluno, { x: 120, y: 290, size: 12, font, color });

  page.drawText(dados.certificador, { x: 120, y: 250, size: 12, font: bold, color });
  page.drawText(dados.cargoCertificador, { x: 120, y: 230, size: 12, font, color });
  page.drawText(dados.registroCertificador, { x: 120, y: 210, size: 12, font, color });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=certificado-${id_certificado}.pdf`
  );

  return res.send(pdfBytes);
}

module.exports = { 
  gerarCertificado,
  gerarCertificadoStream
};



