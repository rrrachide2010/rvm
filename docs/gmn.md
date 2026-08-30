# Google Meu Negócio

Como montar a ficha e como responder avaliação — inclusive a ruim.

---

## 0. Antes de tudo: vocês se qualificam?

Esta é a primeira pergunta e quase ninguém faz. O Google exige que um perfil de
empresa represente um negócio que **atende cliente pessoalmente**: ou num
endereço onde o cliente vai, ou numa área de atendimento onde vocês vão até ele.
Negócio que opera só remotamente **não se qualifica**, e ficha criada assim é
suspensa — às vezes meses depois, junto com o histórico de avaliações.

Aplicado a este negócio:

| frente | atende pessoalmente? | qualifica? |
| --- | --- | --- |
| Automação de agenda para clínicas | implantação e medição inicial podem ser presenciais | **provavelmente sim**, se forem mesmo presenciais |
| Ferramentas para enfermeiras | não, é site | não sustenta a ficha sozinha |
| Co-produção com especialistas | gravação pode ser presencial | ajuda |

**Decisão que é sua:** se a implantação nas clínicas é presencial de verdade, a
ficha se sustenta como negócio de área de atendimento. Se hoje é tudo remoto,
criar a ficha é assumir um risco — e a alternativa honesta é esperar até que
haja atendimento presencial.

Não invente endereço comercial em coworking que vocês não ocupam. É a causa mais
comum de suspensão, e a apelação é lenta.

---

## 1. A ficha, campo a campo

### Nome

Exatamente o nome da empresa, **sem palavra-chave grudada**. "Pele & Código" e
não "Pele & Código — Automação de Agenda para Clínicas". Enfiar termo no nome é
violação explícita das diretrizes, é a denúncia mais fácil de um concorrente
fazer, e derruba a ficha.

> A marca ainda está declarada como provisória no HTML. **Não crie a ficha antes
> de decidir o nome definitivo** — trocar nome em ficha já indexada custa
> reavaliação e às vezes revalidação.

### Categorias

O Google pede **uma categoria principal** e permite secundárias. A principal é a
que mais pesa no ranking local, e a regra é escolher a que descreve o que vocês
**fazem**, não o setor que vocês atendem.

- **Principal, provável:** algo na linha de *Serviço de automação* /
  *Desenvolvedor de software* / *Consultor de marketing*.
- **Secundárias, prováveis:** *Serviço de consultoria empresarial*,
  *Serviço de marketing*.

> **Os nomes exatos precisam ser escolhidos da lista do Google.** A lista é
> fechada, muda sem aviso e varia por país; não dá para inventar a string. Digite
> "automação", "software" e "marketing" no campo e escolha entre o que aparecer.
> Se nenhuma servir bem, prefira a mais genérica e correta à mais específica e
> forçada — categoria errada traz busca errada.

**O que não fazer:** escolher uma categoria de clínica de estética. Vocês não são
uma; a ficha apareceria em busca de paciente, geraria contato errado e é
exatamente o tipo de coisa que um concorrente denuncia.

### Área de atendimento

Como não há endereço de balcão, a ficha deve ser configurada **sem endereço
visível** e com área de atendimento.

- Comece pela cidade onde a prospecção realmente roda. A ferramenta busca por
  cidade (`npm run buscar -- --cidade "..."`); use a mesma.
- O Google permite até 20 áreas, mas **área grande demais dilui**. Duas ou três
  cidades vizinhas, não um estado inteiro.
- Aumente a área quando houver cliente atendido nela — não antes.

### Horário

Preencha o horário real, e mantenha. Este campo tem peso duplo aqui: é o mesmo
sinal que a própria ferramenta pontua nas clínicas auditadas — ficha sem horário
publicado sai do filtro "aberto agora", e vale 9 pontos no índice de
oportunidade (`PESOS.semHorario` em `src/score.ts`). Não faz sentido cobrar isso
do cliente e não fazer.

Cadastre também **horário especial** em feriado. Ficha que diz "aberto" num
feriado em que ninguém responde produz a pior avaliação que existe: a de quem
foi ignorado.

### Telefone e site

- Telefone: o mesmo que está no site. Hoje o site tem placeholder
  (`wa.me/5500000000000`); resolver isso vem antes da ficha.
- Site: **aponte para a página da frente que a ficha representa**, não para a
  home. Se a categoria e a área de atendimento falam de clínicas, o link certo é
  `/clinicas`, que é a landing de propósito único. A home faz o visitante
  escolher de novo um caminho que a busca já escolheu.
- Se usar link com parâmetro de campanha, veja [docs/medicao.md](./medicao.md).

### Descrição (750 caracteres)

Diga o que vocês fazem e para quem, na mesma voz do site — sóbria e direta. Sem
lista de palavra-chave. Os primeiros 250 caracteres são os que aparecem sem
clicar em "mais", então o que importa vai na frente.

### Fotos

É o campo mais negligenciado e o que mais muda a taxa de clique. **Só foto real:**
banco de imagens é reconhecível e destrói a confiança que a ficha existe para
construir.

| tipo | quantas | o quê |
| --- | --- | --- |
| Logo | 1 | quadrada, 720×720 no mínimo |
| Capa | 1 | 1024×576, a que aparece no topo |
| Equipe | 2–3 | as duas pessoas, rosto visível |
| Trabalho | 3–5 | a tela do relatório de auditoria, o painel, uma implantação acontecendo |

