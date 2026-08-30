# Google Meu Negócio

A ficha do próprio Retorno no Google, e o que fazer com ela depois de criada.

> **Uma ironia que vale dizer em voz alta.** A ferramenta em `src/` audita a ficha
> do Maps de clínicas e cobra por isso. Ficha própria incompleta é o pior cartão de
> visitas possível para quem vende exatamente esse conserto — e é a primeira coisa
> que um prospecto desconfiado vai olhar.

---

## Antes de tudo: você é negócio com área de atendimento

O Retorno não tem loja, não recebe cliente e o serviço roda remoto. No Google isso
tem nome: **negócio com área de atendimento** (*service area business*). A
diferença é grande e escolher errado é retrabalho:

| | negócio com endereço | **negócio com área de atendimento** |
| --- | --- | --- |
| endereço aparece na ficha | sim | **não** |
| precisa de endereço para verificar | sim | **sim, mesmo assim** |
| aparece no mapa | no ponto | na região declarada |
| serve para o Retorno | não | **sim** |

**O endereço de verificação continua obrigatório** — o Google precisa de um lugar
para confirmar que você existe. Ele fica oculto na ficha pública. Endereço
residencial funciona; é o caso mais comum de negócio de duas pessoas.

Se você não quer o endereço residencial nem oculto no cadastro do Google, a
alternativa honesta é **não criar a ficha agora** e viver de busca orgânica e
tráfego pago até haver um endereço comercial. Ficha é canal, não obrigação.

---

## A ficha, campo a campo

### Nome

**`Retorno`**, e nada além disso. Não `Retorno — Automação de Agenda para Clínicas`.

Enfiar palavra-chave no nome é a violação mais comum e mais punida das diretrizes
do Google, e qualquer concorrente pode denunciar em dois cliques. O nome é o nome
que está na fachada, no contrato e na nota — no seu caso, na marca.

### Categorias

Uma principal, até nove secundárias. **A principal decide para qual busca você
concorre** e é o campo de maior peso da ficha inteira.

| | categoria | por quê |
| --- | --- | --- |
| principal | **Serviço de marketing** ou **Consultor de marketing** | é onde a dona de clínica procura quando decide resolver a agenda |
| secundária | Serviço de software | descreve o que é, mas quase ninguém busca assim |
| secundária | Consultor de negócios | pega a busca mais ampla |

**Não** use "Desenvolvedor de software" como principal: quem busca isso quer um
sistema sob medida, não uma agenda que para de esvaziar.

As categorias exatas disponíveis mudam por país e o Google não publica a lista
completa; digite no campo e escolha entre as que ele oferecer. **Anote aqui a que
você escolheu:** `[PREENCHER]`.

### Área de atendimento

Até 20 regiões. Menos é mais: área gigante dilui e não ajuda ranking nenhum.

Comece pela cidade onde você tem a primeira conversa marcada e as vizinhas — o
mesmo recorte que você usa em `npm run buscar -- --cidade "..."`. Coerência aqui
não é estética: **é a mesma cidade em que você está prospectando, e é onde a
resposta a uma ficha nova aparece mais rápido.**

`[PREENCHER: cidades]`

### Horário

Negócio remoto costuma pular esse campo, e isso custa: sem horário, a ficha some do
filtro "aberto agora" e o Google trata como cadastro incompleto.

Preencha o horário em que **você de fato responde WhatsApp**. Se é 9h–18h de
segunda a sexta, é isso. Horário generoso e falso gera a primeira experiência ruim:
a pessoa manda mensagem às 21h porque a ficha diz aberto, e ninguém responde.

Este é literalmente o achado `sem-horario` que a ferramenta cobra das clínicas
(`src/score.ts`, peso 9).

### Fotos

O campo mais negligenciado e o de retorno mais rápido. Ficha sem foto tem menos
clique que ficha com foto, e a comparação no Maps é lado a lado.

O que dá para fotografar num negócio sem escritório:

- **Logo** — quadrada, fundo limpo.
- **Capa** — a que aparece no topo. É a única que você escolhe; o resto o Google
  ordena sozinho.
- **A tela do relatório de auditoria** — o `out/index.html` que a ferramenta gera.
  Isso é foto de produto de verdade: mostra o que a pessoa vai receber.
- **A tela da calculadora** com números preenchidos.
- **As pessoas.** Duas pessoas reais convertem mais que qualquer ícone, e a página
  já diz que são um desenvolvedor e uma enfermeira em formação.

