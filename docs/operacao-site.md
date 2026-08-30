# Operação do site

Runbook das cinco páginas que ficam no ar (`site/`), servidas como arquivos
estáticos, sem build.

Este documento é para o dia em que algo quebrar às 22h e ninguém lembrar como
funciona. Ele descreve o que existe hoje e o que ainda **não** existe — as duas
coisas estão marcadas, e nada aqui configura nada sozinho.

> **Estado em 30/08/2026.** Nada do que aparece como "a ligar" foi instalado.

---

## 1. O que está no ar, e onde

| item | estado | onde |
| --- | --- | --- |
| Páginas | 5 | `index`, `clinicas`, `enfermeiras`, `especialistas`, `calculadora` |
| Hospedagem | **a confirmar** — README indica host estático com Root Directory = `site` | `site/vercel.json` |
| Domínio próprio | **não existe** | placeholder `https://EXEMPLO-DOMINIO.com.br` |
| Indexação | **bloqueada de propósito** | `site/robots.txt` → `Disallow: /` |
| Formulário da lista de espera | **desligado de propósito** | `site/enfermeiras.html` |
| Contato | **placeholder** | `wa.me/5500000000000`, `contato@exemplo.com.br` |
| Marca | **provisória** ("Pele & Código") | `<!-- MARCA -->` em cada página |

