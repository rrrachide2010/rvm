# Conteúdo e perfil

Pauta de Instagram derivada dos achados da auditoria, e o que o perfil precisa ter
antes de receber tráfego pago.

---

## A ideia que gera a pauta inteira

`src/score.ts` detecta problemas específicos em clínicas de estética. Cada um
desses problemas é um post — e não é analogia:

- **O tema já está validado.** O achado só existe porque aparece com frequência na
  base real. Você não está adivinhando o que interessa.
- **O texto já existe.** Cada achado tem `titulo` e `detalhe` escritos na
  linguagem da dona da clínica, não em jargão. É a mesma frase que vai no relatório
  que ela recebe.
- **O peso ordena a pauta.** Peso alto = problema caro = post que interessa a mais
  gente.

Ou seja: a pauta abaixo é o `score.ts` reordenado. Quando você mexer nos pesos, a
pauta muda junto — e isso é a intenção.

---

## Pauta: um post por achado

Ordem de peso, que é ordem de importância. O gancho é o que aparece no primeiro
segundo; o texto do post sai do campo `detalhe` do achado.

| # | achado | peso | gancho |
| --- | --- | --- | --- |
| 1 | `site-fora` | 24 | "O link do seu Google leva a uma página que não abre?" |
| 2 | `sem-site` | 22 | "Sua clínica existe no Google mas não existe fora dele" |
| 3 | `sem-agendamento` | 20 | "Quantos horários você perde porque ninguém respondeu às 22h?" |
| 4 | `sem-https` | 14 | "O navegador avisa 'não seguro' antes da sua cliente ver seu trabalho" |
| 5 | `nao-responsivo` | 12 | "Abra o site da sua clínica no celular agora. Precisou dar zoom?" |
| 6 | `poucas-avaliacoes` | 11 | "Volume de avaliação pesa mais que nota no Google. Você tem quantas?" |
| 7 | `sem-telefone` | 10 | "Sua ficha do Google tem telefone? Confere agora, leva 10 segundos" |
| 8 | `sem-horario` | 9 | "Sem horário publicado, você some do 'aberto agora'" |
| 9 | `site-lento` | 8 | "Três segundos. É o que você tem antes de metade desistir" |
| 10 | `sem-whatsapp` | 8 | "A cliente precisa copiar seu número? Ela não vai copiar" |
| 11 | `nota-baixa` | 6 | "Meio ponto no Google decide o clique na comparação lado a lado" |
| 12 | `seo-basico` | 5 | "O que aparece embaixo do seu link no Google? Você escolheu isso?" |
| 13 | `fechada-definitiva` | — | "O Google pode estar dizendo que sua clínica fechou" |

**O 13 é o mais subestimado.** É raro, mas quando acontece é catastrófico e a dona
quase nunca sabe. Post que faz gente correr conferir a própria ficha é post que
gera comentário, e comentário é o que faz o resto circular.

### Os três formatos que essa pauta pede

**Diagnóstico ao vivo.** Abre o Maps, escolhe uma clínica **de outra cidade**,
mostra o problema na tela. Nunca de uma clínica que você prospecta ou pretende
prospectar — expor cliente em potencial em vídeo é o fim da conversa antes de
começar, e a internet é pequena.

**Faça você mesmo em 30 segundos.** "Como conferir se o seu site abre no celular."
Entrega valor sem pedir nada, e é o que faz salvar e compartilhar.

**O número.** "Site que demora 3 segundos perde metade das visitas." Só publique
número que você pode sustentar com fonte, e cite a fonte no próprio post. Número
solto na internet volta como pergunta em DM, e não saber responder custa mais que
o alcance ganho.

### O ritmo

Um achado por semana dura **três meses** — e no fim você recomeça com material
novo, porque terá conversado com clínicas e saberá quais achados de fato fazem a
dona responder. Aí a pauta se reordena sozinha.

Não publique os 13 em duas semanas. Não é falta de material, é que ninguém
absorve treze problemas seguidos, e você queima em quinze dias o estoque de três
meses.

---

## Os dois públicos não moram no mesmo perfil

Aqui está a decisão que precisa ser tomada **antes** de qualquer post.

O site atende dois públicos com intenção oposta, e `docs/seo.md` já separa as
palavras-chave por isso:

- **dona de clínica** — tem negócio, quer resolver agenda
- **enfermeira entrando em estética** — não tem negócio, quer saber quanto cobrar

Num perfil só, cada post afasta metade de quem segue. Pior: o algoritmo aprende a
entregar para o público errado, e as duas audiências chegam mornas.

O README diz que `enfermeiras.html` é o destino do link da bio — ou seja, **o
perfil que existe hoje é o de enfermeiras.** A pauta de auditoria acima é para
dona de clínica.

| | |
| --- | --- |
| **Decisão** | `[ ]` dois perfis · `[ ]` um perfil, só enfermeiras · `[ ]` um perfil, só clínicas |
| **Minha recomendação** | dois perfis, começando pelo de enfermeiras |

