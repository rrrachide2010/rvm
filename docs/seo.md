# SEO e descoberta

O que existe hoje no site para ser encontrado, o que está desligado de propósito,
e o que fazer no dia do lançamento.

> **O site está com indexação bloqueada.** Isso é intencional, não é pendência
> esquecida. Ler a seção "O interruptor" antes de mexer em qualquer coisa aqui.

---

## O interruptor

O contato do site é placeholder: `wa.me/5500000000000` e `contato@exemplo.com.br`.
Enquanto for assim, ser achado no Google é pior que não ser achado — uma dona de
clínica que pesquisa "no-show clínica estética", encontra a página, clica no
WhatsApp e cai num número que não existe some para sempre, e ainda fica com a
impressão de que o negócio não é sério.

Por isso o bloqueio tem **duas camadas**, e as duas precisam mudar juntas:

| camada | arquivo | estado hoje | no lançamento |
| --- | --- | --- | --- |
| rastreio | `site/robots.txt` | `Disallow: /` | apagar o bloco e descomentar o de baixo |
| indexação | as três páginas | `<meta name="robots" content="noindex,nofollow">` | trocar por `index,follow` |

**Por que duas camadas, e não uma.** `Disallow: /` impede o Google de *ler* a
página, mas não impede que a URL apareça no resultado — se alguém linkar o site
de fora, o Google pode listar o endereço sem título nem descrição, porque nunca
entrou para ver. Quem tira de vez do índice é o `noindex`. E o `noindex` só é
lido por quem entra na página.

Ou seja: as duas camadas juntas são cinto e suspensório, mas com uma contradição
conhecida — enquanto o `Disallow` estiver ligado, ninguém lê o `noindex`. Na
prática, para um site que ainda não foi divulgado em lugar nenhum, isso basta.
Se em algum momento o endereço vazar antes do lançamento (num print, num story,
num teste de anúncio), **tire o `Disallow` e deixe só o `noindex`** — é a
configuração que de fato mantém fora do índice um site que já tem link apontando.

Antes deste PR as três páginas diziam `index,follow` enquanto o `robots.txt`
bloqueava tudo. As duas camadas discordavam por escrito; agora concordam.

---

## Palavras-chave por página

As três páginas atendem **intenções diferentes** e não devem competir entre si.
Se duas páginas disputarem o mesmo termo, o Google escolhe uma — em geral a
errada.

### `index.html` — dono de clínica com problema de agenda

Quem busca aqui **já tem a clínica** e já sente a dor. Não busca "automação": busca
o sintoma. Esse é o ponto mais importante desta seção — o termo técnico é o nosso,
não o dele.

| termo | intenção | por quê |
| --- | --- | --- |
| como diminuir falta de cliente clínica estética | o sintoma, com a solução implícita | é o jeito que a dona descreve a dor |
| cliente não aparece na consulta o que fazer | o sintoma puro | volume menor, intenção altíssima |
| confirmação de consulta automática whatsapp | solução, já sabe o que quer | mais competido, mais perto da compra |
| sistema para agenda de clínica de estética | categoria | competido; disputa com software de gestão |
| como aumentar retorno de cliente estética | recompra | conecta com a rotina de retorno programado |

**Não perseguir:** "software de gestão para clínica", "prontuário eletrônico". São
outra categoria, com concorrente grande e orçamento grande, e quem busca isso quer
trocar de sistema — exatamente o que a página promete que você **não** faz.

### `enfermeiras.html` — enfermeira procurando ferramenta

Intenção oposta: quem busca aqui **não tem clínica**, está começando, e o
problema é decisão, não operação.

| termo | intenção | por quê |
| --- | --- | --- |
| quanto cobrar procedimento estética enfermeira | preço, decisão travada | é a dúvida nº 1 e leva direto à calculadora |
| enfermeira pode aplicar botox | permissão | volume alto; ainda sem página que responda |
| o que enfermeira pode fazer em estética coren | permissão, mais amplo | é o "mapa do que é permitido", ainda não publicado |
| como começar na enfermagem estética | orientação geral | topo, volume alto, conversão baixa |

