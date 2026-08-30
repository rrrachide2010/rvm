# Recomendações dos três reels → prompts de execução

Este documento faz duas coisas:

1. **Análise** — consolida as 51 recomendações dos três vídeos em 38 itens únicos,
   agrupados em seis frentes de trabalho.
2. **Prompts** — um prompt mestre e seis prompts de frente, prontos para colar em
   outras sessões. Cada um é autossuficiente: quem abre a sessão não precisa ter
   visto os vídeos nem este arquivo.

O alvo é este repositório: a ferramenta de auditoria (`src/`) e as duas landings
estáticas (`site/index.html`, `site/enfermeiras.html`).

---

## 1. Análise

### Fontes

| # | Reel | Itens |
|---|------|-------|
| A | `@eu.guilhermeguimaraes` — 21 coisas para melhorar seu tráfego | 21 |
| B | `@mxcdigital.co` — 20 coisas pra fazer com seu site no ar | 20 |
| C | `@ravaneda.ia` — 10 coisas depois de colocar o site no ar (SEO) | 10 |

### Sobreposições

Treze itens aparecem em mais de uma lista e foram fundidos:

- **Google Meu Negócio** — A8, B6, C2
- **Search Console** — B4, C1
- **Google Analytics** — A9, B11, C7
- **Erros de cobertura / correções** — B5, B10 (o mesmo ciclo: ver erro → corrigir)
- **PageSpeed / performance test** — B15, C4
- **Palavras-chave / SEO keywords** — B12, C10
- **Link na bio** — B8, B20 (o segundo é CTA do próprio vídeo, não é tarefa)
- **Prova social / opinião** — A11, B9

Dois itens da lista A são piada ou opinião de bastidor e não viram tarefa técnica:
"pessoa bonita no criativo" (A15) e "tirar seu sobrinho do WhatsApp" (A20). O
segundo tem tradução séria: **um dono de conta por canal, com acesso controlado** —
e nesse formato entra na frente E.

### As seis frentes

**Frente 1 — Infra do site no ar** (B1, B2, B3, B7, B14, B16, B17, B18, B19)
Monitor de uptime, rastreamento de erro, backup automático, credenciais seguras,
abrir no 5G (rede real, sem cache), confirmações de formulário, atualizar
dependências, manter infos de contato corretas, revisão periódica.

**Frente 2 — SEO e descoberta** (B4, B5, B10, B12, C1, C3, C5, C6, C8, C9, C10)
Search Console, erros de cobertura, meta description, `sitemap.xml`, `robots.txt`,
`llms.txt`, domínio personalizado, palavras-chave.

**Frente 3 — Google Meu Negócio** (A8, B6, C2)
Ficha completa, categorias, fotos, horário, link para a landing, e **respostas às
avaliações** — que é justamente o que a auditoria mede à mão hoje.

**Frente 4 — Conteúdo, perfil e prova social** (A3, A4, A6, A7, A11, B8, B9)
Boa página de destino, perfil de Instagram coerente, stories ativos, gravação de
conteúdo, depoimentos e casos na landing, link na bio.

**Frente 5 — Comercial e atendimento** (A5, A10, A12, A17, A20)
Atendimento rápido, cliente ideal definido por escrito, CRM, lista de clientes
ativos, um dono por canal com acesso controlado.

**Frente 6 — Tráfego pago e medição** (A1, A2, A9, A13, A14, A16, A18, A19, A21,
B11, B13, C7)
Teste de criativos (inclusive o "feio"), CPA conhecido, remarketing, público
semelhante a partir da lista de clientes, segmentação por renda, orçamento mínimo
viável, analytics, desistência (funil de saída).

### Ordem recomendada

Frentes 1 e 2 primeiro: são pré-requisito de tudo o que se mede depois. A frente 6
só faz sentido com a 1, a 2 e a 4 prontas — sem medição instalada e sem página que
converta, verba em anúncio vira dado ruim.

Frentes 3, 4 e 5 são independentes entre si e podem rodar em paralelo, em sessões
separadas.

---

## 2. Prompt mestre

> Cole isto quando quiser que uma sessão coordene o conjunto e abra as demais.

