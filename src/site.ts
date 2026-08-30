import type { AnaliseSite } from "./tipos.ts";

const TIMEOUT_MS = 12_000;
const LIMITE_BYTES = 600_000;

/** Provedores de agendamento que aparecem no HTML quando a clinica ja tem um. */
const PROVEDORES: Array<[string, RegExp]> = [
  ["Doctoralia", /doctoralia|docplanner/i],
  ["Cal.com", /cal\.com/i],
  ["Calendly", /calendly\.com/i],
  ["SimplyBook", /simplybook/i],
  ["Booksy", /booksy/i],
  ["Belasis", /belasis/i],
  ["Trinks", /trinks\.com/i],
  ["Agenda Edu", /agendaedu/i],
  ["Zenklub", /zenklub/i],
];

/** Termos que indicam agendamento proprio no site, mesmo sem provedor conhecido. */
const TERMOS_AGENDAMENTO =
  /(agendar|agendamento|marcar\s+(hor[aá]rio|consulta)|reservar\s+hor[aá]rio|book\s+now|schedule)/i;

export async function analisarSite(url: string): Promise<AnaliseSite> {
  const base: AnaliseSite = {
    alcancavel: false,
    https: url.startsWith("https://"),
    responsivo: false,
    temAgendamentoOnline: false,
    temLinkWhatsapp: false,
    temInstagram: false,
    temTitulo: false,
    temDescricao: false,
  };

  const controlador = new AbortController();
  const relogio = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  const inicio = performance.now();

  try {
    const resposta = await fetch(url, {
      redirect: "follow",
      signal: controlador.signal,
      headers: {
        // Identifica-se de forma honesta: nao finge ser navegador de usuario.
        "User-Agent": "auditoria-clinicas/0.1 (levantamento de presenca digital)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    base.tempoRespostaMs = Math.round(performance.now() - inicio);
    base.status = resposta.status;
    base.urlFinal = resposta.url;
    base.https = resposta.url.startsWith("https://");
    base.alcancavel = resposta.ok;

    if (!resposta.ok || !resposta.body) return base;

    const html = (await lerLimitado(resposta.body)).slice(0, LIMITE_BYTES);

    base.responsivo = /<meta[^>]+name=["']viewport["']/i.test(html);
    base.temTitulo = /<title[^>]*>\s*\S/i.test(html);
    base.temDescricao = /<meta[^>]+name=["']description["'][^>]+content=["']\s*\S/i.test(html);
    base.temLinkWhatsapp = /(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i.test(html);
    base.temInstagram = /instagram\.com\//i.test(html);

    for (const [nome, padrao] of PROVEDORES) {
      if (padrao.test(html)) {
        base.provedorAgendamento = nome;
        base.temAgendamentoOnline = true;
        break;
      }
    }
    if (!base.temAgendamentoOnline) {
      base.temAgendamentoOnline = TERMOS_AGENDAMENTO.test(html);
    }
  } catch (erro) {
    base.erro = erro instanceof Error ? erro.message : String(erro);
  } finally {
    clearTimeout(relogio);
  }

  return base;
}

/** Le o corpo da resposta parando no limite, para nao engasgar num site pesado. */
async function lerLimitado(corpo: ReadableStream<Uint8Array>): Promise<string> {
  const leitor = corpo.getReader();
  const decodificador = new TextDecoder("utf8");
  let texto = "";
  try {
    while (texto.length < LIMITE_BYTES) {
      const { done, value } = await leitor.read();
      if (done) break;
      texto += decodificador.decode(value, { stream: true });
    }
  } finally {
    await leitor.cancel().catch(() => {});
  }
  return texto;
}
