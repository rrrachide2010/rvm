# Medição

Os eventos que importam, como cada um dispara nas páginas de hoje, e como observar
desistência — **especificado, não instalado**.

> **Nenhum script de terceiro foi adicionado.** Os `data-evento` que este PR
> coloca no HTML são atributos, não código: não fazem requisição, não coletam nada
> e não mudam o comportamento da página. O que eles fazem é permitir que qualquer
> analytics seja plugado depois **sem reescrever HTML**.

---

## Os três eventos que importam

Não são todos os que dá para medir. São os que mudam decisão.

| evento | o que significa | onde |
| --- | --- | --- |
| **visita** | alguém abriu a página | as três |
| **clique no WhatsApp** | intenção declarada de conversar | `index.html` |
| **envio do formulário** | contato entregue | `enfermeiras.html` |

Para a `calculadora.html` há um quarto, e é o mais importante das três páginas:
**a pessoa chegou a um resultado**. Ela é a isca do funil de enfermeiras; visita
sem uso não vale nada.

### Por que não medir mais que isso

Rolagem, tempo na página, cliques em tudo. Cada métrica a mais é uma a ser
interpretada, e num site sem tráfego a interpretação é ruído. Comece com quatro
números. Quando eles não bastarem, você vai saber exatamente qual falta — e aí
acrescentar tem motivo.

---

## Como cada um dispara nas páginas de hoje

### Visita

Automático em qualquer analytics. Só duas coisas precisam estar certas:

**Separe as três páginas.** `/`, `/enfermeiras` e `/calculadora` têm públicos
diferentes; somar as três num número de "visitas ao site" apaga a única
informação útil.

**Preserve o parâmetro de origem.** Os links de fora já carregam `?origem=`:

| origem | de onde | definido em |
| --- | --- | --- |
| `?origem=gmn` | ficha do Google | `docs/gmn.md` |
| `?origem=ig` | link da bio | `docs/conteudo.md` |
| `?origem=relatorio` | relatório de auditoria enviado por e-mail | **a definir** — hoje o relatório não põe link |

O terceiro é uma pendência real: `src/relatorio.ts` gera o HTML que a dona da
clínica recebe, e é o canal com maior intenção de todos. Sem `?origem=relatorio`
no link, você não consegue separar quem veio do diagnóstico de quem veio do
Google — e essa é a resposta para "o relatório de auditoria funciona?".

### Clique no WhatsApp

`index.html`, seção `#contato`, agora com `data-evento="whatsapp"`.

**A limitação, dita antes que ela decepcione:** o clique sai do site e o WhatsApp
não devolve nada. Você mede a **intenção**, nunca a conversa. Quantas viraram
mensagem de verdade só o aparelho sabe.

Cruzar os dois é trabalho manual e vale a pena no começo: se dez pessoas clicam e
três mandam mensagem, o problema está na mensagem pré-preenchida do link — que
hoje é `Oi! Quero saber sobre o piloto de 30 dias.` e pode ser melhorada sem
mexer em analytics nenhum.

### Envio do formulário

`enfermeiras.html`, `data-evento="lista-espera"` no botão — que continua
`disabled`. O evento dispara no **sucesso**, não no clique: clique que resultou em
erro conta como falha, e contar erro como conversão é o jeito mais rápido de
tomar decisão errada com número certo.

Os quatro estados que o formulário precisa ter estão em `docs/operacao-site.md` §6.

### Resultado na calculadora

O evento não é clique, é estado: **a pessoa preencheu o suficiente para o painel
mostrar um número**. Marquei o `<form>` e o `<aside id="resultado">` com
`data-evento`.

Como disparar, quando houver analytics: a página já recalcula a cada digitação.
Basta emitir **uma vez por sessão**, na primeira vez que o resultado deixar de ser
vazio. Emitir a cada tecla transforma uma pessoa em cinquenta eventos.

---

## Como observar desistência

Desistência não é um evento — é a diferença entre dois. Três funis, e o que cada
queda significa:

### Funil de clínicas

```
visita em /  →  clique no WhatsApp  →  conversa iniciada (manual)
```

