import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { buscarClinicas } from "./places.ts";
import { analisarSite } from "./site.ts";
import { avaliar } from "./score.ts";
import { indice, relatorioClinica, type Remetente } from "./relatorio.ts";
import { carregar, caminhoBase, salvar } from "./store.ts";
import { ESTAGIOS, type Clinica, type EstagioComercial } from "./tipos.ts";

const AJUDA = `
Auditoria de clínicas — prospecção para o serviço de agenda.

  npm run buscar    -- --cidade "Campinas, SP" [--consulta "clínica de estética"] [--max 60]
  npm run auditar   -- [--forcar] [--limite 40]
  npm run relatorio -- [--top 20]
  npm run listar
  npm run estagio   -- [--de contactado]
  npm run estagio   -- --clinica "parte do nome" --para contactado

Passos: buscar coleta as fichas do Google, auditar analisa os sites e pontua,
relatorio gera os HTML em ./out (abra e imprima em PDF para enviar).

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

/**
 * Registro de estagio comercial.
 *
 * POR QUE AQUI, E NAO NUM CRM: a base tem uma ordem de grandeza de dezenas a
 * poucas centenas de clinicas por cidade, um operador so, e ja mora num JSON
 * local que nunca sai da maquina. Um CRM externo custaria uma conta a mais para
 * administrar, um lugar a mais onde dado de terceiro passa a existir, e uma
 * sincronizacao para manter — para resolver um problema que sao seis valores
 * numa string. Quando isso deixar de bastar (mais de um operador, ou histórico
 * de conversa por clinica), o caminho de saida e exportar CSV e importar num
 * CRM; nao ha nada aqui que prenda.
 */
function estagioDe(c: Clinica): EstagioComercial {
  // Ausente e "nao-contactado": e o que permite base antiga carregar sem migrar.
  if (!c.estagio) return "nao-contactado";
  // Valor invalido cai no primeiro estagio EM VEZ de ser devolvido cru.
  //
  // Sem isto, uma clinica com "contatado" (erro de digitacao de "contactado")
  // nao casava com nenhum grupo do funil e SUMIA da listagem inteira: sem erro,
  // sem aviso, e sem aparecer em lugar nenhum. O README manda editar
  // data/clinicas.json a mao, entao o erro de digitacao e o caminho documentado,
  // nao um caso teorico. Quem some da fila e um cliente que ninguem cobra.
  return (ESTAGIOS as readonly string[]).includes(c.estagio) ? c.estagio : "nao-contactado";
}

/** Clinicas cujo `estagio` gravado nao pertence ao funil. */
function comEstagioInvalido(clinicas: Clinica[]): Clinica[] {
  return clinicas.filter(
    (c) => c.estagio !== undefined && !(ESTAGIOS as readonly string[]).includes(c.estagio),
  );
}

/** Avisa, uma vez, sobre valores que nao existem no funil. */
function avisarEstagiosInvalidos(clinicas: Clinica[]): void {
  const ruins = comEstagioInvalido(clinicas);
  if (ruins.length === 0) return;
  console.error(
    `
Aviso: ${ruins.length} ${ruins.length === 1 ? "clínica tem estágio" : "clínicas têm estágio"} que não existe no funil.`,
  );
  for (const c of ruins) console.error(`  ${c.id}  ${c.nome}  →  "${c.estagio}"`);
  console.error(`Elas aparecem em NAO-CONTACTADO até serem corrigidas.`);
  console.error(`Válidos: ${ESTAGIOS.join(", ")}
`);
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

async function comandoEstagio(argv: string[]): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: {
      clinica: { type: "string" },
      para: { type: "string" },
      de: { type: "string" },
    },
  });

  const base = await carregar();

  // ---------------------------------------------------------- marcar ------
  if (values.clinica || values.para) {
    if (!values.clinica || !values.para) {
      console.error('Use as duas: --clinica "parte do nome" --para contactado');
      process.exit(1);
    }
    if (!(ESTAGIOS as readonly string[]).includes(values.para)) {
      console.error(`Estágio inválido. Use um de: ${ESTAGIOS.join(", ")}`);
      process.exit(1);
    }
    const alvo = normalizar(values.clinica);
    const achadas = base.clinicas.filter(
      (c) => c.id === values.clinica || normalizar(c.nome).includes(alvo),
    );
    if (achadas.length === 0) {
      console.error(`Nenhuma clínica bate com "${values.clinica}".`);
      process.exit(1);
    }
    // Ambiguidade nunca vira escolha silenciosa: marcar a clinica errada e um
    // erro que so aparece semanas depois, na hora de cobrar o retorno.
    if (achadas.length > 1) {
      console.error(`"${values.clinica}" bate com ${achadas.length} clínicas:`);
      for (const c of achadas) console.error(`  ${c.id}  ${c.nome}`);
      console.error("\nSeja mais específico, ou use o id.");
      process.exit(1);
    }
    const clinica = achadas[0]!;
    const antes = estagioDe(clinica);
    clinica.estagio = values.para as EstagioComercial;
    clinica.estagioEm = new Date().toISOString();
    await salvar(base);
    console.log(`${clinica.nome}: ${antes} → ${clinica.estagio}`);
    return;
  }

  // ----------------------------------------------------------- listar -----
  if (values.de && !(ESTAGIOS as readonly string[]).includes(values.de)) {
    console.error(`Estágio inválido. Use um de: ${ESTAGIOS.join(", ")}`);
    process.exit(1);
  }

  avisarEstagiosInvalidos(base.clinicas);
  const porId = new Map(base.auditorias.map((a) => [a.clinicaId, a]));
  let vazio = true;

  for (const estagio of ESTAGIOS) {
    if (values.de && values.de !== estagio) continue;
    const grupo = base.clinicas
      .filter((c) => estagioDe(c) === estagio)
      .sort(
        (x, y) =>
          (porId.get(y.id)?.indiceOportunidade ?? -1) -
          (porId.get(x.id)?.indiceOportunidade ?? -1),
      );
    if (grupo.length === 0) continue;
    vazio = false;
    console.log(`\n${estagio.toUpperCase()} · ${grupo.length}`);
    for (const c of grupo) {
      const a = porId.get(c.id);
      const indice = a ? String(a.indiceOportunidade).padStart(3) : "  —";
      console.log(`  ${indice}  ${c.nome}`);
    }
  }

  if (vazio) {
    console.log(
      base.clinicas.length === 0
        ? "Base vazia. Rode: npm run buscar"
        : "Nenhuma clínica nesse estágio.",
    );
  }
}

async function comandoListar(): Promise<void> {
  const base = await carregar();
  avisarEstagiosInvalidos(base.clinicas);
  const porId = new Map(base.auditorias.map((a) => [a.clinicaId, a]));
  const linhas = base.clinicas
    .map((c) => ({ c, a: porId.get(c.id) }))
    .sort((x, y) => (y.a?.indiceOportunidade ?? -1) - (x.a?.indiceOportunidade ?? -1));

  console.log(`${base.clinicas.length} clínicas · ${base.auditorias.length} auditadas\n`);
  for (const { c, a } of linhas) {
    const indice = a ? String(a.indiceOportunidade).padStart(3) : "  —";
    const est = estagioDe(c);
    const marca = est === "nao-contactado" ? "" : `  [${est}]`;
    console.log(`${indice}  ${c.nome}${c.site ? "" : "  (sem site)"}${marca}`);
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
