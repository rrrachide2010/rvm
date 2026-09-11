// Contraste do texto COMO ELE APARECE NA TELA.
//
// A auditoria de `npm run tokens` cobre duas coisas: os pares que o sistema
// prescreve, e token proibido usado como cor de texto no CSS. Nenhuma das duas
// pega o caso em que a cor vem de herança, de um seletor combinado ou de uma
// regra que ninguém leu — e foi exatamente isso que quase escapou na virada da
// paleta escura para a clara: `.rodape .identidade` ficou greige sobre canvas,
// 1.06:1, invisível, e o CSS não tinha um único hex errado.
//
// Este script abre cada página num navegador de verdade, olha todo elemento
// com texto e mede a razão contra o fundo efetivo — o primeiro ancestral com
// fundo opaco, que é o que o olho enxerga.
//
// Fora da CI porque precisa de Chromium. Rode antes de mexer em paleta:
//   npm run contraste

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const PAGINAS = ["index", "enfermeiras", "especialistas", "calculadora", "privacidade"];
const RAIZ = resolve(process.cwd(), "site");
const TIPOS = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
                ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2",
                ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain" };

const servidor = createServer(async (req, res) => {
  try {
    const caminho = resolve(RAIZ, "." + new URL(req.url, "http://x").pathname);
    if (!caminho.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    const corpo = await readFile(caminho);
    res.writeHead(200, { "Content-Type": TIPOS[extname(caminho)] ?? "application/octet-stream" });
    res.end(corpo);
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, ok));
const base = `http://localhost:${servidor.address().port}`;

// Mesmo tratamento de `scripts/og.mjs`: playwright e opcional e pode estar
// global, entao a falta dele vira mensagem util em vez de stack trace.
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("playwright nao encontrado. Instale com: npm i -D playwright && npx playwright install chromium");
  servidor.close();
  process.exit(1);
}

const navegador = await chromium.launch();
let reprovados = 0;

console.log("\nContraste do texto renderizado (WCAG AA: 4.5 normal, 3.0 grande)\n");

for (const pagina of PAGINAS) {
  const aba = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  await aba.goto(`${base}/${pagina}.html`);
  // As secoes com `animation-timeline: view()` comecam invisiveis; sem forcar o
  // estado final, metade da pagina nao seria medida.
  await aba.addStyleTag({ content: ".revela,.revela>*{opacity:1!important;transform:none!important;animation:none!important}" });
  await aba.waitForTimeout(400);

  const itens = await aba.evaluate(() => {
    const rgb = (c) => c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    const fundoEfetivo = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !bg.startsWith("rgba(0, 0, 0, 0)")) return bg;
      }
      return "rgb(255, 255, 255)";
    };
    return [...document.querySelectorAll("body *")]
      .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
                     && e.getBoundingClientRect().height > 0)
      .map((e) => {
        const cs = getComputedStyle(e);
        return { texto: e.textContent.trim().slice(0, 40), cor: rgb(cs.color),
                 fundo: rgb(fundoEfetivo(e)), tamanho: parseFloat(cs.fontSize), peso: Number(cs.fontWeight) };
      });
  });
  await aba.close();

  const canal = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  const falhas = itens
    .map((i) => ({ ...i, r: razao(i.cor, i.fundo) }))
    .filter((i) => i.r < (i.tamanho >= 24 || (i.tamanho >= 18.66 && i.peso >= 700) ? 3 : 4.5));

  if (falhas.length === 0) {
    console.log(`  ok    ${pagina}`);
  } else {
    reprovados += falhas.length;
    console.log(`  FALHA ${pagina}`);
    for (const f of falhas) console.log(`        ${f.r.toFixed(2)}:1  "${f.texto}"`);
  }
}

await navegador.close();
servidor.close();
console.log("");
if (reprovados > 0) process.exitCode = 1;
