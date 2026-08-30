# Conteúdo e perfil

Pauta de Instagram e o que o perfil precisa ter antes de receber tráfego pago.

---

## 1. A pauta sai da própria ferramenta

`src/score.ts` detecta 14 problemas. Cada um é um post — e não por analogia: a
ferramenta existe porque esses são, de fato, os problemas que as clínicas têm.
A pauta já está escrita no código, só falta transcrever.

O jeito de usar isto é ao contrário do normal: **rode a auditoria numa cidade
antes de planejar o mês.** Os achados mais frequentes na sua base são os posts
que mais gente vai reconhecer. Publicar sobre HTTPS numa cidade onde 90% dos
sites já têm HTTPS é falar sozinho.

```bash
npm run auditar
# e conte a frequência de cada chave em data/clinicas.json
```

### Os 14 posts

Ordem sugerida: pelo peso, que é a estimativa de quanto o problema custa ao dono.

| # | achado (`chave`) | peso | ângulo do post | formato |
| --- | --- | --- | --- | --- |
| 1 | `site-fora` | 24 | "O link do seu Google leva para uma página que não abre" — como conferir em 10 segundos | carrossel curto |
| 2 | `sem-site` | 22 | O que a cliente vê quando só existe a ficha do Maps | carrossel |
| 3 | `sem-agendamento` | 20 | Quantos pedidos de horário chegam fora do expediente — e o que acontece com eles | reels |
| 4 | `ficha-fechada-temporariamente` | 18 | "Sua ficha pode estar dizendo que você fechou" — o aviso vermelho que ninguém viu | reels curto, alto impacto |
| 5 | `sem-https` | 14 | O cadeado, o aviso de "não seguro", e por que ele derruba a busca | estático |
| 6 | `nao-responsivo` | 12 | Abrir o próprio site no celular e tentar ler sem dar zoom | reels de tela |
| 7 | `poucas-avaliacoes` | 11 | Por que volume de avaliação pesa mais que a nota no mapa | carrossel |
| 8 | `sem-telefone` | 10 | Ficha sem telefone: a pessoa não liga, procura outra | estático |
| 9 | `sem-horario` | 9 | Ficar de fora do filtro "aberto agora" | estático |
| 10 | `site-lento` | 8 | Três segundos, e o que acontece depois deles | reels |
| 11 | `sem-whatsapp` | 8 | Copiar número é atrito; link direto não é | estático |
| 12 | `nota-baixa` | 6 | A comparação lado a lado que o Maps faz, e o meio ponto que decide | carrossel |
| 13 | `seo-basico` | 5 | O trecho aleatório que o Google mostra quando não há descrição | estático |
| 14 | `ficha-fechada-em-definitivo` | 0 | Fichas duplicadas e fichas fantasmas de endereço antigo | estático |

**Por que o de peso 0 continua na lista:** ele não é oportunidade comercial —
é desqualificação — mas é conteúdo excelente, porque quase toda clínica que
mudou de endereço tem uma ficha antiga esquecida no Maps disputando com a nova.

### O formato que fecha o ciclo

O post mais forte não é nenhum dos 14 isolado: é **a auditoria em si.** Vocês têm
uma ferramenta que gera um relatório de uma página por clínica. Um reels
mostrando o relatório sendo gerado, com o nome borrado, e a frase "isto aqui é o
que a gente manda antes de pedir qualquer reunião" faz o trabalho dos 14 juntos.

**Uma regra que não pode ser quebrada:** nunca publique o relatório de uma
clínica identificável sem autorização por escrito. O relatório aponta os defeitos
do negócio de outra pessoa; expor isso publicamente é o oposto do que o serviço
promete. Borre nome, endereço e URL, ou use uma clínica fictícia montada por
vocês para a gravação.

### Cadência realista

Duas pessoas, uma delas terminando enfermagem. **Dois posts por semana**
sustentáveis valem mais que cinco por duas semanas e nada depois. 14 posts, dois
por semana, dão sete semanas de pauta sem repetir.

---

## 2. Duas contas, ou uma?

O site tem três públicos que compram por razões opostas: dona de clínica,
enfermeira entrando, enfermeira especialista. **Instagram não separa público como
o site separa** — quem seguir vê tudo.

| opção | a favor | contra |
| --- | --- | --- |
| Uma conta só | metade do trabalho; o feed mostra a empresa inteira | a dona de clínica vê post sobre "quanto cobrar" e não é para ela; a enfermeira vê post sobre no-show e não é para ela |
| Duas contas | cada feed fala com um público; a bio pode ter link único | dobra o trabalho de produção, e o volume por conta cai pela metade |

**Recomendação:** **uma conta só, por enquanto.** Duas contas com dois posts por
semana cada é um post por semana em cada, e um post por semana não sustenta
nada. A separação vem quando o volume justificar — e o sinal de que chegou a
hora é a caixa de mensagens: quando as perguntas de um público começarem a se
perder no meio das do outro.

