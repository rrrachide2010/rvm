import type { Achado, AnaliseSite, Auditoria, Clinica } from "./tipos.ts";

/**
 * PESOS — o unico lugar onde se ajusta o indice de oportunidade.
 *
 * O README promete que "os pesos estao em src/score.ts, em um lugar so". Ate
 * aqui eles estavam espalhados em 12 literais dentro dos achados, um por
 * bloco: para saber o teto do indice era preciso ler a funcao inteira e somar
 * a mao. Agora estao numa tabela so, e a soma e conferivel de relance.
 *
 * O que cada peso significa: quanto aquele problema soma ao indice, e portanto
 * quanto ele empurra a clinica para cima na fila de prospeccao. Peso maior =
 * problema que da mais conversa com o dono, nao necessariamente o mais grave
 * tecnicamente.
 */
export const PESOS = {
  /** Nao ha site nenhum. */
  semSite: 22,
  /** O site cadastrado no Maps nao abre — pior que nao ter, porque frustra. */
  siteFora: 24,
  /** Nao da para marcar sozinho, a qualquer hora. */
  semAgendamento: 20,
  semHttps: 14,
  naoResponsivo: 12,
  siteLento: 8,
  semWhatsapp: 8,
  seoBasico: 5,
  /** Sinais da ficha do Maps. */
  semTelefone: 10,
  poucasAvaliacoes: 11,
  semHorario: 9,
  notaBaixa: 6,
  /**
   * Ficha marcada como fechada temporariamente. Peso alto porque e o unico
   * problema desta lista que zera a captacao: quem busca ve "fechado
   * temporariamente" e nao liga. E o dono costuma nao saber que esta assim.
   */
  fichaFechadaTemporariamente: 18,
  /**
   * Ficha marcada como fechada em definitivo. Peso ZERO de proposito: nao e
   * oportunidade, e desqualificacao. O achado aparece no relatorio para
   * explicar por que a clinica esta no fim da fila, sem inflar o indice de
   * quem nao deve receber proposta nenhuma.
   */
  fichaFechadaEmDefinitivo: 0,
} as const;

/** Faixas que definem quando um sinal vira achado. */
export const LIMITES = {
  notaAlvo: 4.5,
  avaliacoesMinimas: 40,
  lentoMs: 3000,
} as const;

const NOTA_ALVO = LIMITES.notaAlvo;
const AVALIACOES_MINIMAS = LIMITES.avaliacoesMinimas;
const LENTO_MS = LIMITES.lentoMs;

/**
 * Monta a lista de achados de uma clinica. Cada achado e escrito como o dono
 * da clinica reconheceria o problema — nao em jargao tecnico — porque este
 * texto vai direto para o relatorio que ele recebe.
 */
