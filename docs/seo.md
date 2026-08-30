# SEO e descoberta

O que foi feito nesta frente, o que cada página persegue na busca, e o passo a
passo para ligar o Search Console.

> **Estado em 30/08/2026.** O site está com `Disallow: /` no `robots.txt`, de
> propósito, e o domínio próprio não existe. Nada abaixo funciona antes desses
> dois pontos serem resolvidos — a ordem está em
> [docs/operacao-site.md §7](./operacao-site.md#7-ordem-de-ligação-antes-do-lançamento).

---

## 1. O que entrou

| arquivo | o que é |
| --- | --- |
| `site/robots.txt` | mantém o bloqueio e passa a declarar o sitemap |
| `site/sitemap.xml` | as **cinco** páginas, em URL sem extensão |
| `site/llms.txt` | resumo do negócio para modelos de linguagem |
| cada `.html` | `description` de 140–160, `canonical`, Open Graph completo |
| `site/index.html` | JSON-LD `ProfessionalService` |

### Três decisões que valem explicação

**O sitemap tem cinco páginas, não duas.** O pedido falava em duas landings, mas
o site passou a ter cinco no commit *"Site vira uma empresa só"*. Deixar três de
fora derrotaria o propósito do arquivo — e `/calculadora` é justamente o destino
do link da bio, a página com maior chance de ser encontrada por busca.

**Sem `<lastmod>` no sitemap.** Data de alteração só ajuda se for verdadeira, e
mantida à mão ela envelhece no primeiro commit que alguém esquecer de refletir.
Buscador que confere e vê `lastmod` mentindo passa a ignorar o campo no site
inteiro; sem o campo, ele usa a data que observa, que é sempre correta. Se um dia
a geração do sitemap virar automática, o `lastmod` volta. `priority` e
`changefreq` ficaram de fora porque o Google declara publicamente que os ignora.

**Sem `og:image`.** Não existe arte no projeto. Apontar para uma imagem
inexistente deixa a prévia de link **quebrada**, o que é pior que ausente — o
WhatsApp e o LinkedIn mostram um retângulo cinza em vez de nenhum. Entra quando
houver arte; é uma linha por página.

---

## 2. Palavras-chave por página

As três páginas internas atendem intenções **opostas**, e é por isso que elas
não podem competir pelos mesmos termos. Quem procura "reduzir faltas na clínica"
é dono de negócio com problema de operação; quem procura "quanto cobrar" é
profissional decidindo preço. A mesma página não serve os dois.

> **Volume e dificuldade ficaram como variável.** Não tenho ferramenta de
> palavra-chave conectada e não vou escrever número que não medi. Preencha as
> colunas com o Planejador de Palavras-chave do Google Ads ou equivalente antes
> de decidir prioridade.

### `/clinicas` — dona de clínica com problema de agenda

Intenção: **resolver um problema de operação que custa dinheiro todo mês.** Ela
não procura "software"; procura o sintoma.

| termo alvo | tipo | volume | dificuldade |
| --- | --- | --- | --- |
| como reduzir faltas na clínica de estética | principal, cauda longa | `[medir]` | `[medir]` |
| confirmação de consulta automática por WhatsApp | principal | `[medir]` | `[medir]` |
| lembrete de agendamento automático WhatsApp clínica | secundário | `[medir]` | `[medir]` |
| paciente que não aparece na consulta o que fazer | sintoma | `[medir]` | `[medir]` |
| sistema de fila de espera para clínica | secundário | `[medir]` | `[medir]` |
| como fazer paciente voltar clínica de estética | recompra | `[medir]` | `[medir]` |

O termo do jargão — *no-show* — está no texto da página e é o que **você** usa
para falar do problema; não é necessariamente o que a dona da clínica digita. Se
o volume confirmar isso, ele deve viver no corpo do texto e não no `<title>`.

### `/enfermeiras` — enfermeira procurando ferramenta

Intenção: **decidir**, não comprar. As duas dúvidas que a própria página nomeia
("quanto cobrar" e "o que posso fazer") são, elas mesmas, os termos de busca.

| termo alvo | tipo | volume | dificuldade |
| --- | --- | --- | --- |
| quanto cobrar enfermagem estética | principal | `[medir]` | `[medir]` |
| o que o enfermeiro pode fazer em estética | principal | `[medir]` | `[medir]` |
| enfermeira pode aplicar botox | específico, alto interesse | `[medir]` | `[medir]` |
| como precificar procedimento estético | secundário | `[medir]` | `[medir]` |
| enfermagem estética por onde começar | topo | `[medir]` | `[medir]` |

**Cuidado com o segundo e o terceiro.** A página promete um "mapa do que é
permitido" que **ainda não existe**, e as duas landings dizem que ela não
substitui orientação do COREN. Perseguir esses termos antes de o mapa existir
traz visita para uma promessa não cumprida. Enquanto isso, o termo que a página
de fato atende é o de preço.

### `/calculadora` — a ferramenta em si

Intenção: **usar agora.** É a página com maior chance real de posicionar, porque
entrega o que o termo pede na hora, sem cadastro.

| termo alvo | tipo | volume | dificuldade |
| --- | --- | --- | --- |
| calculadora de preço procedimento estético | principal | `[medir]` | `[medir]` |
| como calcular o preço de um procedimento | principal | `[medir]` | `[medir]` |
| ponto de equilíbrio clínica de estética | específico | `[medir]` | `[medir]` |
| planilha de precificação estética | concorrente de formato | `[medir]` | `[medir]` |

O último é o mais interessante: quem procura *planilha* aceitaria uma
calculadora que já faz a conta. É a busca em que o formato do site ganha do
formato procurado.

### `/especialistas` — enfermeira com título e casos

Intenção: **quase nenhuma busca.** Ninguém digita "quero co-produzir conteúdo".
Esta página é destino de abordagem direta e de link em mensagem, não de busca
orgânica. Ela precisa de `title`, `description` e Open Graph corretos — que
agora tem — porque o que importa é como ela aparece **quando o link é colado numa
conversa**, não no Google.

Não invista em conteúdo de busca para ela.

### `/` — a home

Intenção: **navegacional e de marca.** Quem chega aqui por busca já ouviu o nome
em algum lugar. O trabalho dela é ser a página que o Google mostra quando alguém
procura a marca, e distribuir para as três portas.

Termos: a marca definitiva (hoje provisória) e variações com erro de digitação.
Não faz sentido perseguir termo genérico aqui.

---

## 3. Conectar o Search Console

**Não faça isto antes de o domínio existir e o `robots.txt` liberar.** Verificar
uma propriedade com `Disallow: /` só produz um painel dizendo que nada foi
indexado, o que não ensina nada.

1. **Escolha o tipo de propriedade.** Prefira **domínio**
   (`EXEMPLO-DOMINIO.com.br`) e não prefixo de URL. Propriedade de domínio cobre
   `http`, `https`, `www` e todos os subdomínios de uma vez; a de prefixo cobre
   uma variação só e você acaba com quatro propriedades e um relatório partido.
2. **Verifique por DNS.** A propriedade de domínio só aceita esse método: o
   Console dá um registro `TXT`, você adiciona no registrador e confirma.
   **Não apague esse registro depois** — a verificação é reconferida
   periodicamente e some se o TXT sumir.
3. **Envie o sitemap.** *Sitemaps* → `https://EXEMPLO-DOMINIO.com.br/sitemap.xml`.
   Ele já está declarado no `robots.txt`, mas o envio manual é o que dá a você a
   tela de erro quando algo estiver malformado.
4. **Confira o `robots.txt`.** *Configurações* → *robots.txt*. Se ainda aparecer
   `Disallow: /`, pare aqui: nada será indexado e todo o resto do painel vai
   mentir para você.
5. **Peça indexação das cinco URLs.** *Inspeção de URL*, uma por vez, botão
   *Solicitar indexação*. É lento e limitado por dia, mas para cinco páginas é o
   caminho mais rápido do zero.
6. **Espere.** Indexação inicial leva de dias a semanas. Não republique o site
   todo dia achando que ajuda — não ajuda.
7. **Ligue ao Google Ads** se e quando houver tráfego pago, para os relatórios
   conversarem. Ver [docs/trafego.md](./trafego.md).

---

## 4. Erros de cobertura: o que cada um quer dizer

O relatório de *Páginas* separa **indexada** de **não indexada**, e o motivo
importa mais que o número. Os que você tem chance real de ver, dado como este
site é feito:

| o que o Console diz | o que é | o que fazer |
| --- | --- | --- |
| **Bloqueada pelo robots.txt** | o `Disallow: /` ainda está lá | é o estado atual e está **correto** até o lançamento. Depois disso, vira defeito: siga o passo 4 do robots.txt |
| **Excluída por tag "noindex"** | alguma página tem `robots: noindex` | as cinco estão com `index,follow`. Se aparecer, alguém editou uma delas |
| **Rastreada, no momento não indexada** | o Google viu e escolheu não indexar | **não é erro** e não se resolve reenviando. Quer dizer que a página não pareceu valer um lugar no índice. Costuma atingir páginas finas — aqui, o candidato natural é `/especialistas`. A resposta é conteúdo, não configuração |
| **Descoberta, no momento não indexada** | conheceu a URL e nem rastreou | fila. Se persistir por semanas em site de cinco páginas, o problema é autoridade do domínio, não técnico |
| **Página com redirecionamento** | a URL do sitemap redireciona | sintoma de sitemap com `.html` enquanto o host usa `cleanUrls`. É o erro que o formato escolhido aqui evita de propósito |
| **Erro de servidor (5xx)** | host fora na hora do rastreio | cruze com o monitor de uptime ([operacao-site.md §2](./operacao-site.md#2-monitor-de-uptime)). Se o monitor não viu nada, foi pontual |
| **Not found (404)** | link para página que não existe | conferir os links cruzados entre as cinco páginas |
| **Duplicada, o Google escolheu um canônico diferente** | duas URLs com o mesmo conteúdo | o `canonical` de cada página aponta para a versão sem extensão. Se aparecer, é o host servindo `/clinicas` e `/clinicas.html` como páginas distintas |

**Sobre os dados estruturados:** o relatório de aprimoramentos pode acusar
*campos recomendados ausentes* (`address`, `telephone`, `image`) no
`ProfessionalService`. **Isso é aviso, não erro,** e é deliberado: não existe
endereço publicado, o telefone é placeholder e não há imagem. A consequência real
é a página não disputar os resultados enriquecidos de negócio local — o que já
seria verdade de qualquer forma, porque não há ficha de negócio local ligada a
ela. Ver [docs/gmn.md](./gmn.md).

**O que nunca fazer para calar um aviso:** preencher `address`, `telephone`,
`aggregateRating` ou `review` com dado que não existe. Avaliação inventada em
dado estruturado é a violação que o Google pune com remoção manual, e é
verificável por qualquer pessoa.

---

## 5. Quando o domínio existir

O placeholder é `EXEMPLO-DOMINIO.com.br`, em maiúsculas de propósito: é
impossível confundir com domínio real numa busca de texto.

**Dez arquivos, 35 ocorrências.** Confira o número antes e depois:

```bash
grep -rc "EXEMPLO-DOMINIO" site/ docs/ | grep -v ":0"
```

| arquivo | ocorrências | onde |
| --- | --- | --- |
| `site/index.html` | 6 | canonical, `og:url`, e 4 no JSON-LD |
| `site/sitemap.xml` | 6 | 5 `<loc>` e 1 no comentário |
| `site/llms.txt` | 5 | as cinco páginas |
| `site/clinicas.html` | 2 | canonical, `og:url` |
| `site/enfermeiras.html` | 2 | canonical, `og:url` |
| `site/especialistas.html` | 2 | canonical, `og:url` |
| `site/calculadora.html` | 2 | canonical, `og:url` |
| `site/robots.txt` | 2 | linha `Sitemap:` e 1 no comentário |
| `docs/operacao-site.md` | 1 | tabela de estado |
| `docs/seo.md` | 7 | **este arquivo**: os exemplos do §3 e os comandos logo abaixo |

A última linha não é detalhe: se você trocar só o `site/`, o comando de
conferência abaixo nunca sai vazio e você fica procurando um placeholder
esquecido que é este parágrafo. Troque em `site/` e `docs/` juntos.

Troca de uma vez só, conferindo o resultado:

```bash
grep -rl "EXEMPLO-DOMINIO.com.br" site/ docs/ \
  | xargs sed -i 's/EXEMPLO-DOMINIO\.com\.br/SEU-DOMINIO-REAL.com.br/g'
grep -rc "EXEMPLO-DOMINIO" site/ docs/ | grep -v ":0"   # tem que sair vazio
```

**Depois de trocar, e antes de considerar feito:**

- [ ] Abrir cada página e conferir que o `canonical` bate com a URL da barra de
      endereço. Canonical apontando para outro domínio despublica a página do
      índice — é o erro mais caro desta lista inteira.
- [ ] Conferir se o domínio final tem `www` ou não, e usar **a mesma forma** em
      todos os nove arquivos. Metade com `www` e metade sem é conteúdo duplicado.
- [ ] Colar cada URL num WhatsApp e ver a prévia. Sem `og:image` ela sai só com
      título e descrição — é o esperado.
- [ ] Só então liberar o `robots.txt` e enviar o sitemap.

---

## 6. O que ainda falta, e não foi feito aqui

- **`og:image`** — depende de existir arte. Uma imagem 1200×630 por página, ou
  uma só para o site inteiro.
- **Conteúdo que responde às buscas do §2.** As páginas hoje vendem; elas não
  respondem à pergunta que a pessoa digitou. Isso é trabalho de conteúdo, não de
  configuração, e está em [docs/conteudo.md](./conteudo.md).
- **Medir volume e dificuldade** dos termos marcados `[medir]`.
- **Decidir a marca definitiva antes de indexar.** Marca indexada é muito mais
  cara de trocar do que marca não indexada.