### `calculadora.html` — quem quer a conta agora

| termo | intenção | por quê |
| --- | --- | --- |
| calculadora precificação procedimento estético | ferramenta, agora | intenção máxima; a página entrega exatamente isso |
| como calcular preço de procedimento estético | método | quem quer aprender a conta, não só o número |
| planilha precificação estética | ferramenta, formato errado | busca planilha e acha ferramenta melhor — vale disputar |

**Esta é a página com maior chance de rankear primeiro,** e a razão não é SEO: é
que ela resolve o problema na hora, sem cadastro. Ferramenta gratuita ganha link
espontâneo, e link espontâneo é o que o Google mede quando não tem histórico.

### O conflito a vigiar

`enfermeiras.html` e `calculadora.html` disputam "precificação". Hoje a divisão é:
`enfermeiras` fala **de** precificação (contexto, o que vem depois),
`calculadora` **faz** a precificação. Se a `enfermeiras` começar a explicar o
método, as duas passam a competir. Mantenha a explicação do modelo na calculadora.

---

## Search Console — passo a passo

Fazer **depois** do domínio existir e **depois** de abrir a indexação. Antes
disso, o Console só vai reportar que tudo está bloqueado.

1. **Entrar** em `search.google.com/search-console` com a conta Google que vai
   ser a dona a longo prazo — não uma conta pessoal que você pode perder. Anote
   qual em `docs/operacao-site.md` §5.
2. **Adicionar propriedade** do tipo **Domínio** (não "Prefixo de URL"). A
   verificação é por DNS, um registro TXT no registrador. Cobre `http`, `https`,
   `www` e subdomínios de uma vez — com "Prefixo de URL" você acabaria com quatro
   propriedades para conferir.
3. **Verificar** colando o TXT no registrador. Propaga em minutos, às vezes horas.
4. **Enviar o sitemap** em *Sitemaps* → `sitemap.xml`. Uma vez só; ele é relido
   sozinho.
5. **Solicitar indexação** das três páginas em *Inspeção de URL*. Acelera a
   primeira visita. Não adianta repetir: só a primeira conta.
6. **Esperar.** Dado de desempenho aparece em 2 a 3 dias; cobertura, em até uma
   semana. Não é erro, é como funciona.
7. **Ligar o alerta por e-mail** em *Configurações › Preferências de notificação*.
   É o que transforma o Console em algo que te avisa, em vez de algo que você
   lembra de abrir.

---

## Quando aparecer erro de cobertura

O Console chama de "cobertura" o relatório de quais páginas entraram no índice e
por que as outras não. Num site de três páginas, quase todo erro cai numa destas
linhas:

| o que o Console diz | o que é | o que fazer |
| --- | --- | --- |
| **Bloqueada pelo robots.txt** | o `Disallow: /` continua lá | esperado antes do lançamento; depois dele, é o interruptor pela metade |
| **Excluída por tag "noindex"** | a meta continua `noindex` | mesma coisa: a outra metade do interruptor |
| **Rastreada — não indexada** | leu e decidiu não indexar | não é erro técnico. É o Google dizendo que a página não pareceu valer. Mexa no conteúdo, não no código |
| **Descoberta — não indexada** | conhece a URL e não visitou | site novo sem autoridade. Espera. Se durar mais de um mês, o problema é falta de link apontando para o site |
| **Erro de servidor (5xx)** | o host falhou na hora da visita | conferir o monitor de uptime (`docs/operacao-site.md` §2) — se ele não pegou, ele está mal configurado |
| **Não encontrada (404)** | URL sumiu ou o `cleanUrls` mudou | conferir se `/enfermeiras` e `/calculadora` ainda respondem sem `.html` |
| **Redirecionamento** | canonical apontando para outro lugar | conferir se o placeholder do domínio foi trocado em todos os arquivos da lista abaixo |

