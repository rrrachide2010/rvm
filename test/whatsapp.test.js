// Testes do custo de mensagem do WhatsApp.
//
// O que importa aqui e o ponto de virada: acima de quantos atendimentos a
// mensalidade para de cobrir o que a Meta cobra. Esse numero decide se o
// preco pode ser plano ou tem que ser por faixa, entao ele nao pode quebrar
// em silencio quando alguem mexer nas proporcoes das rotinas.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  custoMensal,
  margem,
  ROTINAS_PADRAO,
  TARIFAS_BR,
  CAMBIO_PADRAO,
} from "../src/whatsapp.ts";

const clinica = (atendimentos, extra = {}) => ({
  ...ROTINAS_PADRAO,
  atendimentos,
  ...extra,
});

test("clinica sem atendimento ainda paga a reativacao, que e marketing", () => {
  const c = custoMensal(clinica(0));
  assert.equal(c.mensagensUtilidade, 0);
  assert.equal(c.mensagensMarketing, ROTINAS_PADRAO.reativacoes);
  assert.ok(c.brl > 0, "reativacao e custo fixo, nao pode zerar");
  assert.equal(c.brlPorAtendimento, 0, "sem atendimento nao ha rateio");
});

test("o custo cresce com o tamanho da clinica", () => {
  const pequena = custoMensal(clinica(100)).brl;
  const media = custoMensal(clinica(300)).brl;
  const grande = custoMensal(clinica(800)).brl;
  assert.ok(pequena < media && media < grande);
});

test("a janela gratuita so desconta utilidade, nunca marketing", () => {
  const semJanela = custoMensal(clinica(300, { fracaoNaJanelaGratuita: 0 }));
  const comJanela = custoMensal(clinica(300, { fracaoNaJanelaGratuita: 0.5 }));

  assert.ok(comJanela.brl < semJanela.brl);
  assert.equal(comJanela.mensagensMarketing, semJanela.mensagensMarketing);
  assert.equal(
    comJanela.mensagensUtilidade + comJanela.mensagensGratuitas,
    semJanela.mensagensUtilidade,
  );
});

test("marketing domina a conta mesmo sendo minoria das mensagens", () => {
  const c = custoMensal(clinica(300));
  const daUtilidade = c.mensagensUtilidade * TARIFAS_BR.utilidade;
  const doMarketing = c.mensagensMarketing * TARIFAS_BR.marketing;

  assert.ok(c.mensagensMarketing < c.mensagensUtilidade, "sao menos mensagens");
  assert.ok(doMarketing > daUtilidade, "e ainda assim custam mais");
});

test("no ponto de virada a sobra da mensalidade e zero", () => {
  const mensalidade = 350;
  const m = margem(mensalidade, clinica(300));
  assert.ok(m.atendimentosAteZerar !== null);

  const noPonto = margem(mensalidade, clinica(m.atendimentosAteZerar));
  assert.ok(
    Math.abs(noPonto.sobraBrl) < 0.01,
    `esperava sobra ~0 no ponto de virada, veio ${noPonto.sobraBrl}`,
  );
});

test("uma clinica acima do ponto de virada da prejuizo", () => {
  const mensalidade = 350;
  const virada = margem(mensalidade, clinica(300)).atendimentosAteZerar;
  const m = margem(mensalidade, clinica(Math.ceil(virada) + 50));
  assert.ok(m.sobraBrl < 0);
  assert.ok(m.fatia > 1);
});

test("mensalidade maior empurra o ponto de virada para cima", () => {
  const a = margem(350, clinica(300)).atendimentosAteZerar;
  const b = margem(500, clinica(300)).atendimentosAteZerar;
  assert.ok(b > a);
});

test("a conversao para real e linear no cambio", () => {
  const um = custoMensal(clinica(300), TARIFAS_BR, 1);
  const outro = custoMensal(clinica(300), TARIFAS_BR, 2);
  assert.ok(Math.abs(outro.brl - um.brl * 2) < 1e-9);
  assert.equal(um.usd, outro.usd, "o custo em dolar nao depende do cambio");
});

test("tarifa zerada zera a conta, mas nao o numero de mensagens", () => {
  const c = custoMensal(
    clinica(300),
    { utilidade: 0, marketing: 0, autenticacao: 0 },
    CAMBIO_PADRAO,
  );
  assert.equal(c.brl, 0);
  assert.ok(c.mensagensUtilidade > 0);
});
