/**
 * Gera site/tokens.css a partir de site/tokens.json (formato DTCG) e confere
 * o contraste dos pares que o sistema manda usar.
 *
 *   npm run tokens          gera e confere
 *   npm run tokens -- --ci  falha se algum par obrigatorio reprovar
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Token = { $value: unknown; $type?: string; $description?: string };
type Grupo = Record<string, Token>;

const ENTRADA = resolve(process.cwd(), "site/tokens.json");
const SAIDA = resolve(process.cwd(), "site/tokens.css");
const ESTILO = resolve(process.cwd(), "site/estilo.css");

/** Pares que a referencia prescreve — cada um vira um teste de contraste. */
const PARES: Array<{ nome: string; frente: string; fundo: string; tamanho: "normal" | "grande" }> = [
  { nome: "corpo sobre canvas", frente: "#33291f", fundo: "#efe9e7", tamanho: "normal" },
  { nome: "corpo sobre porcelana", frente: "#33291f", fundo: "#f6f0f2", tamanho: "normal" },
  { nome: "título espresso sobre canvas", frente: "#5c4a3b", fundo: "#efe9e7", tamanho: "normal" },
  { nome: "título espresso sobre greige", frente: "#5c4a3b", fundo: "#e1d7d3", tamanho: "normal" },
  { nome: "botão espresso + porcelana", frente: "#f6f0f2", fundo: "#5c4a3b", tamanho: "normal" },
  { nome: "botão eucalipto + porcelana", frente: "#f6f0f2", fundo: "#5c6b58", tamanho: "normal" },
  { nome: "rótulo eucalipto sobre canvas", frente: "#5c6b58", fundo: "#efe9e7", tamanho: "normal" },
  { nome: "texto suave sobre espresso", frente: "#e1d7d3", fundo: "#5c4a3b", tamanho: "normal" },
  { nome: "areia sobre espresso (só filete)", frente: "#c9b8a8", fundo: "#5c4a3b", tamanho: "grande" },
];