Enquanto for uma conta, a pauta acima (clínicas) precisa dividir espaço com a
pauta de enfermeiras, que é a que traz a audiência maior e mais barata. A
proporção que faz sentido, dado que o link da bio é a calculadora: **2 de
enfermeiras para 1 de clínicas.**

---

## 3. O perfil, para sustentar tráfego pago

Anúncio manda a pessoa para um perfil que ela vai julgar em três segundos. Se o
perfil não sustentar, o dinheiro do anúncio compra visita e joga fora.

### Bio

Quatro linhas, e cada uma tem um trabalho:

1. **O que é**, em termos que o público reconhece — não a categoria do negócio.
2. **Para quem**, dito de forma que a pessoa se identifique.
3. **A prova ou a restrição** — aqui, a mais valiosa é a que vocês já dizem no
   site: não ensinam procedimento, e conteúdo clínico só assinado por
   especialista com registro. Numa área cheia de gente ensinando o que não pode,
   dizer o que você **não** faz é diferenciação real.
4. **O que fazer agora** — uma frase apontando para o link.

**O que não colocar:** emoji em toda linha, "transformando vidas", frase de
efeito sem sujeito. A voz do site é sóbria; um perfil em outra voz quebra a
continuidade entre o anúncio e o destino.

### Destaques

Cinco, nesta ordem — o primeiro é o mais visto e por isso é o que responde à
objeção principal, não o que se apresenta:

| destaque | conteúdo |
| --- | --- |
| **Quem somos** | as duas pessoas, com o que cada uma faz e o que ainda não faz |
| **A calculadora** | como usar, com o resultado aparecendo na tela |
| **O que a enfermeira pode fazer** | o que já se sabe, com fonte e data — e o aviso de que o mapa completo está sendo feito |
| **Para clínicas** | o problema da agenda e como o piloto funciona |
| **Perguntas** | as objeções que chegam na caixa de mensagens |

Destaque com capa feita e sem conteúdo dentro é pior que não ter. Faça um por
semana; em cinco semanas está pronto.

### Link na bio

**Um link, não uma lista.** Ferramenta de "vários links" transfere para a pessoa
a decisão que o anúncio já tinha tomado por ela, e cada clique a mais perde
gente.

- **Se o tráfego pago for para enfermeiras:** o link é `/calculadora`,
  direto. Não é a home, não é `/enfermeiras`. A calculadora entrega valor sem
  cadastro, na hora, e é a única página que faz isso.
- **Se for para clínicas:** o link é `/clinicas`.
- **Trocar o link conforme a campanha ativa**, e trocar de volta quando ela
  acabar. Link da bio é espaço de campanha, não de institucional.

A home é a única página que faz o visitante escolher um caminho. Mandar tráfego
pago para ela é pagar para a pessoa tomar uma decisão que o anúncio já tomou.

### O que precisa existir antes de gastar o primeiro real

- [ ] Bio escrita, com link apontando para a página da campanha.
- [ ] Pelo menos **nove posts** no feed. Perfil com três posts parece abandonado,
      e a pessoa que veio do anúncio percebe em dois segundos.
- [ ] Os cinco destaques, com conteúdo dentro.
- [ ] Uma pessoa responsável por responder a caixa de mensagens, com prazo
      definido — ver [docs/atendimento.md](./atendimento.md).
- [ ] `data-evento` nos CTAs das landings, para saber o que o clique virou —
      ver [docs/medicao.md](./medicao.md).

---

## 4. Prova social: o que entra no site

A seção existe em `site/index.html`, com HTML e CSS prontos, e está com o
atributo `hidden`. **Nenhum depoimento foi escrito** — nem como exemplo.

Isso é deliberado. Texto de exemplo em seção de depoimento é a coisa mais fácil
de esquecer no ar e a mais cara: um depoimento inventado descoberto por um
cliente destrói exatamente a confiança que a seção existe para construir. E o
site inteiro é construído sobre dizer o que ainda não está pronto.

**Para publicar:** preencha pelo menos **dois** blocos marcados `DEPOIMENTO`,
apague os que sobrarem e tire o `hidden`. Dois, e não um: um depoimento sozinho
parece o único cliente que existe, e o leitor conta.

**O que pode entrar:**

- Frase de pessoa real, com autorização dela para publicar nome e clínica. Um
  "pode usar" por escrito no WhatsApp basta — desde que vocês guardem.
- Número, só se veio da própria clínica e puder ser mostrado a um terceiro.
  Número que você não consegue defender numa reunião não entra.
- Se a pessoa não quiser ser identificada: função e cidade. Vale menos que nome
  completo, mas nome inventado não vale nada e é mentira.

**O que nunca entra:** foto de paciente, antes e depois, resultado de tratamento.
A clínica é cliente de vocês; o material clínico é dela e do paciente.

**Enquanto não houver depoimento:** a garantia escrita em `/clinicas` já é prova
social de um tipo mais forte que depoimento — é risco assumido por vocês, e não
elogio de terceiro. Ela sustenta a página sozinha até o primeiro piloto fechar.
