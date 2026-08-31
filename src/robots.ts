// Leitor de robots.txt, para o coletor nao buscar pagina que o site pediu
// para nao ser buscada.
//
// Nao e um parser completo do Robots Exclusion Protocol: nao trata sitemap,
// crawl-delay nem host. Trata o que decide o nosso caso — os grupos de
// User-agent que valem para nos, e as regras Allow/Disallow com os curingas
// `*` e `$`. Na duvida, libera: robots.txt e um pedido, e um arquivo mal
// formado nao deve travar uma auditoria que o dono da clinica vai receber.

const TIMEOUT_MS = 8_000;
const LIMITE_BYTES = 100_000;

/** Como nos identificamos, e o token que procuramos nos grupos. */
export const NOSSO_AGENTE = "auditoria-clinicas";

type Regra = { permite: boolean; padrao: string; peso: number };

export type Robots = {
  /** false quando nao ha robots.txt, ou quando ele nao pode ser lido. */
  encontrado: boolean;
  regras: Regra[];
};

/** Sem robots.txt legivel, tudo e permitido — que e o padrao do protocolo. */
export const LIBERADO: Robots = { encontrado: false, regras: [] };

/**
 * Converte um padrao de robots.txt em expressao regular.
 * `*` casa qualquer sequencia; `$` no fim ancora o final do caminho.
 */
function paraRegex(padrao: string): RegExp {
  const ancorado = padrao.endsWith("$");
  const corpo = ancorado ? padrao.slice(0, -1) : padrao;
  const escapado = corpo.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp("^" + escapado + (ancorado ? "$" : ""));
}

export function interpretar(texto: string): Robots {
  // Um grupo e uma sequencia de User-agent seguida das regras dela.
  type Grupo = { agentes: string[]; regras: Regra[] };
  const grupos: Grupo[] = [];
  let atual: Grupo | undefined;
  let abrindoGrupo = false;

  for (const linha of texto.split(/\r?\n/)) {
    const semComentario = linha.split("#")[0]!.trim();
    if (!semComentario) continue;

    const separador = semComentario.indexOf(":");
    if (separador === -1) continue;

    const campo = semComentario.slice(0, separador).trim().toLowerCase();
    const valor = semComentario.slice(separador + 1).trim();

    if (campo === "user-agent") {
      // User-agents consecutivos compartilham o grupo; um depois de regras
      // comeca grupo novo.
      if (!abrindoGrupo || !atual) {
        atual = { agentes: [], regras: [] };
        grupos.push(atual);
        abrindoGrupo = true;
      }
      atual.agentes.push(valor.toLowerCase());
      continue;
    }

    abrindoGrupo = false;
    if (!atual) continue;
    if (campo !== "disallow" && campo !== "allow") continue;
    // `Disallow:` vazio libera tudo — nao vira regra.
    if (valor === "") continue;

    atual.regras.push({ permite: campo === "allow", padrao: valor, peso: valor.length });
  }

  // Precedencia do protocolo: se algum grupo nomeia o nosso agente, so ele
  // vale — o grupo `*` e ignorado por completo. Somar os dois, como eu fazia
  // antes, deixava um Allow generico furar um Disallow dirigido a nos.
  const nossos = grupos.filter((g) =>
    g.agentes.some((a) => a !== "*" && NOSSO_AGENTE.startsWith(a)),
  );
  const valem = nossos.length > 0 ? nossos : grupos.filter((g) => g.agentes.includes("*"));

  return { encontrado: true, regras: valem.flatMap((g) => g.regras) };
}

/**
 * Decide se um caminho pode ser buscado.
 * Regra do protocolo: ganha o padrao mais especifico (o mais longo); empate
 * entre Allow e Disallow resolve em favor do Allow.
 */
export function permite(robots: Robots, caminho: string): boolean {
  if (!robots.encontrado || robots.regras.length === 0) return true;

  let melhor: Regra | undefined;
  for (const regra of robots.regras) {
    if (!paraRegex(regra.padrao).test(caminho)) continue;
    if (
      !melhor ||
      regra.peso > melhor.peso ||
      (regra.peso === melhor.peso && regra.permite && !melhor.permite)
    ) {
      melhor = regra;
    }
  }

  return melhor ? melhor.permite : true;
}

/** Busca e interpreta o robots.txt do host de `url`. Nunca lanca. */
export async function buscarRobots(url: string): Promise<Robots> {
  let alvo: URL;
  try {
    alvo = new URL("/robots.txt", url);
  } catch {
    return LIBERADO;
  }

  const controlador = new AbortController();
  const relogio = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const resposta = await fetch(alvo, {
      redirect: "follow",
      signal: controlador.signal,
      headers: {
        "User-Agent": `${NOSSO_AGENTE}/0.1 (levantamento de presenca digital)`,
        Accept: "text/plain",
      },
    });

    // 404 e o caso comum: sem arquivo, sem restricao.
    // 5xx tambem libera aqui: o site esta com problema, nao nos proibindo.
    if (!resposta.ok) return LIBERADO;

    const texto = (await resposta.text()).slice(0, LIMITE_BYTES);
    return interpretar(texto);
  } catch {
    return LIBERADO;
  } finally {
    clearTimeout(relogio);
  }
}
