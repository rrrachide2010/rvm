/**
 * Testes de ponta a ponta dos fluxos comerciais, no build estático real.
 *
 * Cobre o que um clique errado custaria em venda: a reserva chegar ao
 * WhatsApp certo com a peça certa, a busca de loja achar a cidade, os looks
 * apontarem para produtos reais, o menu do celular abrir e fechar, e o site
 * continuar inteiro sem JavaScript.
 *
 * Uso: npm run build && npm test
 */
import { chromium } from "playwright";
import { servir } from "./servidor.mjs";

const { base: B, fechar } = await servir();
const b = await chromium.launch();
let falhas = 0;
const ok = (c, m) => { console.log(c ? "ok  " : "FALHA", m); if (!c) falhas++; };

// 1. Reserva na loja
let p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p.goto(B + "/produtos/sm-camisa-bambu/?cor=Lil%C3%A1s", { waitUntil: "networkidle" });
ok(await p.locator("button[aria-pressed=true][aria-label='Lilás']").count() === 1, "cor da URL (Lilás) selecionada");
ok(await p.getByRole("button", { name: "Escolha a cidade para consultar" }).isDisabled(), "reserva desligada sem cidade");
await p.getByLabel("Cidade").selectOption({ label: "Mairinque/SP" });
await p.getByLabel("Tamanho").selectOption("3");
const href = await p.getByRole("link", { name: "Consultar reserva" }).getAttribute("href");
const msg = decodeURIComponent(href.split("text=")[1]);
ok(href.startsWith("https://wa.me/551532687328?"), "reserva vai ao WhatsApp da loja de Mairinque");
ok(msg.includes("Peça: Camisa Social · Fibra de Bambu") && msg.includes("Cor: Lilás") && msg.includes("Tamanho: 3") && msg.includes("Mairinque"), "mensagem traz peça, cor, tamanho e cidade");
await p.getByRole("button", { name: "Cinza Chumbo" }).click();
ok(p.url().includes("cor=Cinza+Chumbo") || p.url().includes("cor=Cinza%20Chumbo"), "trocar cor atualiza a URL");
await p.getByLabel("Cidade").selectOption({ label: "Boituva/SP" });
ok((await p.getByRole("link", { name: "Consultar reserva" }).getAttribute("href")).startsWith("https://wa.me/5515974050177?"), "Boituva usa o WhatsApp central");

// 2. Localizador
await p.goto(B + "/lojas/", { waitUntil: "networkidle" });
const busca = p.getByLabel("Buscar por cidade");
await busca.fill("sao roque");
ok(await p.locator("li h3").allTextContents().then(t => t.length === 1 && t[0] === "São Roque"), "busca sem acento acha São Roque");
await busca.fill("Campinas");
ok(await p.getByText("Ainda não encontramos essa cidade.").isVisible(), "cidade inexistente mostra saída pelo WhatsApp");
await busca.fill("");
ok(await p.locator("li h3").count() === 5, "busca vazia lista as 5 cidades");
ok((await p.getByRole("link", { name: /Como chegar|Rota até a loja de Mairinque/ }).getAttribute("href")).includes("google.com/maps"), "Mairinque tem rota no Maps");

// 3. Abas de ocasião pelo teclado + look builder
await p.goto(B + "/", { waitUntil: "networkidle" });
const aba1 = p.getByRole("tab", { name: /Trabalho/ });
await aba1.focus(); await p.keyboard.press("ArrowDown");
ok(await p.getByRole("tab", { name: /Casamentos/ }).getAttribute("aria-selected") === "true", "seta troca a ocasião");
await p.keyboard.press("End");
ok(await p.getByRole("tab", { name: /Eventos especiais/ }).evaluate(e => e === document.activeElement && e.getAttribute("aria-selected") === "true"), "End vai à última e leva o foco");
ok(await p.getByRole("link", { name: "Tudo para eventos especiais" }).getAttribute("href") === "/ocasioes/eventos-especiais/", "painel aponta para a página da ocasião");
await p.getByRole("button", { name: "Reunião de segunda" }).click();
ok(await p.getByRole("list", { name: "Peças do look Reunião de segunda" }).locator("li").count() === 2, "look troca as peças");
await p.getByRole("button", { name: /Mostrar camisa/ }).click();
ok((await p.getByText(/^Camisa: Camisa Social · Fibra de Bambu, Azul Claro$/).count()) === 1, "escolher peça troca a foto e a legenda");
const lookWa = decodeURIComponent((await p.getByRole("link", { name: "Consultar este look na loja" }).getAttribute("href")).split("text=")[1]);
ok(lookWa.includes("Blazer Slim · Xadrez Cinza") && lookWa.includes("Azul Claro"), "WhatsApp do look lista as peças");

// 4. Menu móvel
p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(B + "/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Abrir menu" }).click();
ok(await p.getByRole("dialog", { name: "Menu" }).isVisible(), "menu abre");
await p.keyboard.press("Escape");
await p.getByRole("dialog").waitFor({ state: "detached", timeout: 2000 }).catch(() => {});
ok(await p.getByRole("dialog").count() === 0 && await p.getByRole("button", { name: "Abrir menu" }).evaluate(e => e === document.activeElement), "Esc fecha e devolve o foco");
await p.getByRole("button", { name: "Abrir menu" }).click();
await p.getByRole("dialog").getByRole("link", { name: "Lojas", exact: true }).click();
await p.waitForURL("**/lojas/");
await p.getByRole("dialog").waitFor({ state: "detached", timeout: 2000 }).catch(() => {});
ok(await p.getByRole("dialog").count() === 0, "navegar fecha o menu");

// 5. Sem JavaScript: conteúdo inteiro visível
const semJs = await (await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })).newPage();
await semJs.goto(B + "/", { waitUntil: "load" });
const invis = await semJs.evaluate(() => [...document.querySelectorAll("[data-revelar]")].filter(e => getComputedStyle(e).opacity === "0").length);
ok(invis === 0, `sem JS nada fica invisível (${invis} escondidos)`);
await semJs.goto(B + "/produtos/sm-terno/", { waitUntil: "load" });
ok(await semJs.getByRole("heading", { level: 1, name: "Terno Slim" }).isVisible() && await semJs.getByRole("link", { name: /Comprar no Mercado Livre/ }).isVisible(), "produto completo no HTML estático");

await b.close();
fechar();
console.log(falhas ? `${falhas} FALHA(S)` : "todos os fluxos passaram");
process.exit(falhas ? 1 : 0);
