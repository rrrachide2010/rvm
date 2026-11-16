/**
 * Monta `publicacao/`: o build estático + o `vercel.json`, pronto para ser
 * copiado por cima da pasta do projeto que já está no Vercel.
 *
 * Por que não publica sozinho: as funções `api/` (catálogo, pedidos,
 * eventos, pagamento, chatbot) só existem na pasta original do projeto e no
 * deploy atual. Elas não estão neste repositório. Publicar só `publicacao/`
 * apagaria as cinco. O caminho seguro está em README.md, seção "Publicar".
 *
 * Uso: npm run build && npm run publicacao
 */
import { cp, rm, writeFile, stat, readdir } from "node:fs/promises";
import { join } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const OUT = join(RAIZ, "out");
const DESTINO = join(RAIZ, "publicacao");

// O painel e o retorno do pagamento continuam sendo as páginas antigas.
const LEGADO = ["admin.html", "dashboard.html", "pagamento.html", "styles.css", "analytics.js", "produtos.json", "assets/logo-mono.png"];

try {
  await stat(join(OUT, "index.html"));
} catch {
  console.error("publicacao: rode `npm run build` antes.");
  process.exit(1);
}

const faltando = [];
for (const f of LEGADO) {
  try {
    await stat(join(OUT, f));
  } catch {
    faltando.push(f);
  }
}
if (faltando.length) {
  console.error(`publicacao: o build perdeu arquivos de que o painel depende: ${faltando.join(", ")}`);
  process.exit(1);
}

await rm(DESTINO, { recursive: true, force: true });
await cp(OUT, DESTINO, { recursive: true });

const vercel = {
  // `/colecoes` vira `/colecoes/`, que é onde o export estático pôs o index.html.
  trailingSlash: true,
  redirects: [
    // Endereços do site anterior que podem estar em links, posts e buscadores.
    { source: "/venda.html", destination: "/colecoes/", permanent: true },
    { source: "/index.html", destination: "/", permanent: true },
  ],
  headers: [
    {
      // Nome com hash: muda a cada build, pode ficar em cache para sempre.
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      // Nome fixo: se a foto for trocada mantendo o nome, aparece em até um dia.
      source: "/img/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};
await writeFile(join(DESTINO, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n");

let arquivos = 0;
const contar = async (d) => {
  for (const e of await readdir(d, { withFileTypes: true })) {
    if (e.isDirectory()) await contar(join(d, e.name));
    else arquivos++;
  }
};
await contar(DESTINO);
console.log(`publicacao: ${arquivos} arquivos em publicacao/, com vercel.json. Próximo passo: README.md, seção "Publicar".`);
