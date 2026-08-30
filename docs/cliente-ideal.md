# Cliente ideal

Definição escrita a partir dos critérios que a **própria ferramenta** usa para
pontuar oportunidade — não de suposição sobre o mercado.

Tudo abaixo sai de `src/score.ts` e `src/places.ts`. Onde eu precisei de um
número que o código não fornece, ele está marcado `[calibrar]` e vem com o
comando para medir na sua base.

---

## 1. O índice sozinho não define o cliente ideal

O índice de oportunidade soma os pesos dos problemas encontrados. Ele responde
**"quanto há para resolver"** — e é ótimo nisso. Mas "muito a resolver" e "boa
conversa" não são a mesma coisa, e confundir os dois é o erro que faz perder mês.

Repare no que acontece nos extremos:

| índice | o que costuma haver por trás | o que isso significa comercialmente |
| --- | --- | --- |
| **0–20** | site bom, agendamento online, ficha completa | já resolveu a vitrine. Ainda pode ter no-show, mas o argumento tem que ser operação de agenda, não presença digital — como o próprio README diz |
| **35–70** | tem site que funciona, e ainda assim perde marcação | **é aqui que mora o cliente ideal.** Ver §3 |
| **acima de 78** | só chega perto disso quem não tem site, não tem telefone e não tem horário publicado | não é oportunidade grande: é informalidade. Ver §4 |

O teto de 78 não é palpite, é aritmética dos pesos: o ramo "não tem site" soma
no máximo `semSite 22 + semAgendamento 20 + semTelefone 10 + poucasAvaliacoes 11
+ semHorario 9 + notaBaixa 6 = 78`.

---

## 2. Porte: o sinal já está coletado e chama-se `totalAvaliacoes`

A ferramenta não coleta faturamento, número de salas nem de funcionários — e não
deveria, porque nada disso é público. O melhor proxy de porte disponível é o
`userRatingCount` da ficha do Maps, gravado como `totalAvaliacoes`.

Ele funciona como proxy porque avaliação é subproduto de atendimento: clínica com
200 avaliações atendeu muita gente; clínica com 3 atendeu pouca ou é nova.

| avaliações | leitura | encaixe com um serviço de R$ 1.200 + R$ 350/mês |
| --- | --- | --- |
| 0–15 | recém-aberta ou muito pequena | **não.** Não há volume de agenda para o no-show custar R$ 350/mês |
| 16–39 | pequena, em crescimento | talvez. É a faixa em que o código já diz que há problema (`AVALIACOES_MINIMAS = 40`) |
| **40–`[calibrar]`** | tem volume e já é encontrada | **sim** |
| acima de `[calibrar]` | grande, rede ou franquia | provavelmente já tem sistema ou agência; a venda vira concorrência, não descoberta |

O limite inferior de 40 **não é meu**: é `LIMITES.avaliacoesMinimas`, que já
estava no código como a fronteira do "poucas avaliações". Reaproveitei em vez de
inventar outro.

O limite superior eu não tenho como derivar do código. Meça na sua base antes de
fixar:

```bash
npm run buscar -- --cidade "SUA CIDADE"
# e olhe a distribuicao de totalAvaliacoes em data/clinicas.json
```

Se na sua cidade o percentil 90 for 120 avaliações, o teto é por volta de 120 —
não um número redondo escolhido por parecer bonito.

---

## 3. O sinal que indica conversa que rende

Não é um índice alto. É uma **combinação específica de achados**, e ela descreve
uma clínica que já investiu em aparecer e mesmo assim perde marcação:

> **`sem-site` ausente** (ela tem site)
> **e `site-fora` ausente** (o site abre)
> **e `sem-agendamento` presente** (não dá para marcar sozinho)

Por que essa combinação e não outra:

- **Ela tem site** → já gastou dinheiro com presença digital. Provou que compra
  esse tipo de coisa, e não precisa ser convencida da categoria.
- **O site abre** → alguém cuida. Existe um interlocutor.
- **Não há agendamento online** → o pedido de horário depende de alguém
  responder. É exatamente o buraco que as sete rotinas fecham, e vale 20 pontos,
  o terceiro maior peso da tabela.

Essa é a clínica em que a demonstração se explica sozinha: você mostra que a
pessoa que quis marcar às 22h não conseguiu, e o número de quantas vezes isso
aconteceu no mês é o próprio argumento.