| queda | onde olhar |
| --- | --- |
| muita visita, pouco clique | a página não convence. Herói, garantia ou preço |
| muito clique, pouca conversa | a mensagem pré-preenchida do `wa.me`, ou o tempo de resposta (`docs/atendimento.md`) |

### Funil de enfermeiras

```
visita em /enfermeiras  →  abrir calculadora  →  chegar a um resultado
```

| queda | onde olhar |
| --- | --- |
| pouca gente abre a calculadora | o CTA do herói, ou a página está explicando demais antes de oferecer |
| abre e não chega ao resultado | **o mais grave.** São campos demais, ou algum quebrou em silêncio — é exatamente o cenário do rastreamento de erro em `docs/operacao-site.md` §3 |

### Funil do relatório

```
relatório enviado  →  visita com ?origem=relatorio  →  clique no WhatsApp
```

Este é contagem manual no primeiro passo, e é o funil que decide se a ferramenta
em `src/` se paga. Se muitos relatórios geram poucas visitas, rodar
`npm run buscar` mais vezes não resolve — só aumenta a conta da Places API.

---

## A implementação, sem instalar nada

**Você decide se aceita script de terceiro.** As duas opções abaixo funcionam com
os `data-evento` que já estão no HTML.

### Opção A — analytics de terceiro

Um `<script>` externo nas três páginas. Ganha painel pronto, funis e comparação
por período.

**O custo, dito com honestidade:** um terceiro passa a receber dados de quem
visita, e isso precisa aparecer na política de privacidade — que ainda não existe.
Alguns serviços não usam cookie e não precisam de banner; outros precisam, e
banner de cookie numa landing de três páginas custa conversão.

**Se aceitar,** o código de captura é este, e não muda conforme a ferramenta:

```html
<script>
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-evento]");
    if (!alvo) return;
    ANALYTICS(alvo.dataset.evento, { secao: alvo.dataset.secao });
  });
</script>
```

Treze linhas, um lugar só. Trocar de ferramenta é trocar `ANALYTICS`.

### Opção B — sem terceiro nenhum

O mesmo listener, mandando `navigator.sendBeacon()` para um endpoint seu. Sem
terceiro, sem cookie, sem banner — e o dado é seu.

**O custo:** exige o endpoint, que ainda não existe. Mas é o **mesmo endpoint** que
o formulário da lista de espera precisa (`docs/operacao-site.md` §6) e o mesmo que
o coletor de erro precisaria (§3). Três pendências, uma peça.

**Recomendação:** se você vai ligar o formulário de qualquer jeito, a opção B sai
quase de graça e evita a conversa sobre banner de cookie. Se o formulário for
ficar desligado por meses, a opção A entrega antes.

### O que não fazer

**Não instale analytics antes do contato real e da indexação aberta.** Medir
tráfego que não existe gera um mês de gráficos vazios e a sensação falsa de que
"não está funcionando" — quando o site nem foi lançado. Ordem em
`docs/operacao-site.md` §7.

---

## O contrato dos `data-evento`

Para quem for implementar depois, os nomes são estáveis e o formato é este:

| atributo | para quê |
| --- | --- |
| `data-evento` | o nome do evento, em kebab-case |
| `data-secao` | onde na página o elemento está |

Eventos hoje no HTML:

| `data-evento` | página | seção |
| --- | --- | --- |
| `cta-piloto` | index | heroi |
| `cta-rotinas` | index | heroi |
| `whatsapp` | index | contato |
| `email` | index | contato |
| `troca-publico` | index, enfermeiras | rodape |
| `abrir-calculadora` | enfermeiras | heroi, ferramentas |
| `cta-ferramentas` | enfermeiras | heroi |
| `lista-espera` | enfermeiras | lista |
| `calculadora-uso` | calculadora | calculadora |
| `calculadora-resultado` | calculadora | calculadora |
| `ver-resultado` | calculadora | calculadora |

**`abrir-calculadora` aparece duas vezes de propósito** — herói e seção de
ferramentas. O `data-secao` distingue, e saber qual dos dois traz mais gente diz
se o herói está fazendo o trabalho dele.

**Ao acrescentar CTA novo, acrescente o `data-evento` junto.** É a única
manutenção que este esquema pede, e esquecer não quebra nada — só cria um ponto
cego silencioso, que é pior.
