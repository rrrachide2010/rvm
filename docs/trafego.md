# Tráfego pago

CPA alvo calculado a partir do ticket, matriz de teste de criativo, remarketing e
orçamento mínimo viável.

> **Nenhum resultado é prometido aqui, e nenhum benchmark de mercado é citado.**
> Número que eu não sei está marcado `[VARIÁVEL]` — preencha e a conta fecha
> sozinha. As contas estão todas à vista, para você conferir cada uma.
>
> **Pré-requisito:** nada disto funciona antes de
> [medicao.md](./medicao.md) e do contato real no site. Anúncio para uma página
> com WhatsApp de placeholder queima verba comprando cliques que não viram nada.

---

## 1. CPA alvo

### As variáveis

Duas você já sabe — estão publicadas em `/clinicas`. As outras quatro só a sua
operação responde.

| símbolo | o que é | valor |
| --- | --- | --- |
| `T_impl` | implantação, uma vez | **R$ 1.200** *(publicado)* |
| `T_mens` | mensalidade | **R$ 350** *(publicado)* |
| `M` | meses que um cliente fica, em média | `[VARIÁVEL — medir]` |
| `MG` | margem sobre a receita, depois de custo de operação e imposto | `[VARIÁVEL — medir]` |
| `L→R` | dos que falam com vocês, quantos viram reunião | `[VARIÁVEL — medir]` |
| `R→F` | das reuniões, quantas viram cliente | `[VARIÁVEL — medir]` |
| `%aq` | fatia da margem que você aceita gastar para adquirir | `[VARIÁVEL — decidir]` |

**Onde medir cada uma:**

- `M` — só existe depois do primeiro cliente completar alguns ciclos. **Até lá,
  assuma `M = 1`** (só o piloto). É a hipótese pessimista, e é a única honesta
  antes de existir retenção observada. Ela também protege: se você calcular o CPA
  com `M = 12` e a retenção real for 2, você gastou seis vezes mais do que podia.
- `MG` — o que sobra depois de infraestrutura, WhatsApp e o tempo de vocês.
- `L→R` e `R→F` — saem do campo de estágio: `npm run estagio` conta quantos
  estão em `contactado`, `respondeu`, `reuniao` e `fechado`.
- `%aq` — decisão sua. Quem está começando e precisa de caixa costuma ficar
  abaixo de 1/3; quem tem fôlego vai mais alto.

### A conta

```
Receita por cliente        = T_impl + (T_mens × M)
Margem por cliente         = Receita por cliente × MG
CPA máximo por CLIENTE     = Margem por cliente × %aq
CPA máximo por LEAD        = CPA máximo por cliente × (L→R) × (R→F)
```

A última linha é a que dói e é a que quase ninguém faz: você não paga por
cliente, paga por **lead**. Se de cada 10 conversas 3 viram reunião e de cada 3
reuniões 1 fecha, cada lead vale 1/10 do cliente.

### O mesmo cálculo, com números para você conferir a fórmula

⚠️ **Os valores de `M`, `MG`, `L→R`, `R→F` e `%aq` abaixo são inventados por mim
para demonstrar a aritmética.** Não são estimativa, não são benchmark e não são
previsão. Substitua todos antes de usar.

```
M     = 1         (só o piloto — a hipótese pessimista)
MG    = 0,70
L→R   = 0,30
R→F   = 0,33
%aq   = 0,33

Receita por cliente     = 1200 + (350 × 1)      = R$ 1.550
Margem por cliente      = 1550 × 0,70           = R$ 1.085
CPA máximo por cliente  = 1085 × 0,33           = R$ 358
CPA máximo por lead     = 358 × 0,30 × 0,33     = R$ 35
```

Leitura: **R$ 35 por conversa iniciada** é o teto, sob essas premissas. Acima
disso, a campanha consome mais do que a margem do cliente que ela traz.

Repare no efeito de `M`. Com `M = 6` em vez de 1:

```
Receita = 1200 + 2100 = R$ 3.300  →  CPA por lead ≈ R$ 76
```