**Por quê começar por enfermeiras:** a calculadora já está no ar, é gratuita, não
pede cadastro e resolve na hora. É o único ativo que gera link espontâneo hoje
(`docs/seo.md` faz o mesmo ponto). O perfil de clínicas depende de prova social
que ainda não existe.

Dois perfis custam mais tempo, não mais dinheiro. Se não houver tempo para dois,
faça **um** bem feito — o de enfermeiras — e chegue em clínica por prospecção
ativa, que é o que a ferramenta em `src/` já faz.

---

## O que o perfil precisa ter antes do tráfego pago

Mandar verba para um perfil vazio é pagar para a pessoa clicar, olhar e sair. As
três coisas abaixo custam uma tarde.

### Bio

Ela responde uma pergunta em três segundos: *"isso é para mim?"*

**Perfil de enfermeiras:**

> Ferramentas para enfermeira entrando em estética.
> Quanto cobrar, e o que o COREN permite.
> Calculadora gratuita, sem cadastro ↓

Por que funciona: diz **para quem** na primeira linha, **o que** na segunda,
**o que fazer agora** na terceira. Sem emoji de foguete, sem "transformando
carreiras" — a voz do site é sóbria e o perfil precisa ser o mesmo, ou a pessoa
que clica no link acha que trocou de empresa.

**Perfil de clínicas**, se houver:

> Sua agenda para de esvaziar sozinha.
> Confirmação, fila de espera e retorno no WhatsApp da clínica.
> Piloto de 30 dias com garantia ↓

### Destaques

Quatro, não mais. Destaque é o que a pessoa olha antes de decidir seguir.

| destaque | conteúdo | por quê |
| --- | --- | --- |
| **Calculadora** | como usar, em três telas | é a isca; precisa estar no primeiro destaque |
| **Quanto cobrar** | os erros mais comuns de precificação | o tema que trouxe a pessoa |
| **Quem faz** | as duas pessoas, sem produção | a objeção de confiança, e a página `#quem` já responde bem |
| **Perguntas** | o que chega na DM | economiza a resposta repetida |

**Nada de "depoimentos"** enquanto não houver depoimento real — o mesmo critério
da seção de prova social em `index.html`.

### Link na bio

**Um link, sem agregador.** Página de agregador é um clique a mais entre o anúncio
e a ferramenta, e cada clique perde gente.

| perfil | link |
| --- | --- |
| enfermeiras | `https://EXEMPLO-DOMINIO.com.br/calculadora?origem=ig` |
| clínicas | `https://EXEMPLO-DOMINIO.com.br/?origem=ig` |

O de enfermeiras aponta direto para a **calculadora**, não para a
`enfermeiras.html`. Quem vem do Instagram já leu a bio; mandar para uma página que
explica de novo o que ela acabou de ler é atrito. A `enfermeiras.html` continua
sendo o destino de quem chega por busca, que precisa do contexto.

O `?origem=ig` é o que separa essa visita do resto quando a medição existir. Ver
`docs/medicao.md`.

> **Trava:** o link só entra depois do contato real no site e da indexação aberta.
> Ver `docs/operacao-site.md` §7 para a ordem.

---

## O que não publicar

Regras de publicidade em saúde alcançam quem fala **para** profissional de saúde,
e o perfil de enfermeiras está exatamente nesse território.

- **Nada de antes e depois.** Vale para procedimento estético e é o erro mais
  comum do nicho. A `enfermeiras.html` já promete uma ferramenta sobre isso
  ("Como construir prova sem depender de antes e depois").
- **Nada de protocolo ou técnica de procedimento.** A própria página diz por quê:
  exige título de especialista, e quem escreve não tem. Publicar isso contradiz o
  site e é o tipo de contradição que uma seguidora enfermeira percebe na hora.
- **Nada de promessa de retorno financeiro.** "Fature R$ 10 mil por mês" é o
  oposto da voz do site e da calculadora, que existe justamente para a pessoa
  descobrir o número dela.
- **Nada de citar clínica auditada.** Nem em print borrado. A base é dado público
  de empresa coletado para gerar diagnóstico — `docs/atendimento.md` faz o mesmo
  ponto sobre público semelhante.

---

## O que medir

Duas coisas, e nenhuma é seguidor.

**Clique no link da bio → uso da calculadora.** Se muita gente clica e ninguém
calcula, o problema é a página, não o post. É a métrica que decide se vale pagar
por alcance.

**DMs perguntando a mesma coisa.** Pergunta repetida é pauta pronta e, quando vira
destaque, para de consumir seu tempo. É o único caso em que responder a mesma
coisa três vezes tem retorno.

Seguidor não paga mensalidade. Um perfil de 400 pessoas certas vale mais que
4.000 de qualquer lugar — e para tráfego pago, a segunda opção é pior que a
primeira, porque envenena a segmentação.
