

// const resultados = []; // Array para guardar os resultados agrupados

// // Função principal de cálculo
// function calcularTrelicas(comodo, comprimento, largura, espacamento) {
//   if (largura > 12) {
//     alert("⚠️ A largura máxima da treliça é 12 metros!");
//     return;
//   }

//   const quantidade = Math.ceil(comprimento / espacamento) + 1;
//   const resultado = {
//     comodo,
//     comprimento,
//     largura,
//     espacamento,
//     quantidade
//   };

//   resultados.push(resultado);
//   alert(`✅ ${comodo} adicionado: ${quantidade} treliças de ${largura}m.`);
// }

// // Função para exibir o resumo agrupado
// function mostrarResumo() {
//   if (resultados.length === 0) {
//     alert("Nenhum resultado salvo ainda!");
//     return;
//   }

//   let resumo = "📊 RESUMO DE TRELIÇAS\n\n";
//   const mapa = {}; // objeto para agrupar por tamanho

//   resultados.forEach(r => {
//     resumo += `• ${r.comodo}: ${r.quantidade} treliças de ${r.largura}m\n`;
//     if (!mapa[r.largura]) mapa[r.largura] = 0;
//     mapa[r.largura] += r.quantidade;
//   });

//   resumo += "\n=== AGRUPAMENTO POR TAMANHO ===\n";
//   let totalGeral = 0;
//   for (const tamanho in mapa) {
//     resumo += `Treliças de ${tamanho}m: ${mapa[tamanho]} un.\n`;
//     totalGeral += mapa[tamanho];
//   }

//   resumo += `\nTOTAL GERAL: ${totalGeral} treliças.\n`;

//   console.log(resumo);
//   alert("Resumo completo foi exibido no console (F12).");

//   return resumo;
// }

// // Função para gerar o documento Word (.docx)
// function gerarWord() {
//   if (resultados.length === 0) {
//     alert("Nenhum cálculo para exportar!");
//     return;
//   }

//   const resumo = mostrarResumo();
//   const conteudo = `
//     <html xmlns:o='urn:schemas-microsoft-com:office:office' 
//           xmlns:w='urn:schemas-microsoft-com:office:word' 
//           xmlns='http://www.w3.org/TR/REC-html40'>
//     <head><meta charset='utf-8'><title>Relatório de Treliças</title></head>
//     <body>
//       <h2>Relatório de Treliças</h2>
//       <pre>${resumo}</pre>
//     </body>
//     </html>`;

//   const blob = new Blob(['\ufeff', conteudo], {
//     type: 'application/msword'
//   });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'Relatorio_Trelicas.doc';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
//   alert("📄 Documento Word gerado com sucesso!");
// }

// // Função interativa (para testar no navegador)
// function iniciarCalculadora() {
//   let continuar = true;

//   while (continuar) {
//     const comodo = prompt("Nome do cômodo:");
//     const comprimento = parseFloat(prompt("Comprimento (m):"));
//     const largura = parseFloat(prompt("Largura (m):"));
//     const espacamento = parseFloat(prompt("Espaçamento entre treliças (m):"));

//     if (isNaN(comprimento) || isNaN(largura) || isNaN(espacamento)) {
//       alert("❌ Digite valores numéricos válidos.");
//       continue;
//     }

//     calcularTrelicas(comodo, comprimento, largura, espacamento);

//     const opcao = prompt("Deseja adicionar outro cômodo? (s/n):").toLowerCase();
//     if (opcao !== 's') continuar = false;
//   }

//   mostrarResumo();

//   const gerar = confirm("Deseja gerar o documento Word com os resultados?");
//   if (gerar) gerarWord();
// }

// // Chame esta função para começar:
// iniciarCalculadora();


const resultados = []; // guarda os resultados

// Botão "Adicionar"
document.getElementById("btnAdicionar").addEventListener("click", () => {
  const comodo = document.getElementById("comodo").value.trim();
  const comprimento = parseFloat(document.getElementById("comprimento").value);
  const largura = parseFloat(document.getElementById("largura").value);
  const espacamentoCm = parseFloat(document.getElementById("espacamento").value); // agora em cm

  if (!comodo || isNaN(comprimento) || isNaN(largura) || isNaN(espacamentoCm)) {
    alert("❌ Preencha todos os campos corretamente!");
    return;
  }

  if (largura > 12 || comprimento > 12) {
    alert("⚠️ O comprimento e a largura máximos permitidos são 12 metros!");
    return;
  }

  // conversão: cm -> m
  const espacamento = espacamentoCm / 100;

  if (espacamento <= 0) {
    alert("⚠️ O espaçamento deve ser maior que zero!");
    return;
  }

  const quantidade = Math.ceil(comprimento / espacamento) + 1;

  const resultado = { comodo, comprimento, largura, espacamentoCm, quantidade };
  resultados.push(resultado);

  atualizarTabela();
  limparCampos();
});

function atualizarTabela() {
  const tbody = document.querySelector("#tabelaResultados tbody");
  tbody.innerHTML = "";

  resultados.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.comodo}</td>
      <td>${r.comprimento.toFixed(2)}</td>
      <td>${r.largura.toFixed(2)}</td>
      <td>${r.espacamentoCm.toFixed(1)} cm</td>
      <td>${r.quantidade}</td>
    `;
    tbody.appendChild(tr);
  });
}

function limparCampos() {
  document.getElementById("comodo").value = "";
  document.getElementById("comprimento").value = "";
  document.getElementById("largura").value = "";
  document.getElementById("espacamento").value = "";
}

// Gerar resumo agrupado
function mostrarResumo() {
  if (resultados.length === 0) {
    document.getElementById("textoResumo").textContent = "Nenhum cálculo realizado ainda.";
    return;
  }

  let resumo = " RESUMO DE TRELIÇAS\n\n";
  const mapa = {};
  resultados.forEach(r => {
    resumo += `• ${r.comodo}: ${r.quantidade} treliças de ${r.largura}m (esp. ${r.espacamentoCm} cm)\n`;
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
  document.getElementById("textoResumo").textContent = resumo;
  return resumo;
}

// Gerar Word
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

  const blob = new Blob(['\ufeff', conteudo], { type: 'application/msword' });
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