**A que mais vai aparecer é "Rastreada — não indexada"**, e ela é a mais mal
interpretada: não há nada a consertar no HTML. Um site de três páginas, sem link
externo apontando e sem histórico, é indexado devagar. A resposta é conteúdo e
link, não meta tag.

---

## O domínio ainda não existe

O placeholder é **`EXEMPLO-DOMINIO.com.br`**, escrito assim de propósito: em
maiúsculas, com hífen e sem parecer um domínio real, para que qualquer busca por
`EXEMPLO-DOMINIO` encontre todas as ocorrências de uma vez.

### Arquivos a trocar quando o domínio existir

Dezesseis ocorrências em seis arquivos do site:

| arquivo | onde | quantas |
| --- | --- | --- |
| `site/index.html` | `canonical`, `og:url`, `url` no JSON-LD | 3 |
| `site/enfermeiras.html` | `canonical`, `og:url` | 2 |
| `site/calculadora.html` | `canonical`, `og:url` | 2 |
| `site/robots.txt` | comentário + linha `Sitemap:` do bloco de lançamento | 2 |
| `site/sitemap.xml` | comentário + os três `<loc>` | 4 |
| `site/llms.txt` | os três links das páginas | 3 |

Fora do site, `docs/seo.md` e `docs/operacao-site.md` também citam o placeholder;
esses são prosa e podem ser atualizados depois, sem pressa.

**Não confie nesta tabela, confie no `grep`.** Ela envelhece a cada arquivo novo
— exatamente como o comentário `<!-- MARCA -->` envelheceu quando a calculadora
entrou. O comando abaixo é a fonte da verdade:

```bash
grep -rn "EXEMPLO-DOMINIO" site/
```

Terminou a troca quando esse comando volta vazio.

### Na mesma passada, decidir

- **`www` ou sem `www`.** Escolher **um** e redirecionar o outro. O canonical
  precisa apontar para o escolhido, ou o Google vê duas versões do mesmo site.
- **Barra no fim.** O `vercel.json` já define `trailingSlash: false` e
  `cleanUrls: true` — por isso as URLs são `/enfermeiras` e não
  `/enfermeiras.html` nem `/enfermeiras/`. Manter a coerência com o canonical.

---

## O que falta, e que não é código

**Imagem de Open Graph.** As três páginas têm `og:title`, `og:description`,
`og:url`, `og:type`, `og:site_name` e `og:locale`, mas **não têm `og:image`** —
porque não existe imagem no repositório e inventar uma referência a arquivo
inexistente é pior que não ter a tag.

Isso importa mais do que parece: sem `og:image`, um link colado no WhatsApp
aparece como um retângulo cinza sem imagem. E o WhatsApp é o canal por onde este
site vai circular. Quando existir, precisa de 1200×630 px, menos de 300 KB, com
o texto legível em miniatura.

**JSON-LD com o mínimo, de propósito.** A `index.html` tem `ProfessionalService`
com `name`, `url`, `description`, `serviceType` e os dois preços que a página já
publica. Ficaram **de fora**, e é intencional:

| campo | por que não está |
| --- | --- |
| `address` | não existe endereço comercial |
| `telephone` | o número da página é placeholder |
| `aggregateRating`, `review` | não há avaliação real; inventar é motivo de penalização manual, além de ser mentira |
| `areaServed` | ninguém decidiu qual é a área de atendimento |
| `openingHours` | não se aplica a serviço remoto |

Sem `address`, o Google não gera resultado local rico — e é assim que deve ser
enquanto não houver endereço. Quando houver decisão sobre área de atendimento,
`areaServed` é o primeiro a entrar; ver `docs/gmn.md`.

**Os preços do JSON-LD duplicam a página.** `R$ 1.200` e `R$ 350` aparecem no
HTML visível e no JSON-LD. Se mudar o preço, mude nos dois — preço divergente
entre o que o Google mostra e o que a página diz é pior que preço nenhum.
