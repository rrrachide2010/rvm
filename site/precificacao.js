// A matematica da calculadora, sem DOM e sem texto.
//
// Fica num modulo separado por um motivo so: e a peca que da um numero para a
// enfermeira decidir preco. Se ela errar, a ferramenta inteira perde a
// confianca — e ela ja errou uma vez, no calculo de quantos atendimentos
// extras fechariam a conta. Aqui da para exercitar isso na CI, o que dentro
// de uma tag <script> nao dava.
//
// A pagina importa este arquivo; o teste em test/precificacao.test.js tambem.
// Nenhum dos dois duplica formula.

/** Limites que existem porque um formulario aceita qualquer coisa. */
export const LIMITES = {
  duracaoMinima: 5,      // minutos: menos que isso nao e atendimento
  diasMinimo: 1,
  horasMinimo: 0.5,
  ocupacaoMinima: 1,     // %
  ocupacaoMaxima: 100,   // %
  impostoMaximo: 60,     // %
};

const numero = (valor, minimo = 0) => {
  const n = Number.parseFloat(valor);
  return Number.isFinite(n) && n >= minimo ? n : 0;
};

const entre = (n, minimo, maximo) => Math.min(maximo, Math.max(minimo, n));

/**
 * Le o que veio do formulario (strings, vazios, lixo) e devolve numeros
 * dentro de faixas utilizaveis. Separado de `calcular` para que o teste possa
 * exercitar as duas coisas: a limpeza da entrada e a formula.
 */
export function normalizar(bruto) {
  return {
    insumos: numero(bruto.insumos),
    duracao: Math.max(LIMITES.duracaoMinima, numero(bruto.duracao)),
    atual: numero(bruto.atual),
    dias: Math.max(LIMITES.diasMinimo, numero(bruto.dias)),
    horas: Math.max(LIMITES.horasMinimo, numero(bruto.horas)),
    ocupacao: entre(numero(bruto.ocupacao), LIMITES.ocupacaoMinima, LIMITES.ocupacaoMaxima) / 100,
    fixo: numero(bruto.fixo),
    retirada: numero(bruto.retirada),
    imposto: entre(numero(bruto.imposto), 0, LIMITES.impostoMaximo) / 100,
  };
}

/**
 * @returns {{
 *   capacidade: number, sessoes: number, custoReal: number,
 *   precoMinimo: number, precoIdeal: number, margemUnitaria: number,
 *   equilibrio: number|null, sobra: number,
 *   veredito: { tipo: "sem-preco"|"abaixo-do-minimo"|"sem-retirada"|"fecha",
 *               reajuste?: number, extras?: number|null }
 * }}
 */
export function calcular(bruto) {
  const e = normalizar(bruto);

  // Quantas sessoes cabem na agenda, e quantas de fato acontecem.
  const capacidade = (e.dias * e.horas * 60) / e.duracao;
  const sessoes = Math.max(1, capacidade * e.ocupacao);

  // A hora ociosa nao desaparece: ela e rateada entre quem comparece.
  // E este rateio que faz a agenda vazia encarecer o atendimento de quem vem.
  const custoReal = e.insumos + e.fixo / sessoes;

  // Receita liquida por sessao = preco * (1 - imposto). Igualando ao custo:
  const liquido = 1 - e.imposto;
  const precoMinimo = custoReal / liquido;
  const precoIdeal = (custoReal + e.retirada / sessoes) / liquido;

  const margemUnitaria = e.atual * liquido - e.insumos;
  const equilibrio = margemUnitaria > 0 ? e.fixo / margemUnitaria : null;
  const sobra = sessoes * margemUnitaria - e.fixo;

  let veredito;
  if (e.atual <= 0) {
    veredito = { tipo: "sem-preco" };
  } else if (e.atual < precoMinimo) {
    veredito = {
      tipo: "abaixo-do-minimo",
      reajuste: Math.max(1, Math.round(((precoMinimo - e.atual) / e.atual) * 100)),
    };
  } else if (e.atual < precoIdeal) {
    // O que falta e o deficit contra a retirada, nao a retirada inteira:
    // a sobra atual ja cobre parte dela.
    const extras = margemUnitaria > 0 ? Math.ceil((e.retirada - sobra) / margemUnitaria) : null;
    veredito = {
      tipo: "sem-retirada",
      reajuste: Math.max(1, Math.round(((precoIdeal - e.atual) / e.atual) * 100)),
      extras: extras !== null && extras > 0 ? extras : null,
    };
  } else {
    veredito = { tipo: "fecha" };
  }

  return { capacidade, sessoes, custoReal, precoMinimo, precoIdeal, margemUnitaria, equilibrio, sobra, veredito };
}
