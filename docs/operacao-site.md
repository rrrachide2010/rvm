# Operação do site

Runbook do que fica no ar: `site/index.html`, `site/enfermeiras.html` e
`site/calculadora.html`, servidos como arquivos estáticos, sem build.

Este documento é para o dia em que algo quebrar às 22h e ninguém lembrar como
funciona. Ele descreve o que existe hoje e o que ainda **não** existe — as duas
coisas estão marcadas.

> **Estado em 30/08/2026.** Nada do que está em "a ligar" foi instalado. Este
> arquivo especifica; ele não configura nada sozinho.

---

## 1. O que está no ar, e onde

| item | estado | onde |
| --- | --- | --- |
| Hospedagem | **a confirmar** — o README indica Vercel apontando para `site/` | — |
| Domínio próprio | **não existe** | placeholder `https://EXEMPLO-DOMINIO.com.br` |
| Indexação | **bloqueada de propósito** | `site/robots.txt` → `Disallow: /` |
| Formulário da lista de espera | **desligado de propósito** | `site/enfermeiras.html` |
| Contato | **placeholder** | `wa.me/5500000000000`, `contato@exemplo.com.br` |

O bloqueio de indexação e o formulário desligado não são pendências esquecidas:
são decisões corretas enquanto o contato for falso. Um dono de clínica achando a
página no Google e caindo num número que não existe é pior do que não ser achado.
A ordem de ligação está em [§7](#7-ordem-de-ligação-antes-do-lançamento).

---

## 2. Monitor de uptime

**Por que importa aqui:** o site é estático e a hospedagem é de terceiros, então a
falha provável não é o código — é o host fora, o domínio expirado ou o certificado
vencido. Nenhum dos três avisa antes.

**O que monitorar** (três checagens, não uma):

| checagem | URL | intervalo | alerta quando |
| --- | --- | --- | --- |
| Página principal | `https://DOMINIO/` | 5 min | 2 falhas seguidas |
| Página da lista | `https://DOMINIO/enfermeiras` | 15 min | 2 falhas seguidas |
| Calculadora | `https://DOMINIO/calculadora` | 15 min | 2 falhas seguidas |

Monitorar as três, e não só a raiz, porque as três são destinos de link
independentes: a calculadora é o link da bio, e ela pode quebrar sozinha (é a
única página com JavaScript próprio).

**Além do HTTP 200, verificar conteúdo.** Um host mal configurado devolve 200 com
página de erro. A checagem deve exigir uma string que só existe na página certa:

- `/` → `Quantos horários a sua clínica`
- `/enfermeiras` → `Entrar na lista`
- `/calculadora` → `preço ideal`

**Certificado TLS:** alerta com **30 dias** de antecedência do vencimento.
**Domínio:** alerta com **60 dias**. Renovação de domínio esquecida é a falha mais
cara e mais lenta de reverter da lista inteira.

**Ferramenta:** não escolhida. O critério é ter alerta por um canal que você lê
fora do horário de trabalho, e checagem de conteúdo, não só de status.
Serviço gratuito com 5 minutos de intervalo resolve este caso — não há SLA a
cumprir com ninguém.

**Onde o alerta chega:** definir **um** canal e **uma** pessoa
([§5](#5-credenciais-e-acesso)). Alerta que chega para dois donos não chega para
nenhum.

---

## 3. Rastreamento de erro no cliente

**Situação real:** duas das três páginas não têm JavaScript próprio. O único
código que pode quebrar no navegador de alguém é o `<script>` da
`calculadora.html`, e ele quebra silenciosamente: a pessoa digita, nada acontece,
ela vai embora e você nunca fica sabendo.

**O que especificar (não instalado):**

Um coletor de erro precisa capturar dois eventos do navegador:

```
window.addEventListener("error", ...)              // exceção não tratada
window.addEventListener("unhandledrejection", ...) // promessa rejeitada
```

e enviar: mensagem, arquivo, linha, `navigator.userAgent`, URL e horário.

**Duas maneiras, e a diferença entre elas:**

1. **Script de terceiros** (Sentry e similares). Dá agrupamento, histórico e
   alerta prontos. **Custo:** um `<script>` externo em todas as páginas, mais um
   terceiro recebendo dados de quem visita. Precisa da sua aprovação explícita
   antes de entrar — [regra do projeto](../README.md).
2. **Coletor próprio.** Umas 15 linhas inline mandando `navigator.sendBeacon()`
   para um endpoint seu. Sem terceiro e sem dependência nova, mas exige um
   endpoint, que hoje não existe (é a mesma pendência do formulário — §4).

**Recomendação:** não instalar nenhum dos dois agora. Enquanto não houver
tráfego pago, o volume de erro é baixo demais para justificar um terceiro no
site, e o mesmo endpoint que o formulário vai precisar serve para os dois. Ligue
os dois juntos.

**Enquanto não houver:** a checagem manual do [§8](#8-checklist-de-revisão-periódica)
cobre o caso — abrir a calculadora e conferir se ela calcula.

---

## 4. Política de backup

**A pergunta certa não é "como faço backup do site", é "o que aqui não é
reproduzível".** O site é o repositório: `git clone` reconstrói todas as páginas,
byte a byte, a qualquer momento. Fazer backup do HTML é fazer backup de algo que
já tem duas cópias (sua máquina e o GitHub).

O que **de fato** precisa de backup é o que não está no git — e boa parte disso
está fora do git de propósito:

| o que | está no git? | reproduzível? | precisa de backup |
| --- | --- | --- | --- |
| `site/`, `src/`, `docs/` | sim | — | **não** |
| `.env` (chave da Places API) | não (`.gitignore`) | sim, gerando outra chave | **não** — mas veja abaixo |
| `data/clinicas.json` | não (`.gitignore`) | **não** | **SIM, é o único** |
| `out/` (relatórios) | não | sim, `npm run relatorio` | não |
| `node_modules/` | não | sim, `npm ci` | não |
| Configuração do host | não | sim, é um `vercel.json` de 4 linhas | não |

**`data/clinicas.json` é o único arquivo insubstituível do projeto.** As fichas
do Maps se buscam de novo, mas o campo `manual` de cada auditoria — tempo de
resposta no WhatsApp, avaliações sem resposta, observações — foi levantado à mão,
uma clínica por vez, e não tem como recuperar. Perder esse arquivo é perder
trabalho manual que não volta.

**Rotina:** cópia do `data/clinicas.json` para fora da máquina **toda vez que
rodar `auditar` ou anotar algo à mão** — não em calendário, em gatilho. Guardar
com data no nome, manter as 5 últimas.

```bash
cp data/clinicas.json "$HOME/backup-rvm/clinicas-$(date +%F).json"
```

Destino fora da mesma máquina (nuvem pessoal, pen drive, o que for). É um JSON de
poucos MB; não precisa de ferramenta.

**Sobre o `.env`:** não é backup, é acesso. A chave se regera no Google Cloud em
dois minutos. O que não pode acontecer é ela **vazar** — e a proteção contra isso
é ela nunca entrar no git, que já está garantido pelo `.gitignore`. Se vazar,
revogue no Console e gere outra; não tente "recuperar".

**Uma coisa que backup nenhum resolve:** `data/clinicas.json` guarda dados de
terceiros (nome, telefone e endereço de clínicas, de fonte pública). Cópia é
cópia: cada backup é mais um lugar onde esse dado existe. Mantenha as cópias na
sua máquina e na sua nuvem pessoal, não em pasta compartilhada.

---

## 5. Credenciais e acesso

**Regra que não se negocia:** nenhuma chave, token ou senha entra no
repositório. O `.env.example` guarda **nomes** de variável; valores ficam no
`.env` local, que está no `.gitignore`.

### Inventário

| conta | para quê | dono | como o segundo acessa |
| --- | --- | --- | --- |
| GitHub `rrrachide2010/rvm` | código e site | **a definir** | — |
| Host estático (Vercel?) | publicação | **a definir** | — |
| Registrador do domínio | domínio | **a definir** | — |
| Google Cloud (Places API) | chave da prospecção | **a definir** | — |
| Google Meu Negócio | ficha do Maps | **a definir** | — |
| Instagram | link na bio | **a definir** | — |
| Monitor de uptime | alertas | **a definir** | — |

> **Preencher isto é decisão sua, não minha.** Deixei "a definir" em vez de
> inventar nome. São duas pessoas no projeto (um desenvolvedor e uma enfermeira
> em formação, conforme as landings dizem) e a divisão precisa ser combinada
> entre vocês, não deduzida por mim.

### Três regras para preencher

1. **Um dono por conta, e um segundo com acesso de emergência.** Conta com um
   dono só vira ponto único de falha no dia em que essa pessoa perde o telefone.
2. **Acesso de emergência não é senha compartilhada.** É convite nominal
   (GitHub, Vercel e Google Cloud têm) ou cofre de senha com compartilhamento
   por item. Senha em conversa de WhatsApp não é acesso controlado.
3. **Verificação em duas etapas em todas as sete.** A do registrador de domínio
   e a do Google Cloud são as que doem: uma derruba o site inteiro, a outra vira
   fatura no seu cartão.

### Domínio

Ainda não existe. Quando existir, anotar aqui: registrador, data de expiração,
se a renovação automática está ligada, e onde o DNS está apontado. A lista de
arquivos a trocar quando o domínio existir está em [docs/seo.md](./seo.md).

---

## 6. Formulário da lista de espera — comportamento de confirmação

O formulário de `site/enfermeiras.html` está **desabilitado de propósito** e
continua assim. Esta seção **especifica** o comportamento; não liga nada.

### Contrato

- `method="post"`, `Content-Type: application/x-www-form-urlencoded`
- Campos: `nome` (texto, opcional), `email` (e-mail, **obrigatório**)
- Sucesso: qualquer `2xx`. Erro: qualquer outra coisa, ou falha de rede.

### Os três estados, e o que a pessoa vê

Um único elemento de mensagem, com `role="status"` e `aria-live="polite"`, para
que leitor de tela anuncie a mudança sem roubar o foco.

**1. Enviando** — assim que o `submit` sai:
> Botão desabilitado, texto vira `Enviando…`. Campos ficam `readonly`, não
> `disabled` (campo desabilitado some da navegação por teclado e o foco pula
> para lugar nenhum).

**2. Sucesso** — resposta `2xx`:
> O formulário some e no lugar dele aparece:
> **"Pronto. Você entra na lista com o e-mail `<e-mail digitado>`."**
> **"Te avisamos quando o mapa do que é permitido estiver no ar. Nada além disso."**
>
> Mostrar o e-mail digitado de volta é o que permite a pessoa perceber que
> errou a digitação. Sumir com o formulário é o que impede o envio duplicado —
> mais confiável que desabilitar o botão.

**3. Erro** — resposta não-`2xx` **ou** falha de rede:
> O formulário **continua na tela, preenchido**. Mensagem acima do botão:
> **"Não consegui enviar agora. Tenta de novo em um minuto?"**
> **"Se continuar falhando, me chama no WhatsApp: `<link>`."**
>
> Nunca limpar os campos num erro. E a saída alternativa por WhatsApp é o que
> impede a falha de virar lead perdido — depende de haver contato real, que hoje
> não há ([§1](#1-o-que-está-no-ar-e-onde)).

**Endpoint fora do ar** é o caso 3. Não existe um quarto estado: do ponto de
vista de quem preencheu, "servidor caiu" e "servidor recusou" são a mesma coisa,
e inventar mensagem diferente para cada um só ajuda quem já sabe o que é um 502.

**Timeout:** 10 segundos. Passou disso, trate como erro. Formulário girando para
sempre é pior que erro declarado.

### O que precisa existir antes de ligar

1. Um endpoint que aceite POST e guarde o e-mail em algum lugar que você lê.
2. Uma frase dizendo o que você faz com o e-mail, ao lado do botão — exigência
   da LGPD e, na prática, o que aumenta a taxa de preenchimento.
3. Um destino para o WhatsApp da mensagem de erro.

Enquanto os três não existirem, o campo desabilitado com o aviso atual está
**certo**. Coletar e-mail que se perde é pior que não coletar.

---

## 7. Ordem de ligação antes do lançamento

Tem ordem, e a ordem importa: cada passo depende do anterior estar certo.

1. **Contato real** — trocar `wa.me/5500000000000` e `contato@exemplo.com.br`
   pelos verdadeiros. Enquanto for placeholder, nada mais adianta.
2. **Domínio** — comprar, apontar, conferir o certificado. Trocar o placeholder
   nos arquivos listados em [docs/seo.md](./seo.md).
3. **Abrir a indexação** — `site/robots.txt`, trocar `Disallow: /` pelo bloco
   comentado que já está lá.
4. **Monitor de uptime** — §2. Só faz sentido depois que o domínio existe.
5. **Endpoint** — formulário (§6) e coletor de erro (§3), juntos.
6. **Medição** — depois de tudo acima. Ver [docs/medicao.md](./medicao.md).

---

## 8. Checklist de revisão periódica

Cada item tem periodicidade explícita. Item sem periodicidade não é checklist,
é lista de desejos.

### A cada publicação

- [ ] Abrir as **três** páginas e clicar em **todos** os links, incluindo os
      internos entre páginas. Não há build nem teste automático de link: só o olho.
- [ ] Conferir os marcadores `<!-- MARCA -->`, `<!-- CONTATO -->` e
      `<!-- FORMULARIO -->` — se o placeholder ainda está lá, o site não pode
      sair do `Disallow: /`.
- [ ] `npm run check` verde.

### Semanal

- [ ] Ler os alertas do monitor de uptime. Zero alerta e monitor mudo se parecem;
      confirme que a última checagem tem data de hoje.
- [ ] Abrir a calculadora e fazer **uma** conta completa. É a única página com
      lógica própria, e ela quebra em silêncio.

### Mensal

- [ ] **Abrir o site no celular, em rede móvel real, com o cache limpo.**
      Não é o modo responsivo do navegador do computador: é 4G de verdade, na
      aba anônima. É onde aparecem fonte que não carrega, imagem pesada e
      redirecionamento errado — coisas que o Wi‑Fi de casa esconde.
- [ ] Rodar `npm outdated` e ler o resultado. São duas dependências de
      desenvolvimento (`typescript`, `@types/node`) e nenhuma vai para o
      navegador, então atualizar é barato: `npm update` e `npm run check`. Se o
      typecheck quebrar, o custo aparece agora, não numa entrega.
- [ ] Conferir o consumo da Places API no Google Cloud. Cota estourada é fatura,
      e a ferramenta não avisa.
- [ ] Conferir que o backup do `data/clinicas.json` das últimas semanas existe
      de verdade — abrir um deles, não só ver o arquivo na pasta.

### Trimestral

- [ ] Revisar este documento contra a realidade. Runbook desatualizado é pior
      que runbook nenhum, porque ele é obedecido.
- [ ] Conferir quem tem acesso a cada conta do §5 e tirar quem não precisa mais.
- [ ] Conferir a data de expiração do domínio e se a renovação automática
      continua ligada.

### Anual

- [ ] Rodar `npm audit` e avaliar. Como nada disso vai ao navegador do visitante,
      a superfície é pequena — mas a revisão precisa ter data marcada.
- [ ] Trocar a chave da Places API. Chave que nunca gira é chave que vaza sem
      ninguém perceber.

---

## 9. Varredura do HTML — o que achei

Varri as três páginas atrás de link quebrado, contato divergente e o estado dos
marcadores. Separado entre o que já corrigi e o que depende de decisão sua.

### Links: nada quebrado

Conferi todos os `href` das três páginas — âncoras internas, caminhos relativos e
se o `#fragmento` existe na página de destino. **Nenhum link quebrado.** O único
`href="#"` é o `action` do formulário desligado, que está correto assim.

### Corrigido

**O comentário `<!-- MARCA -->` estava com a contagem errada.** Dizia "3 lugares
por página" e "6 substituições" no total; o README repetia o número. São **11**:
4 em `index.html`, 4 em `enfermeiras.html`, 3 em `calculadora.html` — a diferença
vem do `og:title`, que a calculadora não tem, e da própria calculadora, que não
existia quando o comentário foi escrito.

Junto apareceu uma armadilha que importa mais que a contagem: **`index.html` tem
"Retorno programado"**, nome de uma das sete rotinas do produto, não a marca. Um
find-replace de "Retorno" renomeia a rotina junto, e isso não quebra nada — só
fica errado na página até alguém ler. O comentário e o README agora avisam.

**`enfermeiras.html` e `calculadora.html` não tinham marcador nenhum.** As duas
receberam o comentário `<!-- MARCA -->` com a contagem local, apontando para o
comentário da `index.html` para o total.

### Depende de decisão sua

**1. O contato não existe em duas das três páginas.**

| página | WhatsApp | e-mail |
| --- | --- | --- |
| `index.html` | `wa.me/5500000000000` (placeholder) | `contato@exemplo.com.br` (placeholder) |
| `enfermeiras.html` | nenhum | nenhum |
| `calculadora.html` | nenhum | nenhum |

São dois problemas diferentes com a mesma cara.

O primeiro é que o contato da `index.html` é de mentira — só você tem o dado real,
e enquanto for assim o `Disallow: /` está certo.

O segundo é a divergência entre páginas. Na calculadora é defensável: a página é
uma ferramenta, o trabalho dela é calcular. Em `enfermeiras.html` é mais
discutível — com o formulário desligado, quem chega ali **não tem saída nenhuma**
além de voltar para a index. É a página do link da bio do Instagram.

`[ ]` adicionar contato ao rodapé de `enfermeiras.html`
`[ ]` deixar como está até o formulário ligar

**2. `meta robots` contradiz o `robots.txt`.** As três páginas declaram
`index,follow` enquanto `site/robots.txt` diz `Disallow: /`. Não é fatal — são
camadas diferentes, e o `robots.txt` vence na prática — mas é contradição escrita
no repositório, e no dia de abrir a indexação alguém vai mudar um e esquecer o
outro. Tratado em [docs/seo.md](./seo.md), que é onde os dois vivem.

**3. A hospedagem pode estar apontada para a branch errada.** O branch padrão do
repositório é `claude/aesthetic-nursing-business-ecosystem-gi42ul`; `main` existe
mas parou no commit inicial, sem `site/` nenhum. Se a Vercel estiver apontada para
`main`, o que está no ar não é este site. Confirmar em *Settings › Git › Production
Branch* — é a única linha deste documento que pode significar que o site no ar hoje
não é o deste repositório.

**4. O CI não roda no tronco.** `.github/workflows/ci.yml` dispara em `push` para
`main` e em `pull_request`. Como o tronco não é `main`, commit direto no tronco não
roda CI — só PR roda. Ou aponta o gatilho para o tronco real, ou trata PR como
obrigatório. Hoje é o segundo, por acidente.
