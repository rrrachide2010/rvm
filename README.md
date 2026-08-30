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