function canal(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminancia(hex: string): number {
  const n = hex.replace("#", "");
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: string, b: string): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function cssVar(grupo: string, nome: string): string {
  return `--${grupo}-${nome}`.toLowerCase();
}

/**
 * Resolve o alias do DTCG — `{color.espresso}` — para `var(--color-espresso)`.
 *
 * Emitir a referencia, e nao o hex copiado, e o que torna `tokens.json` fonte
 * unica de verdade. O grupo `surface` repetia quatro hexes que ja existiam em
 * `color`, entao trocar a paleta exigia editar dois lugares e nada conferia se
 * batiam: numa troca de paleta a faixa escura continuou marrom enquanto os
 * botoes ja eram verdes.
 */
function resolverAlias(valor: unknown): string {
  const bruto = String(valor);
  const alias = bruto.match(/^\{([a-z]+)\.([a-z0-9-]+)\}$/i);
  return alias ? `var(${cssVar(alias[1]!, alias[2]!)})` : bruto;
}

function bloco(titulo: string, linhas: string[]): string {
  return linhas.length ? `\n  /* ${titulo} */\n${linhas.join("\n")}\n` : "";
}

const CABECALHO = `/* GERADO POR \`npm run tokens\` A PARTIR DE site/tokens.json — NAO EDITE A MAO.
 *
 * Notas sobre a fonte destes valores, que valem para quem for implementar:
 *
 * 1. As duas famílias originais (Vivey 22 Positive e FHA Condensed French NC)
 *    são licenciadas e não estão publicadas. As variáveis --font-* já trazem os
 *    substitutos que usamos: Lora no lugar da Vivey e Oswald no lugar da FHA.
 *    Lora foi escolhida entre os substitutos sugeridos por ser a única legível
 *    em corpo de 14px — Playfair e DM Serif são faces de display.
 *
 * 2. --color-smoke-gray (#e5e7eb) é um cinza frio dentro de uma paleta
 *    mediterrânea quente. Sobre o creme ele aparece como um fio acinzentado
 *    que destoa. Para fios de borda sobre creme, prefira --color-dusty-rose.
 *
 * 3. Contraste: o par prescrito de texto bone sobre coral não alcança o mínimo
 *    de 4.5:1 da WCAG AA em corpo normal. \`npm run tokens\` imprime a tabela
 *    completa. Use o coral em botão com texto grande ou aumente o corpo.
 */`;

async function main(): Promise<void> {
  const ci = process.argv.includes("--ci");
  const doc = JSON.parse(await readFile(ENTRADA, "utf8")) as Record<string, unknown>;

  const cores: string[] = [];
  const fontes: string[] = [];
  const tipo: string[] = [];
  const espaco: string[] = [];
  const raio: string[] = [];
  const superficie: string[] = [];
  const leiaute: string[] = [];

  const emitir = (grupo: string, alvo: string[]) => {
    const g = doc[grupo] as Grupo | undefined;
    if (!g) return;
    for (const [nome, token] of Object.entries(g)) {
      if (token.$type === "typography") continue;
      alvo.push(`  ${cssVar(grupo, nome)}: ${resolverAlias(token.$value)};`);
    }
  };

  emitir("color", cores);
  emitir("spacing", espaco);
  emitir("radius", raio);
  emitir("surface", superficie);
  emitir("layout", leiaute);

  // As familias originais nao sao publicas: a variavel ja entrega o substituto.
  fontes.push(`  --font-texto: Jost, "Helvetica Neue", Arial, sans-serif;`);
  fontes.push(`  --font-display: Marcellus, Georgia, "Times New Roman", serif;`);

  const tg = doc["typography"] as Record<string, { $value: Record<string, unknown> }>;
  for (const [nome, token] of Object.entries(tg ?? {})) {
    const v = token.$value;
    const familia = String(v["fontFamily"]) === "Marcellus" ? "var(--font-display)" : "var(--font-texto)";
    tipo.push(`  --texto-${nome}-familia: ${familia};`);
    tipo.push(`  --texto-${nome}-tamanho: ${String(v["fontSize"])};`);
    tipo.push(`  --texto-${nome}-peso: ${String(v["fontWeight"])};`);
    tipo.push(`  --texto-${nome}-entrelinha: ${String(v["lineHeight"])};`);
  }

  const css =
    `${CABECALHO}\n\n:root {` +
    bloco("Cores", cores) +
    bloco("Famílias (substitutos das originais)", fontes) +
    bloco("Escala tipográfica", tipo) +
    bloco("Espaçamento", espaco) +
    bloco("Raios", raio) +
    bloco("Superfícies", superficie) +
    bloco("Leiaute", leiaute) +
    `}\n`;

  await writeFile(SAIDA, css, "utf8");

  let reprovados = 0;
  console.log(`\n${SAIDA.split("/").slice(-2).join("/")} gerado.\n`);
  console.log("Contraste dos pares prescritos (WCAG AA: 4.5 normal, 3.0 grande)\n");
  for (const p of PARES) {
    const razao = contraste(p.frente, p.fundo);
    const minimo = p.tamanho === "grande" ? 3 : 4.5;
    const passa = razao >= minimo;
    if (!passa) reprovados++;
    const marca = passa ? "ok  " : "FALHA";
    console.log(
      `  ${marca} ${razao.toFixed(2).padStart(5)}:1  ${p.nome}${p.tamanho === "grande" ? " (texto grande)" : ""}`,
    );
  }
  // Os pares acima sao os que o sistema PRESCREVE. Isso nao impede alguem de
  // escrever, no CSS, uma combinacao que ninguem prescreveu — e foi o que
  // aconteceu duas vezes com a areia sobre o espresso, que a propria descricao
  // do token proibia. Entao alem dos pares, conferimos o uso real.
  const proibidosComoTexto = new Set<string>();
  for (const [nome, token] of Object.entries((doc["color"] ?? {}) as Grupo)) {
    if (/N[ÃA]O use como texto/i.test(token.$description ?? "")) proibidosComoTexto.add(nome);
  }

  let usosIndevidos = 0;
  if (proibidosComoTexto.size > 0) {
    const css = await readFile(ESTILO, "utf8");
    const linhas = css.split(/\r?\n/);
    for (const [i, linha] of linhas.entries()) {
      // `color:` apenas — background, border e mask podem usar o tom a vontade.
      const decl = linha.match(/(?:^|[;{\s])color:\s*var\(--color-([a-z-]+)\)/i);
      if (!decl) continue;
      const token = decl[1]!;
      if (!proibidosComoTexto.has(token)) continue;
      usosIndevidos++;
      console.log(
        `\n  FALHA  site/estilo.css:${i + 1} usa --color-${token} como cor de texto,\n` +
          `         e o token diz para não fazer isso.`,
      );
    }
  }

  if (usosIndevidos > 0 && ci) process.exitCode = 1;

  if (reprovados > 0) {
    console.log(
      `\n${reprovados} par(es) abaixo do mínimo. Não é motivo para abandonar a paleta —\n` +
        `é motivo para usar essas combinações só em texto grande, ou escurecer o tom.`,
    );
    if (ci) process.exitCode = 1;
  }
}

await main();
