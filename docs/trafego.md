# Tráfego pago

CPA alvo calculado a partir dos seus números, teste de criativo, remarketing e
orçamento mínimo.

> **Nenhum número de mercado aqui.** Não cito benchmark de CPA, CTR nem taxa de
> conversão "do setor": todo número desses que circula é de outra operação, de
> outro tamanho, em outra época. As variáveis marcadas `[V1]`…`[V6]` são suas —
> as contas ficam feitas, esperando os valores.

---

## As variáveis

Preencha aqui. Todo o resto do documento usa estes nomes.

| | variável | valor | como descobrir |
| --- | --- | --- | --- |
| `[V1]` | Implantação | **R$ 1.200** | já está na `index.html` |
| `[V2]` | Mensalidade | **R$ 350** | já está na `index.html` |
| `[V3]` | Meses que um cliente fica | `[PREENCHER]` | sem histórico ainda. Ver abaixo |
| `[V4]` | Conversas → pilotos fechados | `[PREENCHER]` | `docs/atendimento.md` manda contar |
| `[V5]` | Cliques no WhatsApp → conversas | `[PREENCHER]` | `docs/medicao.md`, funil de clínicas |
| `[V6]` | Margem sobre a mensalidade | `[PREENCHER]` | quanto de R$ 350 sobra depois do custo de rodar |

**Sobre `[V3]`.** É a variável mais importante e a que você menos sabe — não há
cliente antigo o suficiente. Enquanto não souber, **use 6 meses** e trate como
hipótese, não como fato. Se usar 24 porque "sem fidelidade e o produto é bom", o
CPA alvo infla e você gasta o dobro do que pode.

Revise `[V3]` quando o primeiro cliente completar seis meses. Até lá, toda conta
abaixo é provisória — e está escrito assim de propósito.

---

## CPA alvo

### A conta

```
Receita por cliente (LTV) = [V1] + ([V2] × [V3])
Lucro por cliente         = [V1] + ([V2] × [V3] × [V6])
CPA teto                  = Lucro por cliente
CPA alvo                  = CPA teto ÷ 3
```

**Por que dividir por 3.** CPA igual ao lucro significa lucro zero: você trocaria
dinheiro por trabalho. A divisão reserva um terço para o anúncio, um terço para o
custo de operar e um terço para sobrar. É convenção de gestão, não lei — se sua
margem `[V6]` for muito alta, dividir por 2 se defende.

### Com os valores provisórios

Assumindo `[V3] = 6` meses e `[V6] = 0,7`:

```
LTV               = 1.200 + (350 × 6)        = R$ 3.300
Lucro por cliente = 1.200 + (350 × 6 × 0,7)  = R$ 2.670
CPA teto                                      = R$ 2.670
CPA alvo          = 2.670 ÷ 3                = R$  890
```

**Leia com a ressalva:** `[V3]` e `[V6]` são chute. Se o cliente ficar 3 meses e a
margem for 0,5, o CPA alvo cai para **R$ 575**. A conta não mudou; a hipótese sim.

### Do CPA alvo para o custo por clique

O que a plataforma cobra é clique, não cliente. Descendo o funil:

```
Custo por conversa   = CPA alvo × [V4]
Custo por clique alvo = Custo por conversa × [V5]
```

Com `[V4] = 0,25` (uma em quatro conversas fecha) e `[V5] = 0,5` (metade dos
cliques vira conversa):

```
Custo por conversa    = 890 × 0,25 = R$ 222
Custo por clique alvo = 222 × 0,5  = R$ 111
```

**R$ 111 por clique é muito acima do normal**, e isso é informação boa: quer dizer
que você tem folga. Se o clique custar R$ 5, cada cliente sai por ~R$ 40 em mídia
— vinte vezes abaixo do teto. O gargalo não vai ser o preço do clique, vai ser
`[V4]`: quantas conversas viram cliente.

É por isso que `docs/atendimento.md` manda contar as duas conversões à mão desde
a primeira. Sem elas, esta seção é álgebra sem números.

---

## Matriz de teste de criativo

Quatro criativos, um por hipótese. **Uma hipótese por criativo** — se dois mudam
ao mesmo tempo, o resultado não ensina nada.

| # | hipótese | criativo | mensagem |
| --- | --- | --- | --- |
| **A** | a dor pega mais que a solução | tela do relatório de auditoria com os achados | "Sua clínica perdeu quantos horários esse mês?" |
| **B** | a garantia é o que convence | texto sobre fundo liso, sóbrio | "O no-show cai 30% em 30 dias ou a mensalidade volta" |
| **C** | ver funcionando vence descrever | vídeo de tela: chega a confirmação no WhatsApp | sem locução, só a conversa acontecendo |
| **D** | **cru bate produzido** | vídeo de celular na mão, sem edição, uma pessoa falando | "Fiz uma ferramenta que audita a agenda de clínicas. Olha o que ela achou nessa aqui" |

### O D não é piada, e é o que eu apostaria

O criativo "feio" — celular na mão, sem corte, sem trilha — costuma superar o
produzido em nicho pequeno, e há razão para isso que vale mais que qualquer
benchmark:

1. **Não parece anúncio.** Passa como conteúdo, e o polimento é justamente o sinal
   que faz o dedo rolar.
2. **Combina com a voz do site.** A `index.html` diz "somos pequenos, e é por isso
   que damos garantia em vez de discurso". Um vídeo produzido contradiz isso.