```text
Contexto: repositório rrrachide2010/rvm — ferramenta de prospecção de clínicas de
estética em Node 22 + TypeScript sem build (`src/`), mais duas landings estáticas
sem framework (`site/index.html`, `site/enfermeiras.html`, `site/estilo.css`).
Leia o README.md antes de qualquer coisa; ele descreve a arquitetura e os limites.

Objetivo: executar o plano de `docs/prompt-execucao-recomendacoes.md`, que consolida
38 recomendações de marketing e infraestrutura em seis frentes.

Sua tarefa nesta sessão:
1. Ler `docs/prompt-execucao-recomendacoes.md` inteiro.
2. Verificar, item a item, o que já está feito no repositório — não presuma que
   nada existe nem que tudo existe. Registre o estado atual.
3. Executar as frentes 1 e 2 (infra e SEO), que são pré-requisito das demais.
4. Para as frentes 3 a 6, produzir `docs/plano-<frente>.md` com o que exige acesso
   externo (contas Google, Meta, domínio) e portanto não pode ser feito por código,
   descrevendo o passo a passo que o dono precisa seguir.

Regras:
- Nada de dependência nova sem justificar no PR. O projeto é deliberadamente sem
  build e sem framework; mantenha assim.
- Nenhuma chave, token ou credencial no repositório. Só `.env.example` com nomes.
- Nenhum script de terceiros nas landings sem o dono aprovar antes: cada tag
  externa é um custo de carregamento e um passivo de privacidade.
- `npm run check` tem que passar ao final.
- Trabalhe em uma branch por frente e abra um PR em rascunho por frente.
```

---

## 3. Prompts por frente

### Frente 1 — Infra do site no ar

```text
Contexto: repositório rrrachide2010/rvm. `site/` tem duas landings estáticas
(`index.html`, `enfermeiras.html`, `estilo.css`), servidas sem build — a publicação
é apontar um host estático para a pasta. Leia o README.md antes de começar.

Tarefa: deixar o site pronto para viver no ar. Entregue:

1. `docs/operacao-site.md` — runbook curto cobrindo:
   - monitor de uptime (qual serviço, o que checar, para onde alerta);
   - rastreamento de erro no cliente (o que capturar e por que; sem instalar nada
     ainda, avaliar se vale o peso);
   - backup: o site é o repositório, então descreva o que de fato precisa de
     backup (nada além do git? o `data/clinicas.json`, que está no .gitignore?);
   - política de credenciais: quem tem acesso ao host, ao domínio e ao repositório.
2. Varredura do HTML das duas landings procurando:
   - links quebrados ou apontando para `#` sem destino;
   - os marcadores `<!-- MARCA -->`, `<!-- CONTATO -->`, `<!-- FORMULARIO -->`
     descritos no README, listando exatamente o que falta preencher;
   - informações de contato desatualizadas ou inconsistentes entre as páginas.
   Corrija o que for objetivamente errado; liste o que depende de decisão do dono.
3. Confirmação de formulário: o formulário da lista de espera está desabilitado de
   propósito. Especifique em `docs/operacao-site.md` o comportamento esperado
   quando for ligado (mensagem de sucesso, mensagem de erro, o que acontece se o
   endpoint cair) — sem ligá-lo.
4. Checklist de revisão periódica com periodicidade explícita para cada item.

Restrições: sem dependência nova, sem script de terceiros adicionado às páginas
sem aprovação explícita, nenhuma credencial no repositório. `npm run check` deve
passar. Branch própria, PR em rascunho.
```

### Frente 2 — SEO e descoberta

```text
Contexto: repositório rrrachide2010/rvm, pasta `site/` com duas landings estáticas
sem build. Leia o README.md antes de começar.

Tarefa: tornar as duas landings encontráveis. Entregue:

1. `site/robots.txt` — permitindo indexação e apontando o sitemap.
2. `site/sitemap.xml` — com as duas páginas.
3. `site/llms.txt` — descrevendo em texto o que o negócio faz e para quem, no
   formato llms.txt.