O bloqueio de indexação e o formulário desligado não são pendências esquecidas:
são decisões corretas enquanto o contato for falso. Um dono de clínica achando a
página no Google e caindo num número que não existe é pior do que não ser achado.
A ordem de ligação está em [§7](#7-ordem-de-ligação-antes-do-lançamento).

---

## 2. Monitor de uptime

**Por que importa aqui:** o site é estático e a hospedagem é de terceiros, então a
falha provável não é o código — é o host fora, o domínio expirado ou o certificado
vencido. Nenhum dos três avisa antes.

**O que monitorar** — cinco checagens, uma por página, não só a raiz. As cinco são
destinos de link independentes: `clinicas` é o destino do e-mail de auditoria,
`calculadora` é o link da bio. Elas quebram sozinhas.

| checagem | intervalo | string que precisa aparecer na resposta |
| --- | --- | --- |
| `/` | 5 min | `cuidado clínico e software` |
| `/clinicas` | 5 min | `Quantos horários a sua clínica` |
| `/enfermeiras` | 15 min | `Entrar na lista` |
| `/especialistas` | 15 min | `co-produção` |
| `/calculadora` | 15 min | `preço ideal` |

**Exigir a string, não só o HTTP 200.** Host mal configurado devolve 200 com
página de erro, e monitor que só olha status fica verde enquanto o site está
quebrado. As duas de 5 minutos são as que recebem tráfego pago primeiro.

**Alertar com antecedência:** certificado TLS a **30 dias** do vencimento,
domínio a **60 dias**. Renovação de domínio esquecida é a falha mais cara e mais
lenta de reverter da lista inteira.

**Ferramenta:** não escolhida, e a escolha importa menos que dois critérios —
alerta por um canal que você lê fora do horário de trabalho, e checagem de
conteúdo. Serviço gratuito com 5 minutos de intervalo resolve; não há SLA a
cumprir com ninguém.

**Onde o alerta chega:** **um** canal e **uma** pessoa ([§5](#5-credenciais-e-acesso)).
Alerta que chega para dois donos não chega para nenhum.

---

## 3. Rastreamento de erro no cliente

**Situação real:** quatro das cinco páginas não têm JavaScript próprio. O único
código que pode quebrar no navegador de alguém é o `<script>` da
`calculadora.html` — e ele quebra em silêncio: a pessoa digita, nada acontece,
ela vai embora, e você nunca fica sabendo. É justamente a página que é o link da
bio.

**O que um coletor precisa capturar** (especificação, nada instalado):

```
window.addEventListener("error", ...)              // exceção não tratada
window.addEventListener("unhandledrejection", ...) // promessa rejeitada
```

enviando mensagem, arquivo, linha, `navigator.userAgent`, URL e horário.

**Duas maneiras, e a diferença entre elas:**

1. **Script de terceiros** (Sentry e similares). Agrupamento, histórico e alerta
   prontos. **Custo:** um `<script>` externo em todas as páginas e um terceiro
   recebendo dados de quem visita. Precisa da sua aprovação explícita antes de
   entrar — é regra do projeto.
2. **Coletor próprio.** ~15 linhas inline com `navigator.sendBeacon()` para um
   endpoint seu. Sem terceiro e sem dependência nova, mas exige um endpoint, que
   hoje não existe — a mesma pendência do formulário ([§6](#6-formulário-da-lista-de-espera--comportamento-de-confirmação)).

**Recomendação: nenhum dos dois agora.** Sem tráfego, o volume de erro é baixo
demais para justificar um terceiro no site, e o endpoint que o formulário vai
precisar serve para os dois. Ligue juntos.

**Enquanto não houver:** a checagem semanal do [§8](#8-checklist-de-revisão-periódica)
cobre — abrir a calculadora e fazer uma conta.

---

## 4. Política de backup

**A pergunta certa não é "como faço backup do site", é "o que aqui não é
reproduzível".** O site é o repositório: `git clone` reconstrói as cinco páginas,
byte a byte, quando quiser. Fazer backup do HTML é fazer backup de algo que já
tem duas cópias — sua máquina e o GitHub.

O que **de fato** precisa de backup é o que não está no git:

| o que | no git? | reproduzível? | precisa de backup |
| --- | --- | --- | --- |
| `site/`, `src/`, `docs/`, `README.md` | sim | — | **não** |
| `.env` (chave da Places API) | não (`.gitignore`) | sim, gerando outra chave | **não** — veja abaixo |
| `data/clinicas.json` | não (`.gitignore`) | **não** | **SIM — é o único** |
| `out/` (relatórios gerados) | não | sim, `npm run relatorio` | não |
| `node_modules/` | não | sim, `npm ci` | não |
| Config do host | não | sim, é um `vercel.json` de 4 linhas | não |

**`data/clinicas.json` é o único arquivo insubstituível do projeto.** As fichas
do Maps se buscam de novo com `npm run buscar`. Já o campo `manual` de cada
auditoria — `minutosParaResponder`, `avaliacoesSemResposta`, `observacoes` — foi
levantado à mão, uma clínica por vez, mandando mensagem de verdade e contando
avaliação na tela. Isso não se regenera. Perder o arquivo é perder trabalho
manual que não volta.

**Rotina: por gatilho, não por calendário.** Copie depois de **toda** rodada de
`auditar` e de **toda** anotação à mão:

```bash
mkdir -p "$HOME/backup-rvm"
cp data/clinicas.json "$HOME/backup-rvm/clinicas-$(date +%F-%H%M).json"
```

Destino fora da máquina (nuvem pessoal, pen drive). Mantenha as 5 últimas. É um
JSON de poucos MB; não precisa de ferramenta nenhuma.

**Sobre o `.env`: não é backup, é acesso.** A chave se regera no Google Cloud em
dois minutos. O que não pode acontecer é ela **vazar**, e a proteção é ela nunca
entrar no git — já garantido pelo `.gitignore`. Se vazar: revogue no Console e
gere outra. Não tente "recuperar".

**Uma coisa que backup nenhum resolve:** `data/clinicas.json` guarda dados de
terceiros (nome, telefone e endereço de clínicas, de fonte pública). Cada cópia é
mais um lugar onde esse dado existe. Guarde na sua máquina e na sua nuvem
pessoal — não em pasta compartilhada, não em repositório.

---

## 5. Credenciais e acesso

**Regra que não se negocia:** nenhuma chave, token ou senha entra no repositório.
O `.env.example` guarda **nomes** de variável; valores ficam no `.env` local, que
está no `.gitignore`.

### Inventário

| conta | para quê | dono | acesso de emergência |
| --- | --- | --- | --- |
| GitHub `rrrachide2010/rvm` | código e site | **a definir** | **a definir** |
| Host estático (Vercel?) | publicação | **a definir** | **a definir** |
| Registrador do domínio | domínio | **a definir** | **a definir** |
| Google Cloud (Places API) | chave da prospecção | **a definir** | **a definir** |
| Google Meu Negócio | ficha do Maps | **a definir** | **a definir** |
| Instagram | link na bio | **a definir** | **a definir** |
| Monitor de uptime | alertas | **a definir** | **a definir** |
| Endpoint do formulário | lista de espera | não existe | — |

> **Preencher isto é decisão sua.** Deixei "a definir" em vez de inventar nome.
> São duas pessoas no projeto e a divisão precisa ser combinada entre vocês.

### Três regras para preencher

1. **Um dono por conta, e um segundo com acesso de emergência.** Conta com um
   dono só vira ponto único de falha no dia em que essa pessoa perde o telefone.
2. **Acesso de emergência não é senha compartilhada.** É convite nominal —
   GitHub, Vercel e Google Cloud têm — ou cofre de senha com compartilhamento por
   item. Senha em conversa de WhatsApp não é acesso controlado.
3. **Verificação em duas etapas nas sete.** As do registrador e do Google Cloud
   são as que doem: uma derruba o site inteiro, a outra vira fatura no cartão.

### Domínio

Ainda não existe. Quando existir, anote aqui: registrador, data de expiração, se
a renovação automática está ligada e onde o DNS aponta. A lista de arquivos a
trocar está em [docs/seo.md](./seo.md).

---

## 6. Formulário da lista de espera — comportamento de confirmação

O formulário de `site/enfermeiras.html` está **desabilitado de propósito** e
continua assim. Esta seção **especifica** o comportamento; não liga nada.

### Contrato

- `method="post"`, `Content-Type: application/x-www-form-urlencoded`
- Campos: `nome` (texto, opcional), `email` (e-mail, **obrigatório**)
- Sucesso: qualquer `2xx`. Erro: qualquer outra coisa, ou falha de rede.
- Timeout: **10 segundos**; passou disso, trate como erro. Formulário girando
  para sempre é pior que erro declarado.

### Os três estados

Uma única região de mensagem, com `role="status"` e `aria-live="polite"`, para
leitor de tela anunciar a mudança sem roubar o foco.

**1. Enviando** — assim que o `submit` sai:

> Botão desabilitado, texto vira `Enviando…`. Os campos ficam `readonly`, **não**
> `disabled`: campo desabilitado sai da ordem de tabulação e o foco de quem
> navega por teclado pula para lugar nenhum.

**2. Sucesso** — resposta `2xx`:

> O formulário some e no lugar dele aparece:
>
> **"Pronto. Você entra na lista com o e-mail `<e-mail digitado>`."**
> **"Te avisamos quando o mapa do que é permitido estiver no ar. Nada além disso."**
>
> Devolver o e-mail digitado é o que permite a pessoa perceber que errou a
> digitação — é o erro mais comum e o mais silencioso. Sumir com o formulário
> impede o envio duplicado de forma mais confiável que desabilitar o botão.

**3. Erro** — resposta não-`2xx` **ou** falha de rede **ou** timeout:

> O formulário **continua na tela, preenchido**. Mensagem acima do botão:
>
> **"Não consegui enviar agora. Tenta de novo em um minuto?"**
> **"Se continuar falhando, me chama no WhatsApp: `<link>`."**
>
> Nunca limpar os campos num erro. A saída por WhatsApp é o que impede a falha
> de virar contato perdido — e depende de haver contato real, que hoje não há.

**Endpoint fora do ar é o caso 3.** Não existe um quarto estado: para quem
preencheu, "servidor caiu" e "servidor recusou" são a mesma coisa, e mensagem
diferente para cada um só ajuda quem já sabe o que é um 502.

### O que precisa existir antes de ligar

1. Um endpoint que aceite POST e guarde o e-mail onde você lê.
2. Uma frase ao lado do botão dizendo o que você faz com o e-mail — exigência da
   LGPD e, na prática, o que aumenta o preenchimento.
3. Um WhatsApp real para a mensagem de erro.

Enquanto os três não existirem, o campo desabilitado com o aviso atual está
**certo**. Coletar e-mail que se perde é pior que não coletar.

---

## 7. Ordem de ligação antes do lançamento

Tem ordem, e a ordem importa: cada passo depende do anterior.

1. **Contato real** — trocar `wa.me/5500000000000` e `contato@exemplo.com.br`
   nas três páginas que têm `<!-- CONTATO -->`. Enquanto for placeholder, nada
   mais adianta.
2. **Marca definitiva** — "Pele & Código" está marcado como provisório. Trocar
   depois de indexar custa muito mais caro que trocar antes.
3. **Domínio** — comprar, apontar, conferir o certificado, e trocar o placeholder
   nos arquivos listados em [docs/seo.md](./seo.md).
4. **Abrir a indexação** — `site/robots.txt`: trocar `Disallow: /` pelo bloco que
   já está comentado no próprio arquivo.
5. **Monitor de uptime** — §2. Só faz sentido depois que o domínio existe.
6. **Endpoint** — formulário (§6) e coletor de erro (§3), juntos.
7. **Medição** — só depois de tudo acima. Ver [docs/medicao.md](./medicao.md).

---

## 8. Checklist de revisão periódica

Cada item tem periodicidade explícita. Item sem periodicidade não é checklist, é
lista de desejos.

### A cada publicação

- [ ] Abrir as **cinco** páginas **pela URL publicada** e clicar em **todos** os
      links, inclusive os cruzados entre elas. Não há build nem teste de link: só
      o olho. Tem que ser pela URL: o logo aponta para `./`, que na raiz do host
      é a home e no arquivo aberto do disco é a listagem da pasta. Conferir pelo
      `file://` reprova um link que está certo.
- [ ] Conferir `<!-- MARCA -->`, `<!-- CONTATO -->` e `<!-- FORMULARIO -->`. Se
      o placeholder ainda estiver lá, o site **não pode** sair do `Disallow: /`.
- [ ] `npm run check` verde.

### Semanal

- [ ] Ler os alertas do monitor. Zero alerta e monitor mudo se parecem: confirme
      que a última checagem tem data de hoje.
- [ ] Abrir a calculadora e fazer **uma** conta completa. É a única página com
      lógica própria e ela quebra em silêncio.

### Mensal

- [ ] **Abrir o site no celular, em rede móvel real, com o cache limpo.** Não é
      o modo responsivo do navegador do computador: é 4G de verdade, em aba
      anônima, com o Wi‑Fi desligado. É onde aparecem fonte que não carrega,
      redirecionamento errado e página pesada — tudo que o Wi‑Fi de casa esconde.
      Passar pelas cinco páginas e usar a calculadora até o resultado.
- [ ] `npm outdated`. São duas dependências, ambas de desenvolvimento
      (`typescript`, `@types/node`), e nenhuma vai para o navegador — atualizar é
      barato: `npm update` e `npm run check`. Se o typecheck quebrar, o custo
      aparece agora e não no meio de uma entrega.
- [ ] Consumo da Places API no Google Cloud. Cota estourada vira fatura, e a
      ferramenta não avisa.
- [ ] Conferir que os backups do `data/clinicas.json` existem **de verdade**:
      abrir um deles, não só ver o arquivo na pasta.

### Trimestral

- [ ] Revisar este documento contra a realidade. Runbook desatualizado é pior
      que runbook nenhum, porque ele é obedecido.
- [ ] Revisar quem tem acesso a cada conta do §5 e tirar quem não precisa mais.
- [ ] Conferir expiração do domínio e se a renovação automática segue ligada.

### Anual

- [ ] `npm audit` e avaliação do resultado. A superfície é pequena — nada disso
      chega ao navegador do visitante — mas a revisão precisa ter data marcada.
- [ ] Trocar a chave da Places API. Chave que nunca gira é chave que vaza sem
      ninguém perceber.

---

## 9. O que depende de decisão sua

A varredura do HTML separou o que é objetivamente errado (corrigido nesta
entrega) do que é escolha de negócio. Estes são os segundos — **nada foi
inventado**:

1. **Qual é o WhatsApp e o e-mail reais.** Hoje `wa.me/5500000000000` e
   `contato@exemplo.com.br` em `index`, `clinicas` e `especialistas`.
2. **`enfermeiras.html` e `calculadora.html` não têm contato nenhum.** As outras
   três têm WhatsApp e e-mail. Ou é decisão deliberada (o funil da enfermeira
   converte por formulário, não por conversa), ou é esquecimento. As duas
   leituras são defensáveis e a escolha é sua.
3. **A marca é provisória.** "Pele & Código" aparece 15 vezes em `site/*.html`.
   Trocar antes de indexar é barato; depois, não.
4. **Qual host, e quem é o dono da conta** (§5).
5. **`clinicas.html` promete "o no-show cai 30% ou a mensalidade volta"** e
   justifica com *"é o efeito conhecido de lembrar a pessoa duas vezes"*. A
   promessa comercial é sua e eu não a toquei — mas a justificativa é uma
   afirmação sobre efeito conhecido **sem fonte citada**. Ou cite a fonte, ou
   reescreva como o que ela de fato é: a razão pela qual vocês aceitam correr o
   risco da garantia.
6. **O `<meta name="robots" content="index,follow">` das cinco páginas convive
   com `Disallow: /` no `robots.txt`.** Não é contradição técnica — o
   `robots.txt` impede o rastreamento e a meta fica sem efeito — mas as duas
   dizem intenções opostas. Deixei como está porque a meta é o estado desejado
   pós-lançamento; se preferir coerência agora, a meta vira `noindex` e volta a
   `index` no passo 4 do §7.
