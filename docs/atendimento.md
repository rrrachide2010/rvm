# Atendimento

Em quanto tempo responder, quem responde o quê, e o que fazer com a lista de
clientes ativos.

---

## 1. Prazo de resposta

O prazo não é meta de qualidade: é a variável que decide se o contato vira
conversa. Quem mandou mensagem para vocês mandou para mais duas no mesmo dia.

| canal | prazo | por quê |
| --- | --- | --- |
| **WhatsApp** | **até 1 hora**, em horário comercial | é o canal do botão principal das landings. Quem clica ali está com o assunto aberto na cabeça agora |
| **WhatsApp fora do horário** | responder na primeira hora do dia seguinte | com uma resposta automática na hora, dizendo **quando** virá a resposta humana — não "responderemos em breve" |
| **E-mail** | **até 24h úteis** | quem escolheu e-mail em vez do WhatsApp aceitou esperar |
| **Instagram (direct)** | **até 4 horas** | e é o canal que mais some, porque não tem caixa de entrada de verdade |
| **Comentário no Instagram** | até 24h | responder em público; leva mais gente que a resposta privada |
| **Formulário da lista de espera** | não existe ainda | ver [operacao-site.md §6](./operacao-site.md#6-formulário-da-lista-de-espera--comportamento-de-confirmação) |

**A resposta automática de fora do horário precisa dizer uma hora.** "Respondemos
assim que possível" não segura ninguém; "respondo amanhã até as 10h" segura, e é
uma promessa que dá para cumprir.

**Uma inversão que vale dinheiro:** vocês vendem justamente *responder rápido e
não perder o pedido de horário*. Demorar dois dias para responder um dono de
clínica que veio pelo relatório de auditoria contradiz a oferta na única
demonstração que ele consegue fazer sozinho.

---

## 2. Um dono por canal

Dois sócios e cinco canais é a receita para a mensagem que ninguém respondeu
porque cada um achou que o outro ia responder.

| canal | dono | substituto | acesso |
| --- | --- | --- | --- |
| WhatsApp comercial | **a definir** | **a definir** | WhatsApp Business com dispositivos vinculados |
| E-mail `contato@` | **a definir** | **a definir** | caixa compartilhada ou encaminhamento, **não senha em comum** |
| Instagram | **a definir** | **a definir** | conta profissional com acesso por convite |
| Google Meu Negócio | **a definir** | **a definir** | convite nominal como gerente |
| Formulário | **a definir** | **a definir** | quando existir |

> Preencher é decisão de vocês dois. Não inventei divisão.

### Três regras de acesso

1. **Nominal, nunca compartilhado.** WhatsApp Business permite dispositivos
   vinculados; Instagram, Google e provedores de e-mail permitem convite por
   pessoa. Todos deixam rastro de quem fez o quê e permitem revogar um sem
   trocar a senha do outro. Senha em comum não permite nenhuma das duas coisas.
2. **Dono responde, substituto cobre.** O substituto entra quando o dono avisa
   que não vai poder — não "quando der".
3. **Verificação em duas etapas em todos.** Perder o WhatsApp comercial é perder
   a base de conversas inteira, e recuperar conta de WhatsApp é lento.

**Um caso especial: o número do WhatsApp.** Se ele for o telefone pessoal de
alguém, a saída dessa pessoa leva o histórico junto. Vale a pena que seja um
número da empresa desde o começo — trocar depois significa avisar todo mundo.

---

## 3. Registrar a conversa

Toda conversa que sai do "oi" vira um estágio na base:

```bash
npm run estagio -- --clinica "parte do nome" --para respondeu
```

Os seis estágios são `nao-contactado`, `contactado`, `respondeu`, `reuniao`,
`fechado`, `perdido` — ver
[cliente-ideal.md §6](./cliente-ideal.md#6-registro-de-estágio-comercial-por-que-ficou-aqui-e-não-num-crm).

**A regra que faz isso funcionar:** marcar **na hora**, não no fim do dia.
Estágio atualizado em lote de memória é estágio errado, e a base passa a mentir
justamente quando você começar a usá-la para decidir.

`perdido` **não é fracasso, é informação.** É o estágio que, contado ao longo de
uma cidade inteira, mostra se o problema está na oferta, no preço ou no perfil
que vocês escolheram abordar.

---

## 4. A lista de clientes ativos

### O que ela é

A lista das clínicas em estágio `fechado`. É o ativo mais valioso do negócio
depois do código — e o mais fácil de usar errado.

```bash
npm run estagio -- --de fechado
```

### O que fazer com ela, na ordem de valor

**1. Renovar antes de vencer.** O piloto é de 30 dias e não há fidelidade. Marque
uma conversa no dia 25 de cada ciclo, com o relatório do mês na mão. Cliente que
cancela quase nunca avisa antes — ele só para de responder.

**2. Pedir avaliação no fim do primeiro piloto.** É o único momento em que existe
um número novo para mostrar, e a avaliação sai com conteúdo em vez de elogio
genérico. Ver [gmn.md §2](./gmn.md#2-avaliações).

**3. Pedir indicação, no mesmo momento.** Dona de clínica conhece dona de
clínica. É o canal mais barato que existe e o único que não depende de anúncio.

**4. Virar prova social** — com autorização por escrito. Ver
[conteudo.md §4](./conteudo.md#4-prova-social-o-que-entra-no-site).

**5. Só então, público semelhante em anúncio.** É o item de menor prioridade e o
de maior risco, e tem seção própria abaixo.

### O que **não** fazer

- **Não misture a lista de clientes com a base de prospecção.** São coisas com
  regras diferentes: a base de prospecção é dado público coletado do Maps; a
  lista de clientes contém dado que a pessoa entregou a vocês numa relação
  comercial. Confundir as duas é como o vazamento começa.
- **Não use dado de paciente da clínica para nada.** Vocês são operadores; a
  clínica é controladora. Isso está no contrato e está dito em `/clinicas`.

---

## 5. Público semelhante: só com base legal e consentimento

Plataformas de anúncio permitem subir uma lista de contatos e pedir um público
parecido com ela. **Isso é tratamento de dado pessoal**, e há duas condições
antes de qualquer upload.

### As duas condições

**1. Base legal.** Sob a LGPD, enviar dado de um cliente a uma plataforma de
publicidade não é coberto pela execução do contrato que vocês têm com ele — não é
necessário para prestar o serviço. A base aplicável na prática é o
**consentimento**, e consentimento precisa ser **específico**: "aceito receber
comunicações" não cobre "meu contato vai para o Facebook virar público
semelhante".

**2. Consentimento coletado e guardado.** Uma frase no contrato, num campo
separado, dizendo exatamente isso, com opção de recusar sem perder nada. E
guardado de forma que dê para provar depois — é de quem trata o dado o ônus de
demonstrar que houve consentimento.

### O que fazer na prática

- **Peça no contrato**, num item separado e opcional. Quem não marcar, não entra
  na lista. Ponto.
- **Mantenha uma lista de quem consentiu**, separada da lista de clientes. São
  conjuntos diferentes, e tratá-los como o mesmo é o erro.
- **Respeite a revogação.** Consentimento se retira a qualquer momento e a
  retirada tem que remover a pessoa da lista na plataforma, não só do seu arquivo.
- **Nunca suba a base de prospecção.** Ela é de dado público coletado do Maps,
  as clínicas nunca falaram com vocês, e não há consentimento nenhum. Subir isso
  é o pior uso possível dessa base.

### Uma alternativa que não depende de nada disso

Público semelhante construído a partir de **quem visitou o site** ou **interagiu
com o Instagram** não exige subir lista de cliente nenhuma. Dá menos precisão,
mas resolve o problema de partida sem tocar em dado de cliente — e não exige
consentimento específico da mesma forma, embora ainda exija aviso de cookies.

Para isso, o pré-requisito é medição instalada. Ver
[docs/medicao.md](./medicao.md) e [docs/trafego.md](./trafego.md).

**Enquanto a lista de clientes for pequena**, essa discussão é teórica: as
plataformas exigem algumas centenas de contatos para gerar um público
semelhante utilizável. Com menos que isso, o upload não produz público — só
produz o risco.