export function avaliar(clinica: Clinica, site: AnaliseSite | undefined): Auditoria {
  const achados: Achado[] = [];

  if (!clinica.site) {
    achados.push({
      chave: "sem-site",
      severidade: "alta",
      peso: PESOS.semSite,
      titulo: "A clínica não tem site",
      detalhe:
        "Quem procura no Google encontra apenas a ficha do Maps. Sem site, não há como explicar procedimentos, mostrar a equipe nem receber agendamento fora do horário comercial.",
    });
  } else if (site && !site.alcancavel) {
    achados.push({
      chave: "site-fora",
      severidade: "alta",
      peso: PESOS.siteFora,
      titulo: "O site cadastrado não abre",
      detalhe: `O endereço ${clinica.site} não respondeu na verificação${
        site.erro ? ` (${site.erro})` : site.status ? ` (código ${site.status})` : ""
      }. Um link quebrado no Google custa mais que não ter link nenhum.`,
    });
  }

  // Sem site nao existe agendamento online: a ausencia e certa, nao presumida.
  // Sem esta linha o ramo "nao tem site" tinha teto 58 e o ramo "tem site ruim"
  // chegava a 100, entao uma clinica SEM site nunca podia aparecer acima de uma
  // com site apenas lento — o inverso do que o README promete ("quanto maior,
  // mais ha para resolver"). Com ela, o teto do ramo sem site vai a 78.
  if (!clinica.site) {
    achados.push({
      chave: "sem-agendamento",
      severidade: "alta",
      peso: PESOS.semAgendamento,
      titulo: "Não há agendamento online",
      detalhe:
        "Toda marcação depende de alguém responder. Fora do expediente e nos horários de pico, o pedido de horário simplesmente se perde.",
    });
  }

  if (site?.alcancavel) {
    if (!site.temAgendamentoOnline) {
      achados.push({
        chave: "sem-agendamento",
        severidade: "alta",
        peso: PESOS.semAgendamento,
        titulo: "Não há agendamento online",
        detalhe:
          "Toda marcação depende de alguém responder. Fora do expediente e nos horários de pico, o pedido de horário simplesmente se perde.",
      });
    }
    if (!site.https) {
      achados.push({
        chave: "sem-https",
        severidade: "alta",
        peso: PESOS.semHttps,
        titulo: "O site não usa conexão segura",
        detalhe:
          "O navegador exibe aviso de site não seguro para quem entra. Além da desconfiança, o Google rebaixa páginas assim no resultado de busca.",
      });
    }
    if (!site.responsivo) {
      achados.push({
        chave: "nao-responsivo",
        severidade: "media",
        peso: PESOS.naoResponsivo,
        titulo: "O site não se adapta ao celular",
        detalhe:
          "A maior parte das buscas por estética vem do telefone. Uma página que exige zoom para ser lida perde a visita nos primeiros segundos.",
      });
    }
    if (site.tempoRespostaMs && site.tempoRespostaMs > LENTO_MS) {
      achados.push({
        chave: "site-lento",
        severidade: "media",
        peso: PESOS.siteLento,
        titulo: "O site demora a carregar",
        detalhe: `A primeira resposta levou ${(site.tempoRespostaMs / 1000).toFixed(
          1,
        )} segundos. Acima de 3 segundos, boa parte das visitas desiste antes de ver a página.`,
      });
    }
    if (!site.temLinkWhatsapp) {
      achados.push({
        chave: "sem-whatsapp",
        severidade: "media",
        peso: PESOS.semWhatsapp,
        titulo: "Não há botão de WhatsApp no site",
        detalhe:
          "O WhatsApp é o canal preferido para marcar horário. Sem link direto, a pessoa precisa copiar o número — e muitas não copiam.",
      });
    }
    if (!site.temTitulo || !site.temDescricao) {
      achados.push({
        chave: "seo-basico",
        severidade: "baixa",
        peso: PESOS.seoBasico,
        titulo: "A página não tem título ou descrição configurados",
        detalhe:
          "É o texto que aparece no resultado do Google. Sem ele, a busca mostra um trecho aleatório do site.",
      });
    }
  }

  // businessStatus vinha do Places, era gravado em `clinica.status` e nunca era
  // lido por ninguem. E o unico sinal da ficha do Maps que a coleta pagava e a
  // pontuacao ignorava.
  if (clinica.status === "CLOSED_TEMPORARILY") {
    achados.push({
      chave: "ficha-fechada-temporariamente",
      severidade: "alta",
      peso: PESOS.fichaFechadaTemporariamente,
      titulo: "A ficha do Google diz que a clínica está fechada temporariamente",
      detalhe:
        "Quem procura pela clínica no Maps vê o aviso em vermelho e não liga. É o único problema desta lista que zera a captação por busca, e costuma sobrar de um fechamento antigo que ninguém desmarcou.",
    });
  }
  if (clinica.status === "CLOSED_PERMANENTLY") {
    achados.push({
      chave: "ficha-fechada-em-definitivo",
      severidade: "alta",
      peso: PESOS.fichaFechadaEmDefinitivo,
      titulo: "A ficha do Google diz que a clínica fechou em definitivo",
      detalhe:
        "Não é oportunidade: é motivo para não abordar. Se a clínica está funcionando, a ficha está errada e corrigi-la é o primeiro assunto — mas confirme antes de enviar qualquer proposta.",
    });
  }

  if (!clinica.telefone) {
    achados.push({
      chave: "sem-telefone",
      severidade: "media",
      peso: PESOS.semTelefone,
      titulo: "Não há telefone na ficha do Google",
      detalhe: "Quem encontra a clínica pelo Maps não tem como ligar sem procurar em outro lugar.",
    });
  }
  if (!clinica.temHorarioPublicado) {
    achados.push({
      chave: "sem-horario",
      severidade: "media",
      peso: PESOS.semHorario,
      titulo: "O horário de funcionamento não está publicado",
      detalhe:
        "O Google prioriza fichas completas e mostra 'aberto agora' para quem busca por perto. Sem horário, a clínica fica de fora desse filtro.",
    });
  }
  if ((clinica.totalAvaliacoes ?? 0) < AVALIACOES_MINIMAS) {
    achados.push({
      chave: "poucas-avaliacoes",
      severidade: "media",
      peso: PESOS.poucasAvaliacoes,
      titulo: `Poucas avaliações no Google (${clinica.totalAvaliacoes ?? 0})`,
      detalhe:
        "Volume de avaliações pesa mais que a nota no ranking local. Pedir avaliação de forma automática após o atendimento é a correção mais rápida disponível.",
    });
  }
  if (clinica.nota !== undefined && clinica.nota < NOTA_ALVO) {
    achados.push({
      chave: "nota-baixa",
      severidade: "baixa",
      peso: PESOS.notaBaixa,
      titulo: `Nota abaixo de ${NOTA_ALVO.toFixed(1)} (${clinica.nota.toFixed(1)})`,
      detalhe:
        "Na comparação lado a lado que o Maps faz, a diferença de meio ponto costuma decidir o clique.",
    });
  }

  const bruto = achados.reduce((soma, a) => soma + a.peso, 0);

  return {
    clinicaId: clinica.id,
    auditadaEm: new Date().toISOString(),
    site,
    achados: achados.sort((a, b) => b.peso - a.peso),
    indiceOportunidade: Math.min(100, bruto),
    manual: {},
  };
}
