// Testes do leitor de robots.txt.
//
// O caso que mais importa e o da precedencia de grupo: a primeira versao
// somava as regras do grupo `*` com as do grupo dirigido a nos, e um `Allow`
// generico furava um `Disallow` escrito especificamente para o nosso coletor.
// Um erro desses faz a ferramenta buscar exatamente a pagina que o dono do
// site pediu para nao buscarmos.

import { test } from "node:test";
import assert from "node:assert/strict";
import { interpretar, permite, LIBERADO } from "../src/robots.ts";

const checar = (texto, casos) => {
  const r = interpretar(texto);
  for (const [caminho, esperado] of casos) {
    assert.equal(permite(r, caminho), esperado, `${caminho} deveria ser ${esperado}`);
  }
};

test("um grupo dirigido a nos anula por completo o grupo curinga", () => {
  checar(`
User-agent: *
Disallow: /admin/
Allow: /admin/publico

User-agent: auditoria-clinicas
Disallow: /
`, [["/", false], ["/admin/publico", false], ["/qualquer", false]]);
});

test("sem grupo nosso, vale o curinga, com o padrao mais especifico ganhando", () => {
  checar(`
User-agent: *
Disallow: /admin/
Allow: /admin/publico
Disallow: /*.pdf$
`, [
    ["/", true],
    ["/admin/x", false],
    ["/admin/publico", true],   // Allow mais longo vence o Disallow
    ["/a.pdf", false],          // curinga com ancora
    ["/a.pdfx", true],          // a ancora impede o casamento
  ]);
});

test("Disallow vazio libera tudo", () => {
  checar("User-agent: *\nDisallow:\n", [["/", true], ["/x", true]]);
});

test("User-agents consecutivos compartilham as mesmas regras", () => {
  checar(`
User-agent: googlebot
User-agent: auditoria-clinicas
Disallow: /privado
`, [["/privado", false], ["/publico", true]]);
});

test("grupo de outro robo nao nos atinge", () => {
  checar("User-agent: googlebot\nDisallow: /\n", [["/", true]]);
});

test("comentarios e linhas tortas sao ignorados sem travar", () => {
  checar(`
# comentario solto
User-agent: *   # ate aqui
Disallow: /a    # e aqui
linha sem dois pontos
Sitemap: https://exemplo.com/sitemap.xml
Crawl-delay: 10
`, [["/a", false], ["/b", true]]);
});

test("empate entre Allow e Disallow do mesmo tamanho resolve pelo Allow", () => {
  checar("User-agent: *\nDisallow: /abc\nAllow: /abc\n", [["/abc", true]]);
});

test("robots ausente ou ilegivel libera tudo", () => {
  assert.equal(permite(LIBERADO, "/"), true);
  assert.equal(permite(LIBERADO, "/qualquer/coisa"), true);
  // Arquivo presente mas sem nenhuma regra aplicavel tambem libera.
  checar("# so um comentario\n", [["/", true]]);
});

test("caracteres especiais no padrao sao tratados como literais", () => {
  // Um ponto no padrao nao pode virar o "qualquer caractere" da regex.
  checar("User-agent: *\nDisallow: /a.b\n", [["/a.b", false], ["/axb", true]]);
});