**O que não fotografar:** paciente, procedimento, resultado de tratamento.
Vocês não são a clínica, e material clínico de terceiro na sua ficha é problema
regulatório dele e seu.

**Cadência:** uma foto nova por mês. Ficha parada há um ano parece empresa
fechada.

### Produtos e serviços

Cadastre as três frentes como serviços separados, com o mesmo nome que aparece
no site. Serviço com nome diferente do site confunde quem chega pelos dois.

---

## 2. Avaliações

### O que pedir, e quando

Peça **depois de entregar algo verificável** — no fim do piloto de 30 dias, com o
número na mesa. Pedir antes é pedir favor; pedir depois é pedir constatação.

**Nunca:** oferecer desconto, brinde ou qualquer contrapartida por avaliação.
É violação das diretrizes, e uma avaliação comprada é identificável pelo padrão.

**Nunca:** criar avaliação com conta própria ou de conhecido. Além de violação, é
o tipo de coisa que aparece quando alguém compara os perfis dos avaliadores.

### Responder: a regra dos prazos

| tipo | prazo | quem responde |
| --- | --- | --- |
| Qualquer avaliação, boa ou ruim | **até 48h** | a pessoa definida como dona do canal em [operacao-site.md §5](./operacao-site.md#5-credenciais-e-acesso) |
| Avaliação 1 ou 2 estrelas | **até 24h** | a mesma pessoa, e nunca no impulso |

Responder **todas**, inclusive as de 5 estrelas sem texto. Perfil com resposta em
todas mostra que tem alguém do outro lado — e é o sinal que quem lê procura
quando está decidindo.

### Responder avaliação boa

Curto, específico e sem fórmula. Cite o que foi feito. Três linhas bastam.
Resposta idêntica em todas as avaliações positivas é pior que nenhuma: fica
evidente que é copiar e colar.

### Responder avaliação ruim

Esta é a que importa, e é a que quase todo mundo erra. **Quem lê a resposta não é
quem reclamou — é a próxima pessoa,** que está decidindo se contrata. Ela não
espera que vocês estejam certos; espera ver como vocês se comportam quando estão
errados.

**A estrutura, em quatro partes:**

1. **Reconheça o que aconteceu**, sem "lamentamos que você tenha se sentido".
   Essa construção diz que o problema foi o sentimento da pessoa, e todo mundo
   percebe.
2. **Explique o que deu errado**, em uma frase, sem terceirizar a culpa.
3. **Diga o que mudou por causa disso** — o único elemento que separa desculpa
   de correção.
4. **Leve para fora**: ofereça um canal direto para resolver o resto.

**Regras rígidas:**

- **Nunca cite dado do cliente na resposta pública.** Nem confirme que a pessoa
  é cliente, se a avaliação não disser. Numa área que toca saúde, confirmar
  publicamente que alguém é cliente é vazamento.
- **Nunca discuta.** Se a avaliação é injusta, a resposta educada e factual já
  mostra isso a quem lê. Discussão faz o leitor tomar o lado de quem reclamou.
- **Nunca peça a remoção da avaliação em público.**
- **Escreva, espere, releia depois.** A regra de 24h existe para ser rápida, não
  para responder em cinco minutos com raiva.

**Exemplo de esqueleto — para adaptar, não para colar:**

> "Você tem razão: [o que aconteceu], e isso não deveria ter acontecido.
> [Uma frase sobre a causa.] Desde então, [o que mudou].
> Se você quiser, me chama em [canal] que eu resolvo o que ficou pendente."

### Avaliação falsa ou que viola as diretrizes

Denuncie pelo próprio perfil — o botão fica na avaliação. **Responda mesmo
assim**, porque a denúncia costuma demorar e pode não ser aceita, e enquanto isso
a avaliação fica lá sem resposta. Resposta curta e factual, sem acusar a pessoa
de mentir.

### A rotina, resumida

| quando | o quê |
| --- | --- |
| Diário | Ver se há avaliação nova. Ative a notificação do app |
| Até 48h | Responder toda avaliação (24h se for 1 ou 2 estrelas) |
| Mensal | Publicar uma foto nova. Conferir horário e horário especial de feriado |
| Mensal | Ler as avaliações do mês procurando **padrão**, não caso isolado. Duas pessoas reclamando da mesma coisa é defeito de processo |
| Trimestral | Conferir se alguém sugeriu edição na ficha. O Google aceita sugestão de terceiro e altera sem avisar |

---

## 3. A ficha de vocês é a mesma que a ferramenta cobra dos outros

Vale reparar: os sinais que `src/score.ts` pontua nas clínicas auditadas são
quase todos campos de ficha do Maps.

| o que a ferramenta cobra | peso | está feito na ficha de vocês? |
| --- | --- | --- |
| Telefone na ficha | 10 | |
| Horário publicado | 9 | |
| Volume de avaliações (≥ 40) | 11 | |
| Nota ≥ 4,5 | 6 | |
| Ficha não marcada como fechada | 18 | |

Preencher esta tabela é um exercício de meia hora que vale mais que qualquer
argumento de venda: chegar numa clínica com índice 45 dizendo o que corrigir
funciona melhor quando a sua própria ficha está em 0.

Os pesos saem de `PESOS`, em `src/score.ts` — um lugar só, como o README promete.
