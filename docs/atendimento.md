# Atendimento

Prazo de resposta, quem responde o quê, e o que fazer com a lista de clientes.

---

## Em quanto tempo responder

Vocês vendem tempo de resposta. A `index.html` cobra da clínica que "toda marcação
depende de alguém responder" e o relatório mede `minutosParaResponder` da
concorrência. **Demorar para responder um prospecto é a contradição mais barata de
evitar e a mais cara de cometer** — o prospecto está avaliando exatamente isso.

| origem | prazo | por quê |
| --- | --- | --- |
| WhatsApp de quem recebeu o relatório de auditoria | **2 horas úteis** | ela abriu um PDF com os problemas da clínica dela e reagiu. É o auge do interesse, e ele decai em horas |
| WhatsApp geral (link da `index.html`) | **4 horas úteis** | |
| E-mail | **1 dia útil** | |
| Formulário da lista de espera | **automático na hora**, humano quando houver novidade | ver `docs/operacao-site.md` §6 |
| Comentário ou DM no Instagram | **1 dia útil** | |
| Avaliação negativa no Google | **24 horas, corridas** | ver `docs/gmn.md` |

**Fora do horário:** não responda. Horário publicado no Google (`docs/gmn.md`) e o
comportamento real precisam bater. Responder 23h uma vez cria a expectativa de
sempre, e a primeira vez que você não responder vai parecer descaso.

**A regra que vale mais que o prazo:** responder "vi, te respondo hoje até as 18h"
em dez minutos vale mais que a resposta completa em quatro horas. O que irrita não
é esperar, é não saber se foi lido.

---

## Um dono por canal

Canal com dois donos é canal sem dono: os dois assumem que o outro viu.

| canal | dono | quem cobre | acesso |
| --- | --- | --- | --- |
| WhatsApp comercial | `[PREENCHER]` | `[PREENCHER]` | número no aparelho de quem? |
| E-mail | `[PREENCHER]` | `[PREENCHER]` | caixa própria ou compartilhada? |
| Instagram (DM e comentário) | `[PREENCHER]` | `[PREENCHER]` | conta com login separado |
| Avaliações no Google | `[PREENCHER]` | `[PREENCHER]` | perfil do GMN |
| Lista de espera | `[PREENCHER]` | `[PREENCHER]` | onde o endpoint entrega |

São duas pessoas com competências diferentes — a página diz que é um desenvolvedor
e uma enfermeira em formação. Uma divisão que respeita isso:

- **Conversa com clínica** (WhatsApp, e-mail, reunião): quem entende como uma
  clínica funciona por dentro. É a pergunta que aparece na terceira mensagem.
- **Instagram de enfermeiras**: quem é enfermeira. Não dá para terceirizar voz.
- **Infra, monitor, alertas**: quem tem acesso ao host.

### Acesso controlado quer dizer três coisas

1. **Conta nominal, não senha compartilhada.** WhatsApp Business, Instagram e GMN
   têm acesso por convite. Senha em conversa não é acesso controlado — é acesso
   que ninguém consegue revogar.
2. **Saída também é procedimento.** Se alguém sair do projeto, existe uma lista do
   que remover. A lista é a tabela acima mais a de `docs/operacao-site.md` §5.
3. **O WhatsApp comercial não é o pessoal de ninguém.** Chip separado, ou
   WhatsApp Business no mesmo aparelho. Número pessoal vira ativo da empresa preso
   a uma pessoa — e no dia da separação, os clientes ficam com ela.

---

## A lista de clientes ativos

### O que ela é

Quem paga a mensalidade hoje. Um punhado de linhas, não um banco de dados — e é o
ativo mais valioso do negócio antes de existir marca.

**Onde ela vive:** `[PREENCHER]`. Uma planilha basta e é melhor que ferramenta
grande subutilizada. O que ela precisa ter, por linha: nome da clínica, contato,
quando entrou, o que paga, e a **taxa de falta na linha de base** — o número
medido antes de ligar as rotinas.

Esse último campo é o que sustenta a garantia de 30 dias. Sem ele, o piloto vira
opinião contra opinião no dia da cobrança.

