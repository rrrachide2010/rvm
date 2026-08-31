// Testes da matematica da calculadora.
//
// Os tres primeiros sao os invariantes que estavam apenas descritos no README:
// enquanto eram prosa, nada impedia um refactor de quebrar um deles em
// silencio. O quarto cobre um bug real — o veredito ja dividiu a retirada
// inteira pela margem em vez do deficit, e anunciava um numero incoerente.

import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular, normalizar } from "../site/precificacao.js";

/** Um caso realista: sala alugada, agenda mais de meio cheia, Simples. */
const BASE = {
  insumos: "45", duracao: "60", atual: "120",
  dias: "20", horas: "6", ocupacao: "55",
  fixo: "3200", retirada: "4000", imposto: "6",
};

const perto = (a, b, tolerancia = 1e-6) =>
  assert.ok(Math.abs(a - b) < tolerancia, `esperava ~${b}, veio ${a}`);

test("no preco ideal, a sobra do mes iguala a retirada desejada", () => {
  const r = calcular(BASE);
  const noIdeal = calcular({ ...BASE, atual: String(r.precoIdeal) });
  perto(noIdeal.sobra, Number(BASE.retirada), 1e-6);
});

test("no preco minimo, a sobra do mes e zero", () => {
  const r = calcular(BASE);
  const noMinimo = calcular({ ...BASE, atual: String(r.precoMinimo) });
  perto(noMinimo.sobra, 0, 1e-6);
});

test("no ponto de equilibrio, a margem acumulada iguala o custo fixo", () => {
  const r = calcular(BASE);
  perto(r.equilibrio * r.margemUnitaria, Number(BASE.fixo), 1e-6);
});

test("os atendimentos extras cobrem o deficit, nao a retirada inteira", () => {
  // Preco entre o minimo e o ideal: sobra positiva, mas menor que a retirada.
  const r = calcular({ ...BASE, atual: "150" });
  assert.equal(r.veredito.tipo, "sem-retirada");
  assert.ok(r.sobra > 0 && r.sobra < Number(BASE.retirada), "o caso precisa ter sobra parcial");

  // O bug antigo dava Math.ceil(retirada / margem), sempre maior que isto.
  const esperado = Math.ceil((Number(BASE.retirada) - r.sobra) / r.margemUnitaria);
  assert.equal(r.veredito.extras, esperado);

  // E o numero anunciado precisa realmente fechar a conta.
  const comExtras = r.sobra + r.veredito.extras * r.margemUnitaria;
  assert.ok(comExtras >= Number(BASE.retirada), "os extras anunciados nao fecham a retirada");
});

test("a agenda vazia encarece o atendimento de quem comparece", () => {
  const cheia = calcular({ ...BASE, ocupacao: "100" });
  const vazia = calcular({ ...BASE, ocupacao: "40" });
  assert.ok(vazia.custoReal > cheia.custoReal);
  assert.ok(vazia.precoMinimo > cheia.precoMinimo);
});

test("o custo real nunca fica abaixo do insumo", () => {
  const r = calcular({ ...BASE, fixo: "0" });
  perto(r.custoReal, Number(BASE.insumos));
});

test("sem preco atual, o veredito e sem-preco e nao divide por zero", () => {
  const r = calcular({ ...BASE, atual: "0" });
  assert.equal(r.veredito.tipo, "sem-preco");
  assert.ok(Number.isFinite(r.precoIdeal) && Number.isFinite(r.precoMinimo));
});

test("margem nao positiva torna o equilibrio impossivel, sem virar Infinity", () => {
  // Preco atual menor que o insumo: cada atendimento perde dinheiro.
  const r = calcular({ ...BASE, atual: "30" });
  assert.equal(r.equilibrio, null);
  assert.ok(r.margemUnitaria <= 0);
});

test("campo vazio ou lixo vira zero, e os limites seguram a divisao", () => {
  const r = calcular({});
  assert.equal(r.capacidade > 0, true);
  for (const [chave, valor] of Object.entries(r)) {
    if (chave === "veredito" || chave === "equilibrio") continue;
    assert.ok(Number.isFinite(valor), `${chave} veio ${valor}`);
  }

  const e = normalizar({ insumos: "abc", duracao: "0", ocupacao: "999", imposto: "-5" });
  assert.equal(e.insumos, 0);
  assert.equal(e.duracao, 5);     // minimo, senao a capacidade explode
  assert.equal(e.ocupacao, 1);    // 100%, o teto
  assert.equal(e.imposto, 0);     // piso
});

test("imposto maior reduz a sobra e sobe o preco minimo", () => {
  const semImposto = calcular({ ...BASE, imposto: "0" });
  const comImposto = calcular({ ...BASE, imposto: "15" });
  assert.ok(comImposto.precoMinimo > semImposto.precoMinimo);
  assert.ok(comImposto.sobra < semImposto.sobra);
});
