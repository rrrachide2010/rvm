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
src/score.ts       transforma sinais em achados e pontuação  ← ajuste os pesos aqui
src/relatorio.ts   HTML do relatório e do índice
src/store.ts       persistência em data/clinicas.json
src/tipos.ts       tipos compartilhados
```

`npm run check` roda o typecheck.

## Limites e cuidados

- Os dados vêm de fontes públicas: ficha do Maps e site da clínica. Nenhum dado de
  paciente é acessado, e o relatório diz isso ao destinatário.
- O coletor se identifica honestamente no `User-Agent` e lê no máximo 600 KB por site.
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

As outras duas frentes aparecem numa faixa da home, com gancho próprio — não
como um menu de portas iguais.

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
escreva hex em `estilo.css`** — mexa em `tokens.json` e rode `npm run tokens`,
que também audita o contraste de cada par prescrito.

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

O modelo está inteiro no `<script>` da própria página:

- **custo real** = insumos + custo fixo rateado pelas sessões que de fato
  acontecem (capacidade × ocupação). É o rateio pela ocupação que faz a agenda
  vazia encarecer o atendimento de quem comparece.
- **preço mínimo** = custo real ÷ (1 − alíquota). Empata; não remunera.
- **preço ideal** = (custo real + retirada por sessão) ÷ (1 − alíquota).
- **ponto de equilíbrio** = custo fixo ÷ (preço × (1 − alíquota) − insumos).

Os invariantes que sustentam o modelo: cobrando o preço ideal a sobra do mês
iguala a retirada desejada; cobrando o preço mínimo a sobra é zero; e no ponto
de equilíbrio a margem acumulada iguala o custo fixo. Se alterar as fórmulas,
confira os três antes de publicar.
