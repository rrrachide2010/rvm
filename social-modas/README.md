# Social Modas · site 2.0

Site institucional e comercial permanente da Social Modas: Next.js 16 com
export estático, TypeScript, Tailwind 4 e Motion. Substitui o hotsite de Dia
dos Pais por uma experiência que vale o ano inteiro.

A saída (`out/`) é HTML puro. Ela vai para o Vercel **ao lado** das funções
que já existem em `api/` (catálogo, pedidos, eventos, pagamento e chatbot),
sem tocar nelas.

```bash
npm install
npm run dev         # http://localhost:3000
npm run verificar   # lint + tipos + build + fluxos + contraste (o mesmo que a CI)
```

## O que mudou em relação ao site anterior

| Antes | Agora |
| --- | --- |
| Hotsite de campanha: "Presentes", "o estilo dele", arte de Dia dos Pais, barra de cupom | Nenhuma referência sazonal; nada expira |
| Só moda masculina | Feminino e masculino na navegação; o feminino aparece em texto, sem foto, até a marca enviar material |
| Fundo quase preto, dourado e marsala | Ivory, grafite e o Bordeaux `#570B18` do site anterior como assinatura |
| "27 anos", "quase 6 mil seguidores", "+25 vendidos" | "Mais de 25 anos" (continua verdade em 2030); números que envelhecem saíram |
| Fotos geradas por IA na parte editorial | Só fotos reais da marca (photobook, loja, equipe, fachada) |
| 2 páginas + painel | 30 páginas: coleções, 4 produtos, 6 ocasiões, história, lojas, guia de tamanhos, 6 artigos |

Preservado sem alteração: `admin.html`, `dashboard.html`, `pagamento.html`
(com o `styles.css` antigo de que dependem), `produtos.json`, `analytics.js` e
as funções `api/`. O site novo continua mandando `pageview`, `ver_produto` e
`whatsapp_click` para o dashboard, e acrescenta `ir_mercado_livre` e
`consultar_reserva`.

## Onde editar

Conteúdo e dados ficam em `src/data/`, separados dos componentes:

| Arquivo | O que tem |
| --- | --- |
| `public/produtos.json` | Catálogo. É o mesmo arquivo da API e do painel. |
| `src/data/lojas.ts` | Unidades. **Só preencha endereço, horário e WhatsApp confirmados.** Campo vazio não aparece. |
| `src/data/colecoes.ts` | Coleções e o filtro de cada uma |
| `src/data/ocasioes.ts` | As 6 ocasiões, com os produtos de cada uma |
| `src/data/looks.ts` | Os looks do "Um look, todas as peças" |
| `src/data/journal.ts` | Os artigos do Social Journal (sem data, de propósito) |
| `src/data/tamanhos.ts` | Guia de tamanhos |
| `src/data/marca.ts` | Contatos, Instagram, interruptor de preços |
| `src/app/globals.css` | Design tokens: cor, tipo, espaço, movimento |

Produto feminino novo: cadastre em `produtos.json` com `"genero": "Feminino"`.
Ele aparece sozinho na coleção Feminino, que hoje mostra o texto "a coleção
feminina está nas lojas".

Peça de categoria nova (calças, acessórios): cadastre os produtos e crie a
coleção em `colecoes.ts`. A home não mostra coleção vazia.

## Publicar

> **Não publique só a pasta `publicacao/`.** Ela não tem as funções `api/`,
> que vivem apenas na pasta original do projeto e no deploy atual. Um deploy
> sem elas apaga o catálogo dinâmico, os pedidos, o analytics e o chatbot.

1. `npm run build && npm run publicacao`.
2. Faça uma cópia da pasta original do projeto (a que tem `api/` e foi usada
   nos deploys anteriores). Nela, apague os arquivos antigos do site (`index.html`,
   `venda.html`, `script.js`, `catalogo.js`, `carrinho.js`, `campanha.js`,
   `robots.txt`, `sitemap.xml`) e copie para lá todo o conteúdo de
   `publicacao/`. **Mantenha `api/` e `package.json`.**
3. `vercel` para um deploy de **preview**. Confira o link: home, um produto,
   a reserva no WhatsApp, `/admin.html`, `/dashboard.html` e
   `/api/produtos`.
4. Só então `vercel --prod`.

O `vercel.json` gerado redireciona `/venda.html` para `/colecoes/`, força a
barra final e define cache longo para os arquivos com hash.

## Verificações

| Comando | O que garante |
| --- | --- |
| `npm run lint`, `npm run typecheck` | ESLint do Next e TypeScript estrito |
| `npm run build` | Gera as fotos em WebP (480 a 1440 px) e o export. **Falha** se o código citar foto que não existe. |
| `npm test` | 21 verificações de fluxo no Chromium: reserva no WhatsApp certo com peça, cor e tamanho; busca de loja sem acento; abas no teclado; looks; menu móvel (abre, Esc, foco, troca de página); site inteiro sem JavaScript |
| `npm run contraste` | Todo texto renderizado contra o fundo real, WCAG AA, em 12 rotas, no desktop e no celular. Já foi testado com um defeito plantado: reprovou 216 textos. |

## Decisões que valem saber

- **Playfair Display, não Cormorant.** A Cormorant tem o circunflexo alto e
  solto do corpo da letra; em português ele aparece em todo "você", "três" e
  "também" de título.
- **Taupe e Sand nunca são texto.** Taupe dá 2,78:1 sobre ivory. Para rótulos
  existe o `taupe-ink` (5,73:1).
- **O Motion só carrega onde anima** (ocasiões, looks, galeria). O cabeçalho
  usa CSS: com a biblioteca ele custaria ~43 KB em todas as páginas.
- **A cor do produto na URL (`?cor=Vinho`) é lida depois da hidratação.**
  Com `useSearchParams`, o export estático tiraria a página de produto
  inteira do HTML.
- **Grids com `grid-cols-1` no celular.** Sem isso, um texto truncado estica
  a coluna e a página ganha rolagem lateral.
- **Revelação ao rolar só esconde com JS ativo.** Sem JavaScript, nada fica
  invisível.

## Pendências que dependem da marca

- **Moda feminina:** fotos e produtos reais. Até lá, o feminino é tipográfico.
- **Lojas:** endereço, horário e WhatsApp de cada unidade. Hoje só Mairinque
  tem endereço publicado; Boituva, Votorantim, São Roque e Piedade aparecem
  com o atendimento central.
- **Tabela de tamanhos:** a tabela publicada usa 44 a 56, e as camisas são
  vendidas de 1 a 6. Falta a conversão oficial. Não há tabela feminina.
- **Bordeaux oficial:** sem manual de marca no projeto; foi usado o `#570B18`
  do site anterior. Trocar é mudar um token em `globals.css`.
- **Preços:** alinhados ao Mercado Livre pela marca em julho de 2026. Se
  deixarem de ser conferidos, `mostrarPrecos: false` em `marca.ts`.
- **Políticas e dados institucionais** (CNPJ, trocas, privacidade): não
  existiam no site anterior e não foram inventados.
