

const resultados = []; // Array para guardar os resultados agrupados

// Função principal de cálculo
function calcularTrelicas(comodo, comprimento, largura, espacamento) {
  if (largura > 12) {
    alert("⚠️ A largura máxima da treliça é 12 metros!");
    return;
  }

  const quantidade = Math.ceil(comprimento / espacamento) + 1;
  const resultado = {
    comodo,
    comprimento,
    largura,
    espacamento,
    quantidade
  };

  resultados.push(resultado);
  alert(`✅ ${comodo} adicionado: ${quantidade} treliças de ${largura}m.`);
}

// Função para exibir o resumo agrupado
function mostrarResumo() {
  if (resultados.length === 0) {
    alert("Nenhum resultado salvo ainda!");
    return;
  }

  let resumo = "📊 RESUMO DE TRELIÇAS\n\n";
  const mapa = {}; // objeto para agrupar por tamanho

  resultados.forEach(r => {
    resumo += `• ${r.comodo}: ${r.quantidade} treliças de ${r.largura}m\n`;
    if (!mapa[r.largura]) mapa[r.largura] = 0;
    mapa[r.largura] += r.quantidade;
  });

  resumo += "\n=== AGRUPAMENTO POR TAMANHO ===\n";
  let totalGeral = 0;
  for (const tamanho in mapa) {
    resumo += `Treliças de ${tamanho}m: ${mapa[tamanho]} un.\n`;
    totalGeral += mapa[tamanho];
  }

  resumo += `\nTOTAL GERAL: ${totalGeral} treliças.\n`;

  console.log(resumo);
  alert("Resumo completo foi exibido no console (F12).");

  return resumo;
}

// Função para gerar o documento Word (.docx)
function gerarWord() {
  if (resultados.length === 0) {
    alert("Nenhum cálculo para exportar!");
    return;
  }

  const resumo = mostrarResumo();
  const conteudo = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Relatório de Treliças</title></head>
    <body>
      <h2>Relatório de Treliças</h2>
      <pre>${resumo}</pre>
    </body>
    </html>`;

  const blob = new Blob(['\ufeff', conteudo], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Relatorio_Trelicas.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert("📄 Documento Word gerado com sucesso!");
}

// Função interativa (para testar no navegador)
function iniciarCalculadora() {
  let continuar = true;

  while (continuar) {
    const comodo = prompt("Nome do cômodo:");
    const comprimento = parseFloat(prompt("Comprimento (m):"));
    const largura = parseFloat(prompt("Largura (m):"));
    const espacamento = parseFloat(prompt("Espaçamento entre treliças (m):"));

    if (isNaN(comprimento) || isNaN(largura) || isNaN(espacamento)) {
      alert("❌ Digite valores numéricos válidos.");
      continue;
    }

    calcularTrelicas(comodo, comprimento, largura, espacamento);

    const opcao = prompt("Deseja adicionar outro cômodo? (s/n):").toLowerCase();
    if (opcao !== 's') continuar = false;
  }

  mostrarResumo();

  const gerar = confirm("Deseja gerar o documento Word com os resultados?");
  if (gerar) gerarWord();
}

// Chame esta função para começar:
iniciarCalculadora();
