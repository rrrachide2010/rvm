# Cliente ideal

Quem vale a conversa, definido a partir dos critérios que a própria ferramenta já
usa para pontuar — não de suposição sobre mercado.

Tudo aqui sai de `src/score.ts`. Se os pesos mudarem, este documento muda junto.

---

## O que o índice realmente diz

O índice é a soma dos pesos dos achados, limitada a 100. Quanto maior, mais há
para consertar. Mas **um número alto pode significar duas coisas opostas**, e é aí
que a fila engana.

Somando os pesos da tabela `PESO`, os tetos são estes:

| situação da clínica | teto do índice | por quê |
| --- | --- | --- |
| não tem site | **58** | só pontuam `sem-site` (22) e os quatro achados da ficha |
| tem site, mas fora do ar | **60** | `site-fora` (24) mais a ficha |
| tem site no ar, ruim em tudo | **100** | seis achados de site somam 67, mais a ficha |

Daí sai o fato que organiza esta página inteira:

> **Índice acima de 60 só é possível se a clínica tem site funcionando.**

Não é opinião, é aritmética dos pesos. E muda completamente a leitura da fila:
os dois extremos que parecem iguais no `out/index.html` são clientes diferentes.

---

## As três faixas

### Índice 61–100 — o alvo

Necessariamente tem site no ar. Isso significa que **já decidiu investir em
presença digital, já pagou por isso, e o que está lá não funciona.**

Três coisas seguem disso, e as três importam para vender:

1. **Tem verba.** Alguém pagou por aquele site. Orçamento de R$ 1.200 + R$ 350 não
   é conversa nova, é realocação.
2. **Já aceitou a premissa.** Você não vai precisar convencer de que presença
   digital importa — ela já concordou quando contratou o site.
3. **A dor é concreta.** Site no ar sem agendamento online (`sem-agendamento`,
   peso 20) é exatamente a promessa da `index.html`: o pedido de horário se perde
   fora do expediente.

**É aqui que a conversa rende.** A fila do `out/index.html` já ordena por índice,
então essa faixa está no topo — o que estava certo, mas por motivo diferente do
que parecia.

### Índice 30–60 — depende de um sinal

Zona ambígua. Pode ser clínica **sem site nenhum** (teto 58) ou clínica com site
razoável e ficha ruim. São conversas opostas.

**O que separa:** a presença do achado `sem-site`.

| tem `sem-site`? | o que é | vale a conversa? |
| --- | --- | --- |
| sim | nunca investiu em digital | **cautela** — ver abaixo |
| não | site ok, ficha do Maps abandonada | **sim**, e é conversa fácil: o conserto é rápido e visível |

A clínica **sem site nenhum** é a armadilha desta faixa. Índice 50 parece bom, mas
a venda é outra: antes de agenda automática ela precisa de vitrine, que você não
vende. E a ausência de site com frequência indica operação informal — o que
costuma vir junto com "não tenho isso no orçamento".

Não descarte, mas não comece por ela.

### Índice 0–29 — não insista

Já resolveu a vitrine. O argumento de presença digital não existe, e o README já
diz isso: *"o argumento com ela precisa ser a operação da agenda, não a presença
digital."*

Conversa possível, mas é venda consultiva e longa, sem o gancho do diagnóstico
pronto. Com fila cheia na faixa de cima, o custo de oportunidade não fecha.

**Exceção:** índice 0 com o achado `fechada-definitiva` não é clínica boa, é
clínica **encerrada**. O Google marca a ficha como fechada em definitivo e a
ferramenta zera o índice de propósito (ver `docs/gmn.md`). Não é prospecto.

---

## O sinal que mais indica conversa que rende

Se der para olhar um achado só antes de escrever, olhe este:

### `sem-agendamento` (peso 20)

É o único achado que corresponde **exatamente** ao que você vende. Os outros —
HTTPS, responsividade, avaliações — são sintomas que qualificam. Este é a dor do
produto.

Clínica com site no ar **e** `sem-agendamento` é a definição operacional de
cliente ideal, e dá para filtrar mentalmente na fila: índice alto sem esse achado
é uma clínica com muitos problemas periféricos e o problema central resolvido.

### Os dois qualificadores de porte

A ferramenta não coleta porte, faturamento nem número de funcionários — e não
adianta inventar. O que existe é a ficha do Maps, e dela saem dois proxies:

**`totalAvaliacoes`** — o melhor indicador de movimento disponível.

| avaliações | leitura | o que fazer |
| --- | --- | --- |
| **abaixo de 10** | clínica nova, informal, ou ficha abandonada | cautela: pode não ter fluxo para justificar a mensalidade |
| **40 a 200** | clínica estabelecida, com fluxo | **a faixa que interessa** |
| **acima de 200** | operação grande | pode já ter sistema e equipe própria; a venda muda |

O corte de 40 não é escolha minha: é a constante `AVALIACOES_MINIMAS` que a
ferramenta já usa para gerar `poucas-avaliacoes`.

**`nota`** — qualifica de forma indireta. Nota **alta** com poucas avaliações é o
melhor cenário: atende bem e ninguém está pedindo avaliação. É uma das sete
rotinas que você vende, e a conversa começa com um elogio verdadeiro.

Nota abaixo de 4,0 muda a natureza do problema: pode ser atendimento, não agenda.
Automação não conserta isso, e prometer que conserta é o caminho para o
cancelamento no segundo mês.

---

## O recorte, em uma frase

> Clínica de estética com **site no ar mas sem agendamento online**, **40 a 200
> avaliações** no Google, **nota 4,0 ou mais**, e índice de oportunidade **acima de
> 60**.

Traduzindo para o que você faz na fila do `out/index.html`: começa de cima, pula
quem tem `sem-site`, pula quem tem menos de 10 avaliações, e escreve primeiro para
quem tem `sem-agendamento`.

## O que ainda não dá para saber

Honestidade sobre os limites, para não fingir precisão que não existe:

- **Se tem recepcionista.** Muda tudo na conversa e não está em lugar nenhum dos
  dados.
- **Se já usa algum sistema de gestão.** A ferramenta detecta provedor de
  agendamento no site (`provedorAgendamento` em `src/site.ts`), mas só quando ele
  aparece no HTML. Sistema interno que não expõe link não é detectado.
- **Quanto cobra por procedimento.** Determina se R$ 350/mês é barato ou caro
  para ela, e é invisível para a ferramenta.

Os três se descobrem na conversa. Nenhum deve virar campo inventado na base.

## Quando este documento vence

Ele deriva dos pesos. Se você mexer na tabela `PESO` em `src/score.ts`, os tetos
de 58, 60 e 100 mudam e as faixas deste documento saem do lugar. O cálculo está
em uma linha:

```
teto sem site = PESO.semSite + poucasAvaliacoes + semTelefone + semHorario + notaBaixa
```

E o momento de revisar não é o calendário: é depois das primeiras dez conversas.
Se as que fecharam não estiverem na faixa de cima, o errado é este documento —
ou os pesos.