**Nada de banco de imagens.** Foto genérica de "equipe sorrindo em escritório" é
reconhecível na hora e destrói exatamente a credibilidade que o resto do site
constrói sendo sóbrio.

### Link para a landing

Aponte para a **`index.html`** — a página de clínicas —, nunca para a
`enfermeiras.html`. Quem chega pela ficha do GMN buscando serviço de marketing é
dona de clínica; mandar para a página de enfermeiras é perder a visita.

Use o link com o parâmetro de origem, para separar essa visita do resto quando a
medição existir (ver `docs/medicao.md`):

```
https://EXEMPLO-DOMINIO.com.br/?origem=gmn
```

> **Trava:** o link só entra depois que o contato real estiver no site e a
> indexação aberta. Mandar tráfego do Google para uma página com
> `wa.me/5500000000000` é o cenário que `docs/seo.md` descreve como pior que não
> ser achado. Ver a ordem em `docs/operacao-site.md` §7.

### Descrição

750 caracteres. Os primeiros 250 são os que aparecem sem clicar em "mais".

Reaproveite a promessa da landing em vez de escrever de novo — texto divergente
entre ficha e site é desconfiança de graça. Não repita a lista de palavras-chave:
o Google não usa a descrição para ranquear, ela é para a pessoa.

### O que deixar vazio, de propósito

| campo | por quê |
| --- | --- |
| Produtos | pensado para varejo; preço de serviço já está na landing |
| Reservas | exige integração de agendamento que não existe |
| Perguntas frequentes da ficha | a landing já tem cinco perguntas; duplicar é manter duas versões |

---

## Avaliações

### Como pedir sem pisar na regra

A ferramenta cobra `poucas-avaliacoes` das clínicas com peso 11 — o maior peso da
seção de ficha. Vale para você também.

- Peça **depois de entregar algo**: o relatório de auditoria, a primeira semana do
  piloto rodando, o relatório do mês.
- Peça **por link direto** de avaliação, não "procura a gente no Google".
- **Nunca ofereça nada em troca.** Desconto por avaliação viola as diretrizes,
  e a punição é a ficha inteira, não a avaliação.
- **Nunca peça só para quem você sabe que está feliz.** Isso tem nome —
  *review gating* — e é violação explícita.

### Responder: a regra do prazo

**Toda avaliação recebe resposta.** Inclusive "5 estrelas" sem texto.

| | prazo |
| --- | --- |
| avaliação negativa (1–3) | **24 horas** |
| avaliação positiva (4–5) | 7 dias |

O prazo curto para a negativa não é para o autor da avaliação — em geral ele não
volta. É para quem vai ler daqui a três meses comparando você com outro. Uma
crítica sem resposta parece verdade aceita; com resposta serena, parece incidente
resolvido.

### Respondendo a uma avaliação ruim

Quatro movimentos, nessa ordem:

1. **Reconheça o fato**, não o rótulo. "A implantação passou dos sete dias que
   combinamos" — não "sentimos muito que você tenha se sentido assim", que é a
   frase que todo mundo já identifica como não-resposta.
2. **Diga o que mudou por causa disso.** É o que transforma a resposta em prova de
   que você escuta.
3. **Ofereça o canal privado**, sem repetir informação de cliente. Nunca confirme
   publicamente que a pessoa é cliente, nunca cite valor pago, nunca cite nada da
   operação dela.
4. **Encerre.** Não responda a réplica em público. Discussão de duas voltas na
   ficha do Google é a única coisa pior que a avaliação original.

**O que não fazer, nunca:** responder no mesmo dia da raiva; explicar por que o
cliente está errado; pedir para tirar a avaliação; responder com texto igual em
todas — o Google mostra as respostas empilhadas, e resposta repetida se lê como
robô.

**Avaliação falsa ou de quem nunca foi cliente:** denuncie pela ficha e **responda
mesmo assim**, curto e factual: "Não localizamos contratação com este nome. Se
houver, me chama em [canal] que eu resolvo." A denúncia costuma não dar em nada; a
resposta é o que fica visível.

`[PREENCHER: quem responde as avaliações e em quanto tempo]` — ver
`docs/atendimento.md`.

---

## Achados no código

Frente 3 pedia para conferir se todo sinal da ficha do Maps que já é coletado está
sendo pontuado. Conferi campo a campo, comparando `Clinica` em `src/tipos.ts` com
o que `src/score.ts` lê.