**A retenção mais que dobra o que você pode pagar por lead.** É por isso que a
conversa do dia 25 de cada ciclo, no [atendimento.md §4](./atendimento.md#4-a-lista-de-clientes-ativos),
vale mais que qualquer otimização de anúncio.

---

## 2. Matriz de teste de criativo

Teste **uma variável por vez**. Trocar imagem e texto juntos e ver o resultado
melhorar não ensina qual dos dois funcionou — e você não consegue repetir.

### As hipóteses

| # | hipótese | criativo | público |
| --- | --- | --- | --- |
| A | **O número desconhecido incomoda** | "Quantos horários sua clínica perdeu este mês?" | dona de clínica |
| B | **A garantia carrega sozinha** | a garantia escrita, sem rodeio | dona de clínica |
| C | **A demonstração vende** | tela do relatório de auditoria sendo gerado | dona de clínica |
| D | **O cru ganha do produzido** | vídeo de celular, sem edição, uma pessoa falando | dona de clínica |
| E | **A dor de preço é mais forte** | "Você sabe se aquele pacote dá lucro?" → calculadora | enfermeira |
| F | **A ferramenta gratuita puxa** | tela da calculadora com resultado | enfermeira |

### Sobre a variante D, a "feia"

**Ela é hipótese legítima e entra na matriz de saída, não como piada.** Duas
razões que não dependem de benchmark nenhum:

1. **Ela se parece com o resto do feed.** O feed de quem você quer atingir é
   feito de vídeo de celular. Anúncio produzido demais é reconhecido como anúncio
   antes de ser lido.
2. **Ela é barata de produzir e barata de matar.** Testar seis criativos
   produzidos custa semanas; testar seis crus custa uma tarde. Num orçamento
   pequeno, a velocidade de descarte importa mais que o acabamento.

E há uma razão específica de vocês: a landing diz que são duas pessoas, um
desenvolvedor e uma enfermeira em formação. **Um anúncio com cara de agência
contradiz a página de destino.** A continuidade entre anúncio e destino é o que
mantém a pessoa depois do clique.

**O que não vale como "cru":** áudio ruim. Imagem tremida a pessoa perdoa; som
ruim ela pula. É a única parte que não dá para economizar.

### Quando matar um criativo

Critério escrito antes de começar, para não virar discussão depois:

**Mate quando:**

- Gastou **3× o CPA alvo por lead** sem **uma** conversão. Com o exemplo acima
  (R$ 35), isso é R$ 105. A lógica: se o criativo convertesse na taxa alvo, já
  teria convertido uma vez. Não é prova, mas é o ponto em que continuar custa
  mais que recomeçar.
- Ou: **frequência acima de 3** com o resultado caindo. A mesma pessoa viu três
  vezes e não agiu; a quarta não vai mudar isso — só gasta.
- Ou: CTR **abaixo de metade** da mediana dos seus outros criativos, depois de
  1.000 impressões. Note: **da sua própria conta**, não de benchmark de mercado.
  O critério é relativo de propósito, porque não tenho fonte para um absoluto.

**Não mate quando:**

- Gastou menos que 1× o CPA alvo. Você não tem informação nenhuma ainda.
- O resultado caiu num único dia. Variação diária não é tendência.

**Deixe rodar quando:** o CPA está abaixo do alvo. Não "otimize" o que está
funcionando — cada edição reinicia o aprendizado da plataforma.

---

## 3. Remarketing e público semelhante

### Remarketing: quem já visitou

O mais barato e o menos problemático. **Não exige subir lista de cliente
nenhuma** — o público se forma a partir de quem passou pelo site.

| público | mensagem que faz sentido |
| --- | --- |
| visitou `/clinicas` e não clicou no WhatsApp | a objeção que ele não viu respondida: a garantia |
| visitou `/calculadora` e não voltou | o próximo passo que a página não oferece hoje (§1 de [medicao.md](./medicao.md)) |
| visitou `/especialistas` | a divisão de receita, que é o que ele foi ver |

**Pré-requisito:** o pixel da plataforma no site — um script de terceiro, que
depende da sua aprovação, e um aviso de cookie.

### Público semelhante: a partir da lista de clientes

**Só com base legal e consentimento.** A regra completa está em
[atendimento.md §5](./atendimento.md#5-público-semelhante-só-com-base-legal-e-consentimento).
O resumo do que não se negocia:

- Enviar contato de cliente a uma plataforma de publicidade **não** é coberto
  pela execução do contrato de vocês com ele. A base aplicável é o
  **consentimento específico**, coletado em item separado e guardado de forma que
  dê para provar depois.
- **Nunca a partir da base de prospecção.** Ela é dado público de clínicas que
  jamais falaram com vocês.
- Revogação tem que remover a pessoa da lista **na plataforma**, não só no seu
  arquivo.

**E a nota prática que resolve o assunto por ora:** as plataformas exigem
algumas centenas de contatos para gerar um público semelhante utilizável. Com
uma lista pequena, o upload não produz público — produz só o risco. Público
semelhante a partir de **visitantes do site** dá menos precisão e não toca em
dado de cliente nenhum.

---

## 4. Orçamento mínimo viável

### Por que verba muito baixa só gera ruído

Não é opinião, é a aritmética do erro de contagem.

A incerteza relativa de uma contagem de `N` conversões é da ordem de `1/√N`:

| conversões | erro relativo aproximado | o que você consegue afirmar |
| --- | --- | --- |
| 1 | ~100% | nada |
| 4 | ~50% | nada |
| 10 | ~32% | "talvez esteja funcionando" |
| **30** | **~18%** | dá para comparar dois criativos |
| 100 | ~10% | dá para otimizar |

Com 4 conversões, um CPA medido de R$ 30 é compatível com R$ 15 e com R$ 45.
Decidir entre dois criativos com essa margem é jogar moeda com passo extra.

**Some a isso o mínimo da plataforma:** os sistemas de anúncio precisam de um
volume de conversões por semana para sair da fase de aprendizado. Abaixo disso, a
entrega é errática e o CPA observado varia por motivo que não é o seu criativo. O
número exato varia por plataforma e muda — **confira no painel da que você usar**;
não vou citar de cabeça.

### A conta do orçamento

```
Orçamento mínimo para uma leitura confiável = 30 × CPA alvo por lead
Dias necessários                            = esse total ÷ orçamento diário
```

Com o **exemplo ilustrativo** do §1 (CPA alvo R$ 35 — valor de demonstração, não
estimativa):

```
Total para 30 conversões = 30 × 35 = R$ 1.050

  a R$ 30/dia  →  35 dias
  a R$ 50/dia  →  21 dias
  a R$ 100/dia →  11 dias
```

**A leitura correta desta tabela não é "gaste R$ 100 por dia".** É:

> O orçamento não decide **se** você aprende. Decide **quando**.

O que decide *se* você aprende é chegar a ~30 conversões antes de desistir. R$ 30
por dia funciona — desde que você aceite esperar 35 dias e não mexa no criativo
no dia 10 porque "não está dando resultado". Mexer reinicia a contagem, e é assim
que orçamento pequeno vira ruído: não pelo valor, mas pela impaciência que o
valor pequeno provoca.

### Um piso que não é sobre estatística

Se o orçamento diário for menor que o CPA alvo por lead, você compra **menos de
uma conversão por dia**. A campanha passa a maior parte do tempo sem conversão
nenhuma, a plataforma não tem sinal para otimizar, e você não tem número para
ler. Com o exemplo: **abaixo de R$ 35/dia**, a campanha é uma aposta, não um
teste.

### A ordem que eu recomendaria

1. **Zero verba.** Logs do host + contagem manual do WhatsApp por texto de
   origem ([medicao.md §5](./medicao.md#5-o-mínimo-para-começar-sem-instalar-nada)).
   Isso responde se a página converte visita em conversa — e se não converter,
   nenhum anúncio resolve.
2. **Preencher as `[VARIÁVEL]` do §1** com os primeiros clientes reais.
3. **Só então**, um criativo, um público, orçamento que dê 30 conversões num
   prazo que você aguente esperar.
4. Testar a variante crua contra a produzida, uma variável por vez.

**O que nunca fazer:** anunciar antes do contato real estar no site. Cada clique
comprado que cai num `wa.me/5500000000000` é dinheiro que não volta.