### O que fazer com ela, na ordem

1. **Manter viva.** Atualizar quando alguém entra, sai ou muda de plano. Lista
   desatualizada é pior que lista nenhuma, porque você age com base nela.
2. **Ler todo mês.** Quem está há mais tempo, quem não responde há semanas, quem
   nunca abriu o relatório mensal. Cancelamento avisa antes.
3. **Pedir avaliação e indicação** — nessa ordem, e só depois de entregar
   resultado. Ver `docs/gmn.md`.
4. **Alimentar público semelhante**, e é aqui que a coisa exige cuidado.

---

## Como a lista vira público semelhante — e a condição para isso

Público semelhante é o Meta ou o Google pegarem sua lista de clientes e
procurarem gente parecida. Para um negócio local com poucos clientes, é o melhor
uso de verba que existe — porque a semelhança é calculada sobre quem **de fato
pagou**, não sobre quem você imagina.

E é onde quase todo mundo comete uma ilegalidade sem perceber.

### A regra, sem rodeio

**Você não pode subir uma lista de contatos para uma plataforma de anúncio sem
base legal e sem ter avisado as pessoas que ia fazer isso.** Não é detalhe de
compliance: é LGPD, e é o mesmo princípio que a sua `index.html` promete respeitar
quando diz que a clínica é controladora e vocês são operadores.

Três condições, e as três precisam existir **antes** do upload:

1. **Base legal.** Cliente ativo com contrato assinado tem relação contratual — a
   base mais defensável. Contato que só entrou numa lista de espera **não tem**:
   ele consentiu em receber aviso de lançamento, não em virar semente de anúncio.
2. **Aviso prévio.** A política de privacidade precisa dizer, antes da coleta, que
   os dados podem ser usados para publicidade. Avisar depois não conserta.
3. **Saída fácil.** Um jeito de pedir remoção, e ele precisa funcionar de verdade.

### Na prática, para o estado de hoje

| lista | pode virar público semelhante? |
| --- | --- |
| clientes ativos pagantes | **sim**, se o contrato mencionar e houver política publicada |
| lista de espera de `enfermeiras.html` | **não**, do jeito que o formulário está hoje |
| clínicas coletadas em `data/clinicas.json` | **não, nunca** — ver abaixo |

**Sobre a base de prospecção:** `data/clinicas.json` é dado público de empresa,
coletado da Places API para gerar diagnóstico. Subir isso como público de anúncio
é uso completamente diferente daquele para o qual foi coletado, e o próprio README
declara o propósito: *"Os dados vêm de fontes públicas... Nenhum dado de paciente é
acessado, e o relatório diz isso ao destinatário."*

Contradizer isso destrói a única coisa que faz uma clínica confiar em receber um
relatório não solicitado.

### O que fazer agora, custo zero

O formulário da lista de espera ainda não foi ligado. **É a última chance de
acertar de graça** — depois de coletar mil e-mails sem a frase certa, a lista não
serve, e recontatar todo mundo pedindo permissão é constrangedor e converte mal.

A frase precisa estar ao lado do botão, **antes** do envio, e dizer o que de fato
vai acontecer. `docs/operacao-site.md` §6 já lista isso como pré-requisito.

Enquanto não houver lista com base legal, a segmentação por interesse e região
funciona — pior, mas funciona. Ver `docs/trafego.md`.

---

## O que medir no atendimento

Três números, anotados na mão. Nenhum precisa de ferramenta.

| número | como | para quê |
| --- | --- | --- |
| **tempo até a primeira resposta** | horário que chegou, horário que respondeu | é o que você cobra dos outros |
| **relatórios enviados → conversas iniciadas** | contagem simples | mede o relatório de auditoria como isca |
| **conversas → pilotos fechados** | contagem simples | alimenta o CPA alvo em `docs/trafego.md` |

O segundo é o mais revelador e o mais ignorado: se muitos relatórios geram poucas
conversas, o problema não é o volume da prospecção — é o relatório ou a mensagem
que o acompanha. Rodar `npm run buscar` mais vezes não conserta isso, só aumenta
a conta da Places API.
