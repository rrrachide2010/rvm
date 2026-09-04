# Auditoria de clínicas

Ferramenta de prospecção para o serviço de automação de agenda: encontra clínicas de
estética numa cidade, avalia a presença digital de cada uma e gera um relatório de
uma página para enviar ao dono — o diagnóstico pronto, antes de pedir qualquer reunião.

Sem servidor, sem build, sem framework. Node 22 roda os arquivos `.ts` diretamente.

## Preparo

```bash
npm install
cp .env.example .env
```

Preencha o `.env`:

1. **`GOOGLE_MAPS_API_KEY`** — no [Google Cloud Console](https://console.cloud.google.com/),
   crie um projeto, habilite a **Places API (New)** e gere uma chave em
   *APIs e Serviços › Credenciais*. Restrinja a chave a essa API.
   O Google exige cartão cadastrado e oferece uma cota gratuita mensal; confira as
   condições atuais na página de preços do Places antes de rodar em volume, porque o
   custo por chamada varia conforme os campos pedidos.
2. **`REMETENTE_NOME` e `REMETENTE_CONTATO`** — aparecem no rodapé do relatório.
   Sem eles a ferramenta gera assim mesmo, mas avisa antes de você enviar.

O `.env` está no `.gitignore`. A chave nunca entra no código nem no repositório.

## Uso

```bash
npm run buscar    -- --cidade "Campinas, SP" --consulta "clínica de estética" --max 60
npm run auditar
npm run relatorio -- --top 20
```

- **`buscar`** consulta o Places e grava as fichas em `data/clinicas.json`.
  Rodar de novo não duplica: só acrescenta o que ainda não está na base.
  O Google devolve no máximo ~60 resultados por consulta — para passar disso,
  repita variando o bairro (`--cidade "Cambuí, Campinas, SP"`) ou o termo
  (`--consulta "harmonização facial"`, `"limpeza de pele"`).
- **`auditar`** abre o site de cada clínica e pontua os achados.
  Só processa quem ainda não foi auditado; use `--forcar` para refazer.
- **`relatorio`** escreve os HTML em `out/`. Abra `out/index.html` para a fila
  ordenada por oportunidade, e imprima cada relatório em PDF pelo navegador
  (Ctrl+P → Salvar como PDF; o CSS já tem regras de impressão).
- **`listar`** mostra a base no terminal.

## O que o índice de oportunidade significa

Soma dos pesos dos problemas encontrados, de 0 a 100. **Quanto maior, mais há para
resolver** — ou seja, melhor o prospecto. Uma clínica com índice 70 tem muito a ganhar
e uma conversa fácil; uma com índice 10 já resolveu a vitrine, e o argumento com ela
precisa ser a operação da agenda, não a presença digital.

Os pesos estão em `src/score.ts`, em um lugar só. Ajuste conforme aprender o que
realmente faz o dono responder.

## O que a ferramenta não mede

Duas coisas do relatório precisam de trabalho manual, e estão marcadas como tal na
página gerada:

- **Tempo de resposta no WhatsApp.** Só se mede mandando uma mensagem real, como
  uma cliente faria. Anote o horário do envio e o da resposta.
- **Avaliações sem resposta do proprietário.** A API do Google não expõe as respostas
  do dono — esse número é contado a olho na ficha do Maps.

Para registrar os dois, edite o campo `manual` da auditoria em `data/clinicas.json`
(`minutosParaResponder`, `avaliacoesSemResposta`, `observacoes`) e gere o relatório
de novo. Reauditar não apaga o que foi anotado à mão.

## Estrutura

```
src/cli.ts         subcomandos e argumentos
src/places.ts      cliente da Places API (New)
src/site.ts        busca o site e extrai os sinais
src/robots.ts      lê o robots.txt do alvo e decide se a busca é permitida
src/score.ts       transforma sinais em achados e pontuação  ← ajuste os pesos aqui
src/relatorio.ts   HTML do relatório e do índice
src/store.ts       persistência em data/clinicas.json
src/whatsapp.ts    custo por mensagem da Meta e o que sobra da mensalidade
src/tipos.ts       tipos compartilhados
test/              testes das três peças que não podem errar em silêncio
scripts/og.mjs     gera a imagem de compartilhamento
```

`npm run check` roda o typecheck e `npm test` roda os testes. A CI roda os dois,
mais a auditoria de contraste dos tokens.

## O custo de mensagem cabe na mensalidade — com uma condição

A mensalidade de R$ 350 vende sete rotinas que rodam por mensagem, e cada
mensagem tem preço de tabela da Meta. O custo não estava modelado em lugar
nenhum. Agora está, em `src/whatsapp.ts`, e a conclusão inverte o que eu
supunha: **o volume de atendimento não é o problema; o volume de marketing é.**

Com as proporções padrão (confirmação e lembrete por atendimento, 15% de
remarcação, 40% de retorno, 50% de pedido de avaliação, 100 reativações/mês,
20% caindo na janela gratuita):

| Atendimentos/mês | Custo Meta | Fatia da mensalidade |
| ---: | ---: | ---: |
| 100 | R$ 44 | 13% |
| 300 | R$ 65 | 19% |
| 800 | R$ 118 | 34% |
| 1.200 | R$ 160 | 46% |

O ponto em que R$ 350 deixa de cobrir o custo fica em **3.000 atendimentos por
mês** — fora do alcance de clínica de estética. A mensalidade plana sobrevive
ao tamanho da clínica.

O que ela não sobrevive é a campanha. Marketing custa quase 8× uma utilidade e
**não** entra na janela gratuita. Numa clínica de 300 atendimentos:

| Reativações/mês | Custo Meta | Fatia da mensalidade |
| ---: | ---: | ---: |
| 0 | R$ 32 | 9% |
| 300 | R$ 133 | 38% |
| 600 | R$ 234 | 67% |
| 950 | R$ 350 | 100% — a mensalidade zera |

Daí duas decisões que o preço da página precisa refletir:

1. **A reativação em massa não pode ser ilimitada.** Ou entra com um teto de
   disparos incluídos, ou é cobrada à parte. É a única rotina capaz de comer a
   mensalidade inteira, e é justamente a que a clínica vai querer usar mais.
2. **A janela gratuita vale dinheiro.** Escrever mensagem que a cliente
   responde não é só simpatia: 40% de resposta em vez de 0% derruba o custo de
   utilidade em 22%. Isso é argumento de venda e critério de redação.

> Os preços por mensagem em `TARIFAS_BR` **não foram conferidos na tabela
> oficial da Meta** — este ambiente não alcança a página. Confira antes de
> qualquer coisa virar preço de venda, e lembre que a tabela muda por país e
> por data. O valor deste módulo é o modelo, não os números. Também não estão
> aqui a taxa do provedor (BSP) nem a hospedagem, que entram por cima.

## Limites e cuidados

- Os dados vêm de fontes públicas: ficha do Maps e site da clínica. Nenhum dado de
  paciente é acessado, e o relatório diz isso ao destinatário.
- O coletor se identifica honestamente no `User-Agent`, lê no máximo 600 KB por
  site e **consulta o `robots.txt` do alvo antes de buscar**. Se o site pediu
  para não ser lido por robô, a página não é buscada e a clínica entra no
  relatório com "não pôde ser verificado", peso zero — nunca como "site fora do
  ar", que seria acusá-la de um problema que ela não tem.
- `data/` e `out/` não vão para o repositório: contêm dados de terceiros e são
  reproduzíveis a qualquer momento.

## Site

`site/` é o site da empresa: HTML e CSS a mão, sem build. Publica apontando a
pasta para qualquer host estático (no Vercel, Root Directory = `site`).

**A raiz é a página de venda do serviço para clínicas** — não uma página
institucional. Foi uma correção deliberada: a home anterior falava sobre nós no
herói e pedia ao visitante que escolhesse um caminho antes de dar qualquer
motivo para ficar. Uma home que faz escolher não vende nada.

| Página | Público | Papel |
| --- | --- | --- |
| `index.html` | dona de clínica | Vende o serviço de agenda. Gancho, garantia, preço aberto e um CTA repetido |
| `enfermeiras.html` | enfermeira entrando | As ferramentas. Destino do link da bio |
| `calculadora.html` | idem | A ferramenta que já existe |
| `especialistas.html` | enfermeira com título | Proposta de co-produção |
| `privacidade.html` | quem quiser conferir | O que fazemos com dado — o do visitante e o das clientes das clínicas |

As outras duas frentes aparecem numa faixa da home, com gancho próprio — não
como um menu de portas iguais.

### O nome

**Intervalo.** Em clínica, intervalo é o tempo certo entre procedimentos; em
operação, é o horário que ficou vazio. As duas leituras apontam para a mesma
coisa, e é o que as três frentes têm em comum — administrar o tempo entre um
atendimento e o próximo. O símbolo (`site/marca.svg`) são dois arcos e o vão
entre eles, derivado do token `radius-arco`; as alturas são diferentes de
propósito, porque simétricos viravam o ícone de pausa.

O nome aparece no `title`, no `og:site_name`, no cabeçalho e no rodapé de cada
página, mais a chave do `localStorage` da calculadora. Nada mais depende dele.

> **Ainda não verificado.** Nenhuma busca foi feita no INPI (classes 44, 42 e
> 35), no `registro.br` nem no Instagram — este ambiente não alcança esses
> serviços. Faça as três antes de imprimir qualquer coisa ou comprar domínio.
> Se "Intervalo" estiver ocupado, o segundo da fila é **Zelo**, e trocar é
> editar os mesmos cinco lugares.

### Antes de liberar a indexação

O `robots.txt` bloqueia buscadores de propósito, e continua assim até que
**quatro** coisas mudem. As três primeiras estão marcadas por comentário no
ponto exato do código:

| Marcador | O que trocar |
| --- | --- |
| `CONTATO` | `wa.me/5500000000000` e `contato@exemplo.com.br`, em `index.html`, `especialistas.html` e `privacidade.html` |
| `EMPRESA` | razão social e CNPJ no rodapé das cinco páginas |
| `DOMINIO` | `SEU-DOMINIO.com.br` no `canonical`, no `og:url`, no `og:image`, no `sitemap.xml` e na linha `Sitemap:` do `robots.txt` |
| — | as molduras de foto vazias: ou entram as imagens, ou os marcadores `F1`–`F10` saem da página |

Só depois disso troque o bloco final do `robots.txt` por `Allow: /`. O
`<meta name="robots">` das páginas já diz `index,follow` — os dois precisam
concordar, senão o site sobe invisível ou sobe quebrado.

### Fontes e compartilhamento

As fontes são servidas por `site/fontes/` e declaradas em `site/fontes.css`,
não pelo Google. Tira as requisições bloqueantes a um terceiro do caminho
crítico da primeira tela, e evita que a página de privacidade tenha que
declarar uma transferência de IP do visitante para outro domínio.

Jost é fonte variável: os arquivos de peso 400 e 500 que o Google entrega são
byte a byte idênticos, então guardamos um só e declaramos `font-weight: 400 500`.
São 76 KB no total, em quatro arquivos (latin e latin-ext de cada família).

A imagem de compartilhamento (`site/compartilhamento.png`, 1200×630) é gerada a
partir de `site/midia/og.html` com `npm run og` — que precisa de Chromium e por
isso fica fora da CI. Regere e versione o PNG quando o texto ou a paleta mudarem.

### O sistema visual

Direção **med spa / clínica dermatológica**, extraída de duas referências que o
dono do repositório forneceu. As imagens em si não puderam ser abertas daqui,
mas as páginas guardavam a cor dominante de cada uma — e é dela que a paleta
vem, não de chute:

| Referência | Dominante | Fundo |
| --- | --- | --- |
| Dermatologist & Cosmetology Clinic | `#f6f0f2` | `#efe9e7` |
| Luxury Med Spa | `#5c4a3b` | `#e1d7d3` |

Tipografia: **Marcellus** (serifada romana) nos títulos e **Jost** (geométrica)
no corpo. A forma assinatura é o **arco** nas fotos.

`tokens.css` (gerado) carrega as variáveis; `estilo.css` só as consome. **Não
escreva hex em `estilo.css`** — mexa em `tokens.json` e rode `npm run tokens`.

A auditoria faz **duas** coisas. Confere os pares que o sistema prescreve, e
varre `estilo.css` atrás de token usado como cor de texto quando a descrição do
próprio token proíbe. A segunda existe porque par prescrito não pega o que
ninguém prescreveu: cinco usos de areia sobre espresso, todos em 4,37:1,
estavam no CSS sem ninguém ver. `--ci` falha o build nos dois casos.

### Fotos e animação

O site tem dez molduras de foto vazias, cada uma com um código visível (`F1`…
`F10`) enquanto não recebe imagem — de propósito, para ninguém publicar com
buraco sem perceber. **`site/MIDIA.md` traz o prompt de cada uma**, mais a base
de estilo comum que mantém as dez parecendo do mesmo lugar, e as recomendações
de animação.

Três limites estão escritos lá e valem repetir: `F6` é foto real de vocês (uma
pessoa gerada apresentada como fundadora seria enganosa), nenhuma imagem de
paciente ou de resultado, e nenhum rosto.

O movimento do site é um só — revelação ao rolar e zoom lento nas fotos —, em
`animation-timeline` nativo, sem biblioteca, e desliga sozinho para quem pediu
menos movimento no sistema.

### Calculadora de precificação

`site/calculadora.html` — ferramenta gratuita, sem cadastro e sem back-end:
todo o cálculo roda no navegador de quem acessa, e nenhum número sai do
aparelho. Os valores digitados ficam em `localStorage` só para a pessoa não
precisar redigitar; nada é enviado.

O modelo vive em `site/precificacao.js`, um módulo ES sem DOM, importado tanto
pela página quanto pelos testes — para que a fórmula exista num lugar só:

- **custo real** = insumos + custo fixo rateado pelas sessões que de fato
  acontecem (capacidade × ocupação). É o rateio pela ocupação que faz a agenda
  vazia encarecer o atendimento de quem comparece.
- **preço mínimo** = custo real ÷ (1 − alíquota). Empata; não remunera.
- **preço ideal** = (custo real + retirada por sessão) ÷ (1 − alíquota).
- **ponto de equilíbrio** = custo fixo ÷ (preço × (1 − alíquota) − insumos).

Os invariantes que sustentam o modelo: cobrando o preço ideal a sobra do mês
iguala a retirada desejada; cobrando o preço mínimo a sobra é zero; e no ponto
de equilíbrio a margem acumulada iguala o custo fixo. Os três estão em
`test/precificacao.test.js` e a CI falha se algum quebrar — antes eram só esta
prosa, e prosa não segura refactor.

O teste cobre também o cálculo de quantos atendimentos extras fecham a conta,
que já esteve errado: dividia a retirada inteira pela margem em vez do déficit,
e anunciava "reajuste de 2% — ou 42 atendimentos a mais", números que não
falavam da mesma realidade.