3. **Custa quase nada de produzir**, então dá para testar cinco variações no tempo
   de fazer um bom.

Trate como hipótese legítima, com o mesmo orçamento dos outros três — não como
"o barato para completar a matriz".

### Critério de morte

Sem critério escrito antes, criativo ruim sobrevive por apego e criativo bom morre
por impaciência.

| condição | decisão |
| --- | --- |
| gastou **3× o CPA alvo** sem uma conversão | **mata.** Com CPA alvo R$ 890, é R$ 2.670 |
| CTR abaixo de **metade** da média dos quatro, após 1.000 impressões | **mata.** Não é o público, é o criativo |
| converte a CPA **acima do alvo** mas abaixo do teto | **mantém e observa.** Está pagando, só não bem |
| menos de 1.000 impressões | **não decide nada.** Cedo demais |

**A regra que segura a mão:** nenhum criativo morre antes de 1.000 impressões
**e** 72 horas. Plataforma redistribui verba nas primeiras horas e o ranking do
segundo dia com frequência inverte o do primeiro.

---

## Remarketing e público semelhante

### Remarketing

Quem visitou e não converteu. É o público mais barato que existe, e o mais fácil
de fazer errado.

| público | de onde | mensagem |
| --- | --- | --- |
| visitou `/` e não clicou no WhatsApp | pixel | a garantia, não a oferta de novo |
| abriu a calculadora e não terminou | `data-evento` (`docs/medicao.md`) | "leva dois minutos, é só o custo fixo" |
| terminou o cálculo | idem | o próximo item — o mapa do COREN |

O terceiro é o mais valioso e o menos óbvio: quem terminou o cálculo **já teve
trabalho**. Não anuncie a calculadora de novo para ela.

**Frequência: teto de 3 por semana.** Acima disso, remarketing em público pequeno
vira perseguição, e a marca paga por isso.

> **Remarketing exige pixel**, que é script de terceiro nas páginas. Precisa da sua
> aprovação e da política de privacidade publicada. Não instalei nada.

### Público semelhante

Já tratado em `docs/atendimento.md`, e o resumo que importa aqui:

| lista | pode virar semelhante? |
| --- | --- |
| clientes ativos pagantes | **sim**, com base legal e política publicada |
| lista de espera de enfermeiras | **não**, do jeito que o formulário está hoje |
| `data/clinicas.json` | **não, nunca** |

**A regra, sem rodeio:** lista só sobe para plataforma de anúncio com base legal e
com as pessoas tendo sido avisadas **antes** da coleta. Consentimento retroativo
não existe.

E há um limite prático além do legal: público semelhante precisa de algumas
dezenas de contatos para ter o que aprender. Com cinco clientes, não é uma
ferramenta ruim — é uma ferramenta que ainda não se aplica. Até lá, segmentação
por interesse e região é o que existe.

---

## Orçamento mínimo viável

### A conta

A pergunta não é "quanto posso gastar por dia", é **"em quantos dias eu sei se
funcionou"**. E a resposta depende de quantas conversões você precisa para a
média significar alguma coisa.

```
Conversões para decidir      ≈ 10
Verba para decidir           = CPA alvo × 10
Verba diária × dias de teste = Verba para decidir
```

Com CPA alvo R$ 890:

```
Verba para decidir = 890 × 10 = R$ 8.900
```

| verba diária | dias até decidir | serve? |
| --- | --- | --- |
| R$ 20 | **445 dias** | não. O mercado muda antes |
| R$ 50 | 178 dias | não |
| R$ 150 | 59 dias | limite |
| R$ 300 | 30 dias | **sim** |

### Por que verba muito baixa só gera ruído

Três razões, e nenhuma é "a plataforma te penaliza":

1. **A conclusão nunca chega.** Com R$ 20/dia você leva mais de um ano para juntar
   dez conversões. A resposta chega depois de o negócio ter mudado.
2. **A plataforma não sai do aprendizado.** Todo sistema de anúncio precisa de um
   volume mínimo de conversões para otimizar. Abaixo disso ele entrega
   semi-aleatoriamente, e o que você mede é sorte.
3. **Você conclui errado, com convicção.** Duas conversões em três semanas com um
   criativo e zero com outro parece resposta. Não é: nesse volume, a diferença
   cabe no acaso. E aí você mata o criativo certo.

**Se não houver verba para 30–60 dias de teste, não comece.** Não é conselho de
prudência: é que gastar R$ 600 em um mês a R$ 20/dia produz **zero informação** —
é pior que não gastar, porque custa dinheiro e ainda gera conclusão falsa.

**O que fazer nesse caso:** prospecção ativa, que é o que a ferramenta em `src/`
já faz, e a calculadora gerando busca orgânica (`docs/seo.md`). As duas custam
tempo em vez de verba, e as duas produzem os números `[V4]` e `[V5]` que faltam
para esta página inteira sair do provisório.

---

## A ordem

1. Contato real e indexação aberta — `docs/operacao-site.md` §7
2. Medição funcionando — `docs/medicao.md`
3. **Dez conversas por prospecção ativa**, para preencher `[V4]` e `[V5]`
4. Refazer o CPA alvo com número real, não com o chute deste documento
5. Só então tráfego pago, com verba que feche 30 dias

**O passo 3 não é etapa preparatória, é o que torna o resto honesto.** Anunciar
antes dele é comprar clique sem saber quanto vale um cliente — e a conta lá em
cima vira decoração.
