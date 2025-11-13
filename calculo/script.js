const resultados = [];

const form = document.getElementById("formTrelica");
const tabelaBody = document.querySelector("#tabelaResultados tbody");
const resumoTexto = document.getElementById("textoResumo");

const caminhoLogo = "./logo.png";
let imagemBase64 = "";

// Carregar logo em base64
fetch(caminhoLogo)
  .then(res => res.blob())
  .then(blob => {
    const reader = new FileReader();
    reader.onloadend = () => {
      imagemBase64 = reader.result;
    };
    reader.readAsDataURL(blob);
  })
  .catch(() => {
    console.warn("⚠️ Não foi possível carregar o logo local.");
  });

// Evento de envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const comodo = document.getElementById("comodo").value.trim();
  const comprimento = parseFloat(document.getElementById("comprimento").value);
  const largura = parseFloat(document.getElementById("largura").value);
  const espacamento = parseFloat(document.getElementById("espacamento").value) / 100; // cm → m

  if (!comodo || isNaN(comprimento) || isNaN(largura)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  if (largura > 12) {
    alert("⚠️ A largura máxima é de 12 metros.");
    return;
  }

  // ✅ NOVA FÓRMULA:
  // quantidade = (comprimento + 0.10) / espacamento
  // O resultado é truncado (sem casas decimais)
  const quantidade = Math.trunc((comprimento + 0.10) / espacamento);

  resultados.push({ comodo, comprimento, largura, espacamento: espacamento * 100, quantidade });

  adicionarLinhaTabela(comodo, comprimento, largura, espacamento * 100, quantidade);
  form.reset();
  document.getElementById("espacamento").value = 42;
});

// Função para adicionar linha na tabela
function adicionarLinhaTabela(comodo, comprimento, largura, espacamento, quantidade) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${comodo}</td>
    <td>${comprimento}</td>
    <td>${largura}</td>
    <td>${espacamento}</td>
    <td>${quantidade}</td>
  `;
  tabelaBody.appendChild(tr);
}

// Botão de resumo
document.getElementById("btnResumo").addEventListener("click", () => {
  if (resultados.length === 0) {
    resumoTexto.textContent = "Nenhum cálculo realizado ainda.";
    return;
  }

  const mapa = {};
  let texto = "RESUMO DE TRELIÇAS:\n\n";

  resultados.forEach(r => {
    texto += `• ${r.comodo}: ${r.quantidade} treliças de ${r.largura}m\n`;
    if (!mapa[r.largura]) mapa[r.largura] = 0;
    mapa[r.largura] += r.quantidade;
  });

  texto += "\nAGRUPAMENTO POR TAMANHO:\n";
  let total = 0;
  for (const largura in mapa) {
    texto += `Treliças de ${largura}m: ${mapa[largura]} un.\n`;
    total += mapa[largura];
  }
  texto += `\nTOTAL GERAL: ${total} treliças.`;

  resumoTexto.textContent = texto;
});

// Exportar PDF com jsPDF
document.getElementById("btnExportar").addEventListener("click", async () => {
  if (resultados.length === 0) {
    alert("Nenhum dado para exportar!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  if (imagemBase64) {
  const imgProps = doc.getImageProperties(imagemBase64);
  const pdfWidth = doc.internal.pageSize.getWidth();
  
  // Define largura máxima da imagem (ex: 60 mm)
  const imgWidth = 60;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  const x = (pdfWidth - imgWidth) / 2; // centraliza
  
  doc.addImage(imagemBase64, "PNG", x, 15, imgWidth, imgHeight);
  y = 15 + imgHeight + 15; // avança o texto para baixo da logo
}


  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Relatório de Treliças", 105, y, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(12);
  const texto = resumoTexto.textContent.split("\n");
  y += 10;
  texto.forEach(linha => {
    if (y > 280) { // cria nova página se ultrapassar limite
      doc.addPage();
      y = 20;
    }
    doc.text(linha, 20, y);
    y += 8;
  });

  doc.save("Relatorio_Trelicas.pdf");
});