### `businessStatus` era coletado e nunca lido — corrigido

`src/places.ts` pede `places.businessStatus` no *field mask* (linha 17) e grava em
`clinica.status`. `src/score.ts` **nunca lia esse campo**.

O efeito era silencioso e caro: uma clínica **fechada em definitivo** tem tudo
ruim — site fora do ar, sem horário, sem avaliação nova — e por isso subia para o
topo da fila com índice alto. Ou seja, o pior prospecto possível aparecia como o
melhor, e alguém escreveria para um endereço que não existe mais.

Corrigido assim:

- **`CLOSED_PERMANENTLY`** → índice **0**, e um único achado explicando. Os demais
  achados nem são calculados: dizer a uma clínica encerrada que o site dela está
  lento não ajuda ninguém.
- **`CLOSED_TEMPORARILY`** → pontuação normal, mais um achado informativo de peso
  0. Fechada temporária continua sendo prospecto — só é bom saber antes de ligar.

**Peso 0 é proposital**, não esquecimento: o achado aparece no relatório mas não
soma oportunidade. Não há o que vender para quem fechou.

### Os pesos não estavam "em um lugar só"

O README diz: *"Os pesos estão em `src/score.ts`, em um lugar só."* Estavam no
arquivo certo, mas como literais dentro de cada achado, espalhados por 150 linhas —
era impossível comparar dois pesos sem rolar o arquivo inteiro, que é justamente o
que a promessa do README existe para permitir.

Agora há uma tabela `PESO` no topo, agrupada por tipo de problema, e cada achado
referencia a chave. **Nenhum número mudou** — conferido rodando os 14 casos antes e
depois da mudança, com saída idêntica.

### Um sinal fora do escopo desta frente

`site.temInstagram` também é coletado (`src/site.ts` linha 65) e nunca pontuado.
Não é sinal da ficha do Maps — vem da varredura do site — então **não mexi nele
aqui**, para a frente não sair do escopo.

Vale corrigir depois: para clínica de estética, o Instagram é a vitrine principal,
e site sem link para ele é atrito real. Peso sugerido: **6**, severidade baixa,
mesma faixa de `nota-baixa`. Decisão sua.

---

## Dois sinais novos que valem propor

Regra desta seção: **campo exato da Places API (New), ou não entra.** Nenhum dos
dois está implementado — os dois aumentam o *field mask*, e field mask é o que
determina o preço da chamada (`src/places.ts`, linhas 8–10). É gasto seu, então é
decisão sua.

### 1. Ficha sem foto

**Campo:** `places.photos`

Devolve a lista de fotos da ficha. Vazia ou muito curta é um achado real e visível:
no Maps, a comparação entre duas clínicas é lado a lado, e a que não tem foto perde
o clique antes de qualquer outra coisa.

É também o achado mais fácil de vender, porque a dona confere sozinha em dez
segundos.

```ts
// no FIELD_MASK
"places.photos",
// no tipo da resposta
photos?: Array<{ name: string; widthPx: number; heightPx: number }>;
// sinal derivado
temFoto: (lugar.photos?.length ?? 0) > 0
```

**Peso sugerido:** 10, severidade média — mesma faixa de `sem-telefone`.

**Custo:** `photos` está numa faixa de cobrança acima dos campos que a ferramenta
usa hoje. Confirme na página de preços do Places antes de ligar; a página muda e
não vou citar valor que não posso verificar.

### 2. Categoria principal errada

**Campo:** `places.primaryTypeDisplayName` (e `places.primaryType` para o código
estável)

Devolve a categoria principal da ficha. Uma clínica de estética cadastrada como
"Salão de beleza" ou "Spa" concorre na busca errada — e categoria principal é o
campo de maior peso do ranking local, o mesmo ponto que este documento faz na
seção de categorias.

```ts
"places.primaryType",
"places.primaryTypeDisplayName",
```

**Cuidado ao implementar:** isso não vira um `if` simples. Exige uma lista de tipos
aceitáveis para clínica de estética (`beauty_salon`, `spa`, `medical_clinic`,
`skin_care_clinic`…), e essa lista é opinião, não fato — enquanto ela não existir
e for revisada por alguém que conhece o mercado, o achado dá falso positivo e
queima credibilidade no relatório.

**Recomendação:** implemente o `places.photos` primeiro. É objetivo — tem foto ou
não tem — e não depende de julgamento nenhum.