4. Em cada página: `<title>` e `<meta name="description">` escritos para a busca
   (título com a proposta e a cidade/nicho; descrição de 140–160 caracteres que
   diga o benefício, não a categoria), `<link rel="canonical">`, `lang="pt-BR"`,
   e Open Graph mínimo (og:title, og:description, og:url, og:type).
5. Dados estruturados JSON-LD: `LocalBusiness` ou `ProfessionalService` na
   `index.html`, com os campos que já são verdade — não invente endereço,
   telefone, nota ou número de avaliações.
6. `docs/seo.md` — palavras-chave alvo de cada página (a intenção de busca de cada
   uma é diferente: `index.html` é dono de clínica procurando resolver agenda,
   `enfermeiras.html` é enfermeira procurando ferramenta), mais o passo a passo
   para conectar Search Console e verificar erros de cobertura, e o que fazer
   quando aparecer erro.

Deixe as URLs canônicas parametrizadas por um domínio placeholder claramente
marcado, já que o domínio personalizado ainda não está definido — e diga no
`docs/seo.md` quais arquivos precisam ser trocados quando ele existir.

Restrições: sem dependência nova, sem alterar o visual das páginas, nenhum dado
inventado no JSON-LD. `npm run check` deve passar. Branch própria, PR em rascunho.
```

### Frente 3 — Google Meu Negócio

```text
Contexto: repositório rrrachide2010/rvm. A ferramenta em `src/` audita a presença
digital de clínicas de estética; `src/score.ts` transforma sinais em achados
pontuados, e o README explica que "avaliações sem resposta do proprietário" é
medido à mão porque a API não expõe as respostas do dono.

Tarefa, em duas partes:

1. `docs/gmn.md` — passo a passo para deixar a ficha do Google Meu Negócio do
   próprio negócio completa: categorias, área de atendimento, horário, fotos,
   link para a landing, e a rotina de responder avaliações (com que frequência,
   e o que responder numa avaliação ruim).
2. No código: leia `src/places.ts` e `src/score.ts` e verifique se os sinais de
   ficha do Maps que já são coletados estão todos sendo pontuados. Se houver sinal
   coletado e não usado, ou peso que não corresponde ao que o README descreve,
   corrija — mantendo todos os pesos no lugar único que o README aponta.

Não invente campos da Places API: confira o que `src/places.ts` de fato pede antes
de propor qualquer sinal novo, e se propuser um, mostre o campo exato da API.

Restrições: sem dependência nova. `npm run check` deve passar. Branch própria, PR
em rascunho.
```

### Frente 4 — Conteúdo, perfil e prova social

```text
Contexto: repositório rrrachide2010/rvm, landings em `site/index.html` (funil B2B
para clínicas, destino de quem recebeu o relatório de auditoria por e-mail) e
`site/enfermeiras.html` (lista de espera, destino do link da bio do Instagram).
Leia o README.md e as duas páginas antes de escrever qualquer coisa.

Tarefa:

1. Revisar o texto das duas landings com o critério de conversão: a promessa
   aparece acima da dobra? A objeção principal é respondida? Há um CTA único e
   claro por página? Proponha as mudanças como diff, mantendo a voz atual — o
   texto existente é sóbrio e direto, não o transforme em copy de infoproduto.
2. Criar a seção de prova social na `index.html`: estrutura HTML e CSS prontos,
   com conteúdo marcado como `<!-- DEPOIMENTO -->` para ser preenchido depois.
   Não escreva depoimentos fictícios — nem como exemplo dentro do HTML final.
3. `docs/conteudo.md` — pauta de conteúdo para Instagram derivada do que a
   ferramenta descobre na prática (os achados de `src/score.ts` são temas prontos:
   cada problema que a auditoria detecta é um post), mais o que o perfil precisa
   ter para sustentar tráfego pago: bio, destaques, o que vai no link da bio.

Restrições: nenhum depoimento, número ou resultado inventado em qualquer arquivo
que vá ao ar. Sem dependência nova, sem framework. `npm run check` deve passar.
Branch própria, PR em rascunho.
```

### Frente 5 — Comercial e atendimento

```text
Contexto: repositório rrrachide2010/rvm — ferramenta de prospecção de clínicas de
estética. `data/clinicas.json` guarda a base (fora do repositório, no .gitignore),
`src/store.ts` faz a persistência, `src/cli.ts` tem os subcomandos. Leia o
README.md antes de começar.