### Dois reforços que aumentam a chance

**`poucas-avaliacoes` presente (peso 11).** Uma das sete rotinas é o pedido
automático de avaliação, e é a que dá resultado visível mais rápido. Uma clínica
que já se incomoda com o próprio número de avaliações compra a rotina inteira por
causa dessa.

**`ficha-fechada-temporariamente` presente (peso 18).** É o achado mais forte que
existe para abrir conversa, por um motivo que não é comercial: o dono quase nunca
sabe. Avisar alguém de que a ficha dele está dizendo ao mundo que ele fechou é
prestar um serviço antes de vender qualquer coisa — e quem avisa ganha a resposta.

### O que **não** indica boa conversa, apesar de somar muito

`sem-https` (14) e `nao-responsivo` (12) somam bastante mas são problemas de
**site**, e vocês não vendem site. Uma clínica cujo índice vem principalmente
daí está sendo pontuada alto por um problema que a sua oferta não resolve. É o
caso em que o índice alto engana.

---

## 4. Quem não abordar

| situação | por quê |
| --- | --- |
| `ficha-fechada-em-definitivo` | peso 0 de propósito. Não é oportunidade: é desqualificação. Confirme antes de qualquer coisa |
| `sem-site` **e** `sem-telefone` **e** `sem-horario` juntos | não é uma clínica com problema digital, é uma operação informal. O ciclo de venda é longo e o ticket não cabe |
| menos de 16 avaliações | sem volume de agenda, não há no-show que custe R$ 350/mês |
| índice abaixo de 20 | o argumento de presença digital não existe. Pode virar cliente, mas por outra porta — a conversa é sobre operação |

**Um cuidado que não é opcional:** o índice mede a presença digital, não a
qualidade do atendimento. Uma clínica com índice 60 não é uma clínica ruim, e o
relatório que ela recebe precisa deixar isso claro — o que ele já faz.

---

## 5. A definição, em uma frase

> Clínica de estética com **site que funciona e sem agendamento online**, entre
> **40 e `[calibrar]` avaliações** no Google, índice de oportunidade entre
> **35 e 70**, e de preferência com poucas avaliações ou a ficha marcada como
> fechada temporariamente.

Como achar essa clínica na sua base hoje:

```bash
npm run auditar
npm run listar          # ordena por indice, e mostra o estagio comercial
npm run estagio         # a base agrupada por estagio do funil
```

---

## 6. Registro de estágio comercial: por que ficou aqui e não num CRM

Cada clínica passou a ter um campo `estagio`, com seis valores:
`nao-contactado`, `contactado`, `respondeu`, `reuniao`, `fechado`, `perdido`.

```bash
npm run estagio                                        # a base inteira, por estagio
npm run estagio -- --de reuniao                        # so um estagio
npm run estagio -- --clinica "parte do nome" --para contactado
```

**Por que não um CRM externo, que era a outra opção:**

1. **Escala.** São dezenas a poucas centenas de clínicas por cidade, e um
   operador. CRM resolve coordenação entre pessoas; não há coordenação a fazer.
2. **Um lugar a mais onde o dado existe.** A base guarda nome, telefone e
   endereço de terceiros. Ela hoje nunca sai da sua máquina. Subir isso para um
   serviço é uma decisão sobre dado de terceiro, não sobre conveniência.
3. **Sincronização.** Com CRM, a fila de prospecção vive em dois lugares: o JSON
   (que a auditoria reescreve) e o CRM (que a pessoa atualiza). Os dois divergem
   na primeira semana.
4. **Custo de administração** de mais uma conta, mais um acesso, mais uma senha.

**Quando isso deixar de valer** — e o sinal é claro:

- mais de uma pessoa prospectando ao mesmo tempo, **ou**
- necessidade de guardar histórico de conversa por clínica, e não só o estágio.

Nesse dia, a saída é exportar a base para CSV e importar num CRM. Não há nada
aqui que prenda: são seis strings num JSON.

**Decisão de implementação que vale registrar:** o campo ficou na `Clinica` e não
no `manual` da auditoria. O estágio é propriedade da **relação** com a clínica e
existe antes de qualquer auditoria — uma clínica recém-buscada já é
"não contactado", e nesse momento não existe objeto de auditoria para hospedar o
campo. Base anterior a este campo continua carregando: ausente significa
`nao-contactado`, e nada precisa ser migrado.
