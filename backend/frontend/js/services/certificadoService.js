const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const CertificadoDAO = require('../../../DAO/CertificadoDAO')

/**
 * Função para centralizar o texto horizontalmente.
  @param {PDFPage} page - A página do PDF.
 * @param {number} width - A largura da página.
 * @param {string} text - O texto a ser desenhado.
 * @param {number} y - A coordenada Y onde o texto será desenhado (base).
 * @param {object} options - Opções de drawText (size, font, color, etc.).
 */
function drawCenteredText(page, width, text, y, options = {}) {
  // Calcula a largura do texto com a fonte e tamanho especificados
  const textWidth = options.font.widthOfTextAtSize(text, options.size);
  
  // Calcula a coordenada X para centralizar
  const x = (width / 2) - (textWidth / 2);
  
  // Desenha o texto
  page.drawText(text, { x, y, ...options });
}

/**
 * Calcula a altura que um texto envolto (wrapped) irá ocupar.
 * @param {string} text - O texto a ser medido.
 * @param {PDFFont} font - A fonte.
 * @param {number} size - O tamanho da fonte.
 * @param {number} maxWidth - A largura máxima permitida para o texto.
 * @param {number} defaultLineHeight - A altura da linha.
 * @returns {number} A altura total usada pelo texto.
 */
function calculateWrappedTextHeight(text, font, size, maxWidth, defaultLineHeight) {
  const words = text.split(/\s+/); 
  let currentLine = '';
  let lineCount = 1;

  if (text.trim() === '') return defaultLineHeight;

  for (const word of words) {
    const testLine = currentLine + (currentLine.length > 0 ? ' ' : '') + word;
    if (font.widthOfTextAtSize(testLine, size) < maxWidth) {
      currentLine = testLine;
    } else {
      lineCount++;
      currentLine = word;
    }
  }
  return lineCount * defaultLineHeight;
}


/**
 * Lógica central de preenchimento do certificado. Usada por ambas as funções de exportação.
 * @param {object} certificado - Dados do certificado.
 * @param {PDFPage} page - A página do PDF.
 * @param {PDFFont} font - Fonte Helvetica normal.
 * @param {PDFFont} bold - Fonte Helvetica Bold.
 * @param {RGB} color - Cor do texto.
 */
async function preencherCertificado(certificado, page, font, bold, color) {
  //dados
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

  const { width, height } = page.getSize();

  const lineHeight = 15; 
  const fontSize = 10; 
  
  const xAlign = 120; s
  const textMaxWidth = width - (2 * xAlign); 
  
  let currentY = height - 160; 

  // Função auxiliar para centralizar
  const centerText = (text, y, options) => drawCenteredText(page, width, text, y, options);
  
  // Informações do curso e corpo do Certificado
  
  // Título do Curso 
  currentY -= 40; 
  // AJUSTE 1: Título reduzido de 20 para 16
  centerText(dados.nomeCurso.toUpperCase(), currentY, { size: 16, font: bold, color });
  
  // Frase de Outorga
  currentY -= 30; 
  const textoOutorgaP1 = `Certificamos que o(a) aluno(a):`;
  centerText(textoOutorgaP1, currentY, { size: 12, font, color });
  
  // Nome do Aluno
  currentY -= 20;
  centerText(dados.nomeAluno.toUpperCase(), currentY, { size: 18, font: bold, color });

  // Registro do Concluinte
  currentY -= lineHeight;
  centerText(`Registro: ${dados.cpfAluno}`, currentY, { size: fontSize + 1, font, color });
  
  currentY -= 30; 
  const textoOutorgaP2 = `concluiu com êxito o curso acima mencionado, de acordo com as seguintes especificações:`;
  centerText(textoOutorgaP2, currentY, { size: 12, font, color });
  
  currentY -= 40;
  
  // Nível
  page.drawText(`Nível: ${dados.nivel}`, { x: xAlign, y: currentY, size: fontSize, font, color });
  currentY -= lineHeight;
  
  // Normas
  const normasText = `Normas: ${dados.normas}`;
  const normasHeight = calculateWrappedTextHeight(normasText, font, fontSize, textMaxWidth, lineHeight);
  currentY -= (normasHeight - lineHeight); 
  page.drawText(normasText, { 
    x: xAlign, y: currentY, size: fontSize, font, color, 
    maxWidth: textMaxWidth, 
    lineHeight: lineHeight 
  });
  currentY -= lineHeight;
  
  // Tabela
  page.drawText(`Tabela: ${dados.tabela}`, { x: xAlign, y: currentY, size: fontSize, font, color });
  currentY -= lineHeight;
  
  // Descrição
  currentY -= 10;
  const descricaoText = `Descrição: ${dados.descricao}`;
  const descricaoHeight = calculateWrappedTextHeight(descricaoText, font, fontSize, textMaxWidth, lineHeight);
  currentY -= (descricaoHeight - lineHeight); 
  page.drawText(descricaoText, { 
    x: xAlign, y: currentY, size: fontSize, font, color, 
    maxWidth: textMaxWidth, 
    lineHeight: lineHeight 
  });
  currentY -= lineHeight;

  // Data de Emissão 
  currentY -= 80;
  const textoData = `${dados.cidade}, ${dados.dia} de ${dados.mes} de ${dados.ano}`;
  
  centerText(textoData, currentY, { size: 12, font: bold, color });

  // Assinatura/Certificador 
  const yRodape = 90; // Posição Y fixa para o rodapé 
  const yLinha = yRodape + lineHeight * 3; // Linha de assinatura
  const yCertificador = yRodape + lineHeight * 2; // Nome do Certificador

  // Linha da assinatura
  centerText(`____________________________________`, yLinha, { size: 12, font, color });
  
  // Dados do Certificador
  centerText(dados.certificador, yCertificador, { size: 12, font: bold, color });
  
}


// Funções de exportação

async function gerarCertificado(id_certificado) {
  // 1. Busca os dados no banco
  const certificado = await CertificadoDAO.buscarPorId(id_certificado);
  if (!certificado) throw new Error('Certificado não encontrado');

  // 2. Carrega o modelo PDF
  const modeloPath = path.join(__dirname, '../templates/certificado_0.pdf');
  const modeloBytes = fs.readFileSync(modeloPath);

  const pdfDoc = await PDFDocument.load(modeloBytes);
  const page = pdfDoc.getPages()[0];

  // Embutindo fontes
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = rgb(0, 0, 0);

  // 3. Preenchimento Refatorado
  await preencherCertificado(certificado, page, font, bold, color);

  const pdfFinal = await pdfDoc.save();
  const outputPath = path.join(__dirname, `../tmp/certificado-${certificado.id_certificado}.pdf`);
  fs.writeFileSync(outputPath, pdfFinal);

  return outputPath;
}

async function gerarCertificadoStream(req, res) {
  const id_certificado = req.params.id;

  const certificado = await CertificadoDAO.buscarPorId(id_certificado);
  if (!certificado) throw new Error('Certificado não encontrado');

  const modeloPath = path.join(__dirname, '..', '..', '../templates/certificado_0.pdf');
  const modeloBytes = fs.readFileSync(modeloPath);

  const pdfDoc = await PDFDocument.load(modeloBytes);
  const page = pdfDoc.getPages()[0];

  // Embutindo fontes
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = rgb(0, 0, 0);

  // Preenchimento Refatorado
  await preencherCertificado(certificado, page, font, bold, color);

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