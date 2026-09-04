// Quanto a Meta cobra para as rotinas rodarem, e o que sobra da mensalidade.
//
// Este modulo existe porque o custo por mensagem do WhatsApp nao estava no
// preco do servico. Ele nao e pequeno nem fixo: cresce com o tamanho da
// clinica, enquanto a mensalidade e plana. Sem isso escrito em codigo, a
// conta so aparece quando a primeira clinica grande assina.

/** Categorias que a Meta tarifa por mensagem enviada. */
export type Categoria = "utilidade" | "marketing" | "autenticacao";

/**
 * Preco por mensagem, em dolar, no Brasil.
 *
 * ATENCAO: estes numeros precisam ser conferidos na tabela oficial da Meta
 * antes de virarem preco de venda. A tabela muda, e muda por pais. O modelo
 * abaixo e que e o ativo aqui — os valores sao parametro, nao verdade.
 */
export const TARIFAS_BR: Record<Categoria, number> = {
  utilidade: 0.008,
  marketing: 0.0625,
  autenticacao: 0.0315,
};

/** Cambio usado para converter. Tambem e parametro, nao verdade. */
export const CAMBIO_PADRAO = 5.4;

/**
 * O volume de uma clinica, em mensagens por mes, derivado do numero de
 * atendimentos. As proporcoes sao as sete rotinas que vendemos.
 */
export type Rotinas = {
  /** Atendimentos marcados no mes. E o unico numero que a clinica sabe de cor. */
  atendimentos: number;
  /** Confirmacao + lembrete: duas utilidades por atendimento. */
  confirmacoesPorAtendimento: number;
  /** Remarcacao apos falta ou cancelamento. */
  fracaoQueFalta: number;
  /** Retorno programado, sobre os atendimentos que fecham ciclo. */
  fracaoComRetorno: number;
  /** Pedido de avaliacao. */
  fracaoQuePedeAvaliacao: number;
  /** Reativacao de quem sumiu — esta e marketing, e custa quase 8x. */
  reativacoes: number;
  /**
   * Fracao das utilidades que cai dentro da janela de atendimento aberta pela
   * cliente e por isso nao e cobrada. Depende de quanto a cliente responde,
   * entao e o parametro mais incerto daqui.
   */
  fracaoNaJanelaGratuita: number;
};

/** Uma clinica media, para o modelo ter um ponto de partida discutivel. */
export const ROTINAS_PADRAO: Omit<Rotinas, "atendimentos"> = {
  confirmacoesPorAtendimento: 2,
  fracaoQueFalta: 0.15,
  fracaoComRetorno: 0.4,
  fracaoQuePedeAvaliacao: 0.5,
  reativacoes: 100,
  fracaoNaJanelaGratuita: 0.2,
};

export type Custo = {
  mensagensUtilidade: number;
  mensagensMarketing: number;
  /** Utilidades que caem na janela gratuita e nao entram na conta. */
  mensagensGratuitas: number;
  usd: number;
  brl: number;
  /** Quanto o WhatsApp custa por atendimento marcado. */
  brlPorAtendimento: number;
};

export function custoMensal(
  rotinas: Rotinas,
  tarifas: Record<Categoria, number> = TARIFAS_BR,
  cambio: number = CAMBIO_PADRAO,
): Custo {
  const a = Math.max(0, rotinas.atendimentos);

  const utilidadeBruta =
    a * rotinas.confirmacoesPorAtendimento +
    a * rotinas.fracaoQueFalta +
    a * rotinas.fracaoComRetorno +
    a * rotinas.fracaoQuePedeAvaliacao;

  const gratuitas = utilidadeBruta * rotinas.fracaoNaJanelaGratuita;
  const utilidade = utilidadeBruta - gratuitas;

  // Marketing nunca entra na janela gratuita: a Meta cobra mesmo dentro dela.
  const marketing = Math.max(0, rotinas.reativacoes);

  const usd = utilidade * tarifas.utilidade + marketing * tarifas.marketing;
  const brl = usd * cambio;

  return {
    mensagensUtilidade: utilidade,
    mensagensMarketing: marketing,
    mensagensGratuitas: gratuitas,
    usd,
    brl,
    brlPorAtendimento: a > 0 ? brl / a : 0,
  };
}

export type Margem = {
  custoBrl: number;
  /** O que sobra da mensalidade depois de pagar a Meta. */
  sobraBrl: number;
  /** Quanto da mensalidade a Meta leva, de 0 a 1 (pode passar de 1). */
  fatia: number;
  /** Acima deste numero de atendimentos, a mensalidade nao cobre o custo. */
  atendimentosAteZerar: number | null;
};

/**
 * O que sobra da mensalidade, e a partir de que tamanho de clinica ela deixa
 * de cobrir o custo. O ponto de virada e o numero que decide se o preco pode
 * ser plano ou tem que ser por faixa.
 */
export function margem(
  mensalidade: number,
  rotinas: Rotinas,
  tarifas: Record<Categoria, number> = TARIFAS_BR,
  cambio: number = CAMBIO_PADRAO,
): Margem {
  const custo = custoMensal(rotinas, tarifas, cambio);

  // O custo tem uma parte que anda com o atendimento e outra que nao anda
  // (a reativacao e um numero fixo por mes), entao o ponto de virada e a raiz
  // de uma reta, nao uma divisao simples.
  const porAtendimento = custoMensal(
    { ...rotinas, atendimentos: 1, reativacoes: 0 },
    tarifas,
    cambio,
  ).brl;
  const fixo = custoMensal({ ...rotinas, atendimentos: 0 }, tarifas, cambio).brl;

  const atendimentosAteZerar =
    porAtendimento > 0 ? Math.max(0, (mensalidade - fixo) / porAtendimento) : null;

  return {
    custoBrl: custo.brl,
    sobraBrl: mensalidade - custo.brl,
    fatia: mensalidade > 0 ? custo.brl / mensalidade : Infinity,
    atendimentosAteZerar,
  };
}
