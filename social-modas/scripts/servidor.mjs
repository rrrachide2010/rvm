import { fileURLToPath } from "node:url";
/**
 * Servidor estático mínimo para os testes: serve `out/` como o Vercel
 * serviria (pasta/ → pasta/index.html, 404 com o 404.html do build).
 * Responde 204 para POST em /api/*, para o analytics não sujar o console.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const RAIZ = fileURLToPath(new URL("../out/", import.meta.url));
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml" };

export async function servir() {
  const servidor = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    if (url.pathname.startsWith("/api/")) return res.writeHead(204).end();
    let bruto = decodeURIComponent(url.pathname);
    if (bruto.endsWith("/")) bruto += "index.html";
    const caminho = normalize(bruto);
    const arquivo = join(RAIZ, caminho);
    try {
      if (!arquivo.startsWith(RAIZ) || !(await stat(arquivo)).isFile()) throw new Error();
      res.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream" });
      res.end(await readFile(arquivo));
    } catch {
      res.writeHead(404, { "Content-Type": TIPOS[".html"] });
      res.end(await readFile(join(RAIZ, "404.html")).catch(() => ""));
    }
  });
  await new Promise((r) => servidor.listen(0, r));
  return { base: `http://localhost:${servidor.address().port}`, fechar: () => servidor.close() };
}