Tarefa: fechar o ciclo entre prospecção e atendimento.

1. `docs/cliente-ideal.md` — definição escrita do cliente ideal, derivada dos
   critérios que a própria ferramenta já usa para pontuar oportunidade
   (`src/score.ts`), não de suposição: qual índice, qual porte, qual sinal indica
   que a conversa vai render.
2. Avaliar se o registro de estágio comercial cabe na base atual: hoje cada ficha
   tem um campo `manual`. Proponha (e implemente, se couber sem inchar o modelo)
   um campo de estágio — não contactado / contactado / respondeu / reunião /
   fechado / perdido — com um subcomando que liste a base por estágio. Se achar
   que não cabe e que a ferramenta certa é um CRM externo, diga isso com o motivo,
   e entregue em vez disso o formato de exportação CSV para importar em um CRM.
3. `docs/atendimento.md` — o padrão de resposta: em quanto tempo responder, quem
   responde (um dono por canal, com acesso controlado), o que fazer com a lista de
   clientes ativos, e como ela alimenta público semelhante depois.

Se implementar mudança de dados, garanta compatibilidade com bases já existentes:
uma ficha sem o campo novo tem que continuar carregando.

Restrições: sem dependência nova. `npm run check` deve passar. Branch própria, PR
em rascunho.
```

### Frente 6 — Tráfego pago e medição

```text
Contexto: repositório rrrachide2010/rvm, landings estáticas em `site/`. Leia o
README.md antes de começar. Pré-requisito: as frentes 1, 2 e 4 do
`docs/prompt-execucao-recomendacoes.md` — verifique o estado delas antes de propor
gastar verba.

Tarefa:

1. `docs/medicao.md` — o plano de medição antes do primeiro real gasto: quais
   eventos importam (visita, clique no WhatsApp, envio de formulário), como cada
   um é disparado nas páginas atuais, e como a desistência (saída sem ação) é
   observada. Especifique a implementação sem instalar nada ainda: o dono decide
   se aceita o script de terceiros e o custo de privacidade que ele traz.
2. Instrumentar as landings com os atributos de dados necessários (`data-evento`
   nos CTAs, por exemplo) para que qualquer ferramenta de analytics escolhida
   depois seja plugada sem reescrever HTML. Isso não adiciona nenhum script
   externo — só marca os pontos.
3. `docs/trafego.md` — o plano de anúncios:
   - CPA alvo, calculado a partir do ticket e da taxa de fechamento; deixe as
     variáveis explícitas para o dono preencher, e mostre a conta;
   - matriz de teste de criativos, incluindo a variante "feia"/crua como hipótese
     legítima e o critério de quando matar um criativo;
   - remarketing e público semelhante a partir da lista de clientes ativos, com
     a nota de que lista de clientes só é enviada com base legal e consentimento;
   - orçamento mínimo viável, com a conta de quantos dias são necessários para
     um resultado significativo no CPA alvo — e por que verba muito baixa não
     produz aprendizado, só ruído.

Não prometa resultado nem cite benchmark de mercado sem fonte. Se não souber um
número, deixe a variável marcada para o dono preencher.

Restrições: nenhum script de terceiros adicionado às páginas nesta frente. Sem
dependência nova. `npm run check` deve passar. Branch própria, PR em rascunho.
```

---

## 4. Como usar

Uma frente por sessão. Cole o bloco correspondente como primeira mensagem — ele já
carrega o contexto do repositório, o escopo, os entregáveis e as restrições.

As frentes 1 e 2 são as únicas com ordem obrigatória entre si e em relação à 6. As
frentes 3, 4 e 5 podem rodar ao mesmo tempo, em sessões paralelas, porque tocam
arquivos diferentes.

Três restrições valem em todas e estão repetidas de propósito em cada bloco: sem
dependência nova, sem credencial no repositório, sem dado inventado em página que
vá ao ar.
