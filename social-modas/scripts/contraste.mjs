/**
 * Contraste do texto RENDERIZADO, não da paleta.
 *
 * Abre cada página do build (`out/`) no Chromium e mede todo texto visível
 * contra o fundo que realmente está atrás dele: sobe pela árvore até o
 * primeiro fundo opaco, misturando no caminho os fundos semitransparentes e
 * a transparência da própria cor do texto. Assim pega o caso que a
 * auditoria de tokens não pega: uma cor certa sobre um fundo que mudou.
 *
 * Texto sobre foto é listado à parte, para conferência visual: o contraste
 * dele depende da imagem, que o script não lê.
 *
 * Uso: npm run build && npm run contraste
 * Sai com código 1 se algum texto reprovar na WCAG AA.
 */

const { chromium } = await import("playwright");
const { servir } = await import("./servidor.mjs");
const ROTAS = [
  "/",
  "/colecoes/",
  "/colecoes/feminino/",
  "/colecoes/camisas/",
  "/produtos/sm-camisa-bambu/",
  "/ocasioes/casamentos/",
  "/nossa-historia/",
  "/lojas/",
  "/guia-de-tamanhos/",
  "/journal/",
  "/journal/como-combinar-cores/",
  "/404.html",
];
const { base, fechar } = await servir();

const navegador = await chromium.launch();
let reprovados = 0;
let sobreFoto = 0;

for (const [nomeTela, largura] of [["desktop", 1440], ["celular", 390]]) {
  const pagina = await (await navegador.newContext({ viewport: { width: largura, height: 900 }, reducedMotion: "reduce" })).newPage();
  for (const rota of ROTAS) {
    await pagina.goto(base + rota, { waitUntil: "networkidle" });
    const resultado = await pagina.evaluate(() => {
      // Qualquer cor CSS (rgb, oklab, color-mix...) vira RGBA pintando um
      // pixel: é exatamente o que o navegador desenha.
      const tela = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      tela.canvas.width = tela.canvas.height = 1;
      const cache = new Map();
      const rgba = (s) => {
        if (!s || s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
        if (cache.has(s)) return cache.get(s);
        tela.clearRect(0, 0, 1, 1);
        tela.fillStyle = "#000";
        tela.fillStyle = s;
        tela.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = tela.getImageData(0, 0, 1, 1).data;
        const cor = { r, g, b, a: a / 255 };
        cache.set(s, cor);
        return cor;
      };
      const sobre = (cima, baixo) => ({
        r: cima.r * cima.a + baixo.r * (1 - cima.a),
        g: cima.g * cima.a + baixo.g * (1 - cima.a),
        b: cima.b * cima.a + baixo.b * (1 - cima.a),
        a: 1,
      });
      const lum = ({ r, g, b }) => {
        const c = [r, g, b].map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      const razao = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };

      const falhas = [];
      const fotos = [];
      const vistos = new Set();
      const andar = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (andar.nextNode()) {
        const no = andar.currentNode;
        if (!no.textContent.trim()) continue;
        const el = no.parentElement;
        if (!el || vistos.has(el)) continue;
        vistos.add(el);
        const cs = getComputedStyle(el);
        const caixa = el.getBoundingClientRect();
        if (cs.visibility === "hidden" || cs.display === "none" || caixa.width === 0 || caixa.height === 0) continue;
        if (el.closest(".sr-only, [aria-hidden=true], script, style, noscript")) continue;

        // Fundo efetivo: sobe acumulando camadas até achar uma opaca.
        const camadas = [];
        let atual = el;
        while (atual) {
          const fundo = rgba(getComputedStyle(atual).backgroundColor);
          if (fundo && fundo.a > 0) {
            camadas.push(fundo);
            if (fundo.a >= 1) break;
          }
          atual = atual.parentElement;
        }
        let fundo = { r: 255, g: 255, b: 255, a: 1 };
        for (const c of camadas.reverse()) fundo = sobre(c, fundo);
        const cor = sobre(rgba(cs.color), fundo);
        const r = razao(cor, fundo);
        const tamanho = parseFloat(cs.fontSize);
        const peso = Number(cs.fontWeight) || 400;
        const grande = tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
        const minimo = grande ? 3 : 4.5;
        const texto = no.textContent.trim().slice(0, 50);
        // Sobre foto = no centro do texto, há um <img> desenhado embaixo dele.
        el.scrollIntoView({ block: "center" });
        const c = el.getBoundingClientRect();
        const pilha = document.elementsFromPoint(c.left + Math.min(c.width / 2, 40), c.top + c.height / 2);
        const temFoto = pilha.slice(pilha.indexOf(el) + 1).some((e) => e.tagName === "IMG");
        if (temFoto) {
          fotos.push(texto);
          continue;
        }
        if (r < minimo) falhas.push(`${r.toFixed(2)} < ${minimo} · "${texto}" (${tamanho}px)`);
      }
      return { falhas, fotos };
    });
    for (const f of resultado.falhas) console.log(`REPROVA ${nomeTela} ${rota}  ${f}`);
    reprovados += resultado.falhas.length;
    sobreFoto += resultado.fotos.length;
  }
}

await navegador.close();
fechar();
console.log(`contraste: ${ROTAS.length} rotas × 2 telas; ${reprovados} reprovação(ões); ${sobreFoto} textos sobre foto para conferir a olho.`);
process.exit(reprovados ? 1 : 0);
