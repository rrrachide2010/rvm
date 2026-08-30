import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { buscarClinicas } from "./places.ts";
import { analisarSite } from "./site.ts";
import { avaliar } from "./score.ts";
import { indice, relatorioClinica, type Remetente } from "./relatorio.ts";
import { carregar, caminhoBase, salvar } from "./store.ts";
import { ESTAGIOS, ROTULO_ESTAGIO, type Clinica, type Estagio } from "./tipos.ts";

const AJUDA = `
Auditoria de clínicas — prospecção para o serviço de agenda.

  npm run buscar    -- --cidade "Campinas, SP" [--consulta "clínica de estética"] [--max 60]
  npm run auditar   -- [--forcar] [--limite 40]
  npm run relatorio -- [--top 20]
  npm run listar
  npm run estagio   -- [--para <estagio>] [--id <id da clinica>]

Passos: buscar coleta as fichas do Google, auditar analisa os sites e pontua,
relatorio gera os HTML em ./out (abra e imprima em PDF para enviar).

estagio sem argumento mostra a base agrupada pelo estágio comercial.
Com --id e --para, move uma clínica de estágio:
  ${ESTAGIOS.join(" · ")}

A chave da Places API vai no arquivo .env (veja .env.example). Nunca no código.
`;

function remetente(): Remetente {
  return {
    nome: process.env.REMETENTE_NOME ?? "[defina REMETENTE_NOME no .env]",
    contato: process.env.REMETENTE_CONTATO ?? "[defina REMETENTE_CONTATO no .env]",
  };
}

function exigirChave(): string {
  const chave = process.env.GOOGLE_MAPS_API_KEY;
  if (!chave) {
    console.error(
      "Falta GOOGLE_MAPS_API_KEY. Copie .env.example para .env e preencha com a chave da Places API.",
    );
    process.exit(1);
  }
  return chave;
}

function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function comandoBuscar(argv: string[]): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: {
      cidade: { type: "string" },
      consulta: { type: "string", default: "clínica de estética" },
      max: { type: "string", default: "60" },
    },
  });

  if (!values.cidade) {
    console.error('Informe a cidade: npm run buscar -- --cidade "Campinas, SP"');
    process.exit(1);
  }

  const chave = exigirChave();
  const base = await carregar();
  const conhecidas = new Set(base.clinicas.map((c) => c.id));

  console.log(`Buscando "${values.consulta}" em ${values.cidade}...`);
  const encontradas = await buscarClinicas({
    consulta: values.consulta!,
    cidade: values.cidade,
    max: Number(values.max),
    chave,
    regiao: process.env.REGIAO_PADRAO ?? "BR",
  });

  const novas = encontradas.filter((c) => !conhecidas.has(c.id));
  base.clinicas.push(...novas);
  await salvar(base);

  console.log(
    `${encontradas.length} resultados · ${novas.length} novas · ${base.clinicas.length} na base.`,
  );
  if (encontradas.length >= 60) {
    console.log(
      "O Google limita cada consulta a ~60 resultados. Para ampliar, repita variando o bairro ou o termo.",
    );
  }
}

async function comandoAuditar(argv: string[]): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: { forcar: { type: "boolean", default: false }, limite: { type: "string" } },
  });

  const base = await carregar();
  const jaAuditadas = new Set(base.auditorias.map((a) => a.clinicaId));
  let fila = values.forcar ? base.clinicas : base.clinicas.filter((c) => !jaAuditadas.has(c.id));
  if (values.limite) fila = fila.slice(0, Number(values.limite));

  if (fila.length === 0) {
    console.log("Nada para auditar. Use --forcar para refazer as auditorias existentes.");
    return;
  }

  console.log(`Auditando ${fila.length} clínicas...`);
  let feitas = 0;

  for (const clinica of fila) {
    const site = clinica.site ? await analisarSite(clinica.site) : undefined;
    const auditoria = avaliar(clinica, site);
    const anterior = base.auditorias.findIndex((a) => a.clinicaId === clinica.id);
    // Preserva o que foi anotado a mao ao reauditar.
    if (anterior >= 0) {
      auditoria.manual = base.auditorias[anterior]!.manual;
      base.auditorias[anterior] = auditoria;
    } else {
      base.auditorias.push(auditoria);
    }
    feitas++;
    console.log(
      `  ${String(auditoria.indiceOportunidade).padStart(3)} · ${clinica.nome} (${auditoria.achados.length} ${auditoria.achados.length === 1 ? "achado" : "achados"})`,
    );
    if (feitas % 10 === 0) await salvar(base);
  }

  await salvar(base);
  console.log(`Pronto. Base em ${caminhoBase()}`);
}

