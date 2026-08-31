// Gera site/compartilhamento.png (a og:image) a partir de site/midia/og.html.
//
// Fica fora da CI de proposito: precisa de Chromium, e a imagem so muda
// quando o texto ou a paleta mudam. Rode a mao, com `npm run og`, e versione
// o PNG resultante.
//
// Requer playwright disponivel (global ou npx) e um servidor local, porque a
// pagina carrega tokens.css e as fontes por caminho relativo.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const RAIZ = new URL("../site/", import.meta.url).pathname;
const PORTA = 8477;
const TIPOS = { ".html": "text/html", ".css": "text/css", ".woff2": "font/woff2", ".js": "text/javascript" };

const servidor = createServer(async (req, res) => {
  try {
    const caminho = join(RAIZ, normalize(decodeURIComponent(req.url.split("?")[0])));
    if (!caminho.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    const corpo = await readFile(caminho);
    res.writeHead(200, { "content-type": TIPOS[extname(caminho)] ?? "application/octet-stream" });
    res.end(corpo);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((ok) => servidor.listen(PORTA, "127.0.0.1", ok));

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("playwright nao encontrado. Instale com: npm i -D playwright && npx playwright install chromium");
  servidor.close();
  process.exit(1);
}

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await pagina.goto(`http://127.0.0.1:${PORTA}/midia/og.html`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: new URL("../site/compartilhamento.png", import.meta.url).pathname });
await navegador.close();
servidor.close();

console.log("site/compartilhamento.png gerado (1200x630).");
