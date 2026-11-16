import { fileURLToPath } from "node:url";
/**
 * Gera as versões WebP das fotos que o site realmente usa.
 *
 * Varre `src/` e `public/produtos.json` atrás de caminhos `assets/*.jpg|png`
 * e cria `public/img/<nome>-<largura>.webp` para cada largura de
 * `src/lib/larguras.ts`. Foto que não aparece em lugar nenhum não é
 * convertida: as artes antigas de campanha continuam em `assets/` para o
 * painel e para o histórico, mas não entram no site.
 *
 * Nunca amplia: se a original tem 820 px, a versão "1080" sai com 820.
 * Pula o que já está atualizado, então rodar duas vezes custa quase nada.
 */
import { readFile, readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";
import { TODAS_AS_LARGURAS } from "../src/lib/larguras.ts";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const ASSETS = join(RAIZ, "public/assets");
const SAIDA = join(RAIZ, "public/img");

async function arquivos(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await arquivos(p)));
    else if (/\.(tsx?|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

const fontes = [...(await arquivos(join(RAIZ, "src"))), join(RAIZ, "public/produtos.json")];
const usadas = new Set();
for (const f of fontes) {
  const texto = await readFile(f, "utf8");
  for (const m of texto.matchAll(/assets\/([\w.-]+\.(?:jpe?g|png))/gi)) usadas.add(m[1]);
}

await mkdir(SAIDA, { recursive: true });
let geradas = 0;
let puladas = 0;
const faltando = [];

for (const nome of [...usadas].sort()) {
  const origem = join(ASSETS, nome);
  let infoOrigem;
  try {
    infoOrigem = await stat(origem);
  } catch {
    faltando.push(nome);
    continue;
  }
  const base = basename(nome, extname(nome));
  for (const largura of TODAS_AS_LARGURAS) {
    const destino = join(SAIDA, `${base}-${largura}.webp`);
    try {
      if ((await stat(destino)).mtimeMs >= infoOrigem.mtimeMs) {
        puladas++;
        continue;
      }
    } catch {
      /* ainda não existe */
    }
    await sharp(origem)
      .rotate()
      .resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(destino);
    geradas++;
  }
}

console.log(`imagens: ${usadas.size} fotos usadas, ${geradas} versões geradas, ${puladas} já atualizadas`);
if (faltando.length) {
  // Falha alto: uma foto citada no código que não existe vira um quadro quebrado no site.
  console.error(`imagens: citadas mas ausentes em public/assets: ${faltando.join(", ")}`);
  process.exit(1);
}