async function comandoRelatorio(argv: string[]): Promise<void> {
  const { values } = parseArgs({ args: argv, options: { top: { type: "string" } } });

  const base = await carregar();
  const porId = new Map<string, Clinica>(base.clinicas.map((c) => [c.id, c]));
  const pares = base.auditorias
    .map((a) => ({ auditoria: a, clinica: porId.get(a.clinicaId) }))
    .filter((p): p is { auditoria: (typeof base.auditorias)[number]; clinica: Clinica } =>
      Boolean(p.clinica),
    )
    .sort((a, b) => b.auditoria.indiceOportunidade - a.auditoria.indiceOportunidade);

  if (pares.length === 0) {
    console.log("Nenhuma auditoria ainda. Rode: npm run buscar e depois npm run auditar.");
    return;
  }

  const selecionadas = values.top ? pares.slice(0, Number(values.top)) : pares;
  const pasta = resolve(process.cwd(), "out");
  await mkdir(pasta, { recursive: true });
  const quem = remetente();
  const linhas: Array<{ clinica: Clinica; auditoria: (typeof pares)[number]["auditoria"]; arquivo: string }> = [];

  for (const { clinica, auditoria } of selecionadas) {
    const arquivo = `${slug(clinica.nome)}-${clinica.id.slice(-6)}.html`;
    await writeFile(resolve(pasta, arquivo), relatorioClinica(clinica, auditoria, quem), "utf8");
    linhas.push({ clinica, auditoria, arquivo });
  }

  await writeFile(resolve(pasta, "index.html"), indice(linhas, quem), "utf8");
  console.log(`${linhas.length} relatórios em ./out — comece por ./out/index.html`);
  if (quem.nome.startsWith("[")) {
    console.log("Aviso: defina REMETENTE_NOME e REMETENTE_CONTATO no .env antes de enviar.");
  }
}

async function comandoListar(): Promise<void> {
  const base = await carregar();
  const porId = new Map(base.auditorias.map((a) => [a.clinicaId, a]));
  const linhas = base.clinicas
    .map((c) => ({ c, a: porId.get(c.id) }))
    .sort((x, y) => (y.a?.indiceOportunidade ?? -1) - (x.a?.indiceOportunidade ?? -1));

  console.log(`${base.clinicas.length} clínicas · ${base.auditorias.length} auditadas\n`);
  for (const { c, a } of linhas) {
    const indice = a ? String(a.indiceOportunidade).padStart(3) : "  —";
    console.log(`${indice}  ${c.nome}${c.site ? "" : "  (sem site)"}`);
  }
}

async function comandoEstagio(argv: string[]): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: { para: { type: "string" }, id: { type: "string" } },
  });

  const base = await carregar();
  const porId = new Map(base.clinicas.map((c) => [c.id, c]));

  // ---- mover uma clinica de estagio ----
  if (values.para || values.id) {
    if (!values.para || !values.id) {
      console.error("Para mover, informe os dois: --id <id> --para <estagio>");
      process.exit(1);
    }
    if (!(ESTAGIOS as readonly string[]).includes(values.para)) {
      console.error(`Estágio inválido: ${values.para}
Use um de: ${ESTAGIOS.join(", ")}`);
      process.exit(1);
    }
    const clinica = porId.get(values.id);
    if (!clinica) {
      console.error(`Nenhuma clínica com id ${values.id}. Rode "npm run estagio" para ver os ids.`);
      process.exit(1);
    }
    const auditoria = base.auditorias.find((a) => a.clinicaId === values.id);
    if (!auditoria) {
      console.error(`${clinica.nome} ainda não foi auditada. Rode "npm run auditar" antes.`);
      process.exit(1);
    }
    const antes = auditoria.manual.estagio ?? "nao-contactado";
    auditoria.manual.estagio = values.para as Estagio;
    auditoria.manual.estagioEm = new Date().toISOString();
    await salvar(base);
    console.log(`${clinica.nome}: ${ROTULO_ESTAGIO[antes as Estagio]} → ${ROTULO_ESTAGIO[values.para as Estagio]}`);
    return;
  }

  // ---- listar a base agrupada por estagio ----
  const porEstagio = new Map<Estagio, Array<{ clinica: Clinica; indice: number }>>();
  for (const e of ESTAGIOS) porEstagio.set(e, []);

  for (const auditoria of base.auditorias) {
    const clinica = porId.get(auditoria.clinicaId);
    if (!clinica) continue;
    // Ausencia de estagio significa "nao contactado": base antiga carrega sem migracao.
    const estagio = auditoria.manual.estagio ?? "nao-contactado";
    porEstagio.get(estagio)?.push({ clinica, indice: auditoria.indiceOportunidade });
  }

  const semAuditoria = base.clinicas.filter(
    (c) => !base.auditorias.some((a) => a.clinicaId === c.id),
  );

  if (base.auditorias.length === 0) {
    console.log('Nenhuma auditoria ainda. Rode: npm run buscar e depois npm run auditar.');
    return;
  }

  for (const estagio of ESTAGIOS) {
    const linhas = porEstagio.get(estagio) ?? [];
    console.log(`
${ROTULO_ESTAGIO[estagio].toUpperCase()}  (${linhas.length})`);
    if (linhas.length === 0) {
      console.log("  —");
      continue;
    }
    for (const { clinica, indice } of linhas.sort((a, b) => b.indice - a.indice)) {
      console.log(`  ${String(indice).padStart(3)}  ${clinica.nome}`);
      console.log(`       ${clinica.id}`);
    }
  }

  if (semAuditoria.length > 0) {
    console.log(`
${semAuditoria.length} clínica(s) na base ainda sem auditoria — rode "npm run auditar".`);
  }
}

const [, , comando = "", ...resto] = process.argv;

try {
  switch (comando) {
    case "buscar":
      await comandoBuscar(resto);
      break;
    case "auditar":
      await comandoAuditar(resto);
      break;
    case "relatorio":
      await comandoRelatorio(resto);
      break;
    case "listar":
      await comandoListar();
      break;
    case "estagio":
      await comandoEstagio(resto);
      break;
    default:
      console.log(AJUDA);
      if (comando) process.exitCode = 1;
  }
} catch (erro) {
  console.error(`\nFalhou: ${erro instanceof Error ? erro.message : String(erro)}`);
  process.exitCode = 1;
}
