/**
 * Social Journal: textos de orientação que continuam úteis daqui a anos.
 *
 * Sem data de publicação de propósito. Uma data falsa seria mentira, e uma
 * verdadeira faz o texto parecer velho em seis meses, mesmo continuando
 * certo. Para publicar um artigo novo, acrescente um objeto a esta lista.
 */
export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "h2"; texto: string }
  | { tipo: "lista"; itens: string[] };

export type Artigo = {
  slug: string;
  titulo: string;
  resumo: string;
  tema: string;
  corpo: Bloco[];
  /** Ids do catálogo que fazem sentido ao fim do texto. */
  produtos: string[];
  /** Link interno de apoio, quando houver. */
  apoio?: { texto: string; href: string };
};

export const ARTIGOS: Artigo[] = [
  {
    slug: "como-escolher-o-tamanho-ideal",
    titulo: "Como escolher o tamanho ideal",
    tema: "Caimento",
    resumo:
      "Quatro medidas, uma fita métrica e alguns sinais no espelho que mostram se a peça está certa.",
    produtos: ["sm-camisa-poliamida", "sm-camisa-bambu"],
    apoio: { texto: "Abrir o guia de tamanhos", href: "/guia-de-tamanhos/" },
    corpo: [
      {
        tipo: "p",
        texto:
          "Tamanho certo é a diferença entre uma roupa que veste e uma que só cabe. A etiqueta ajuda, mas cada marca tem a sua modelagem. Por isso vale começar pelas suas medidas, e não pelo número que você costuma usar.",
      },
      { tipo: "h2", texto: "Antes de medir" },
      {
        tipo: "lista",
        itens: [
          "Use fita métrica de costura, não trena.",
          "Meça sobre roupa leve, sem casaco.",
          "Deixe a fita encostar no corpo sem apertar.",
          "Peça ajuda: medir as costas e a manga sozinho é difícil.",
        ],
      },
      { tipo: "h2", texto: "Na camisa social" },
      {
        tipo: "p",
        texto:
          "O ombro manda. A costura do ombro deve cair exatamente no fim do ombro, nem antes, nem depois. Se o ombro estiver certo, o restante quase sempre se resolve com ajuste.",
      },
      {
        tipo: "lista",
        itens: [
          "Gola: fechada, deve passar um dedo entre ela e o pescoço.",
          "Peito: os botões não podem repuxar formando um X.",
          "Manga: termina no osso do pulso, com o braço esticado.",
          "Comprimento: dentro da calça, não pode sair quando você levanta os braços.",
        ],
      },
      { tipo: "h2", texto: "No terno e no blazer" },
      {
        tipo: "p",
        texto:
          "Abotoado, o paletó deve fechar sem formar vincos na altura do botão. A manga mostra cerca de um dedo da camisa. A calça pode ser ajustada na barra e na cintura, o ombro do paletó não. Se precisar escolher entre dois tamanhos, escolha pelo ombro.",
      },
      { tipo: "h2", texto: "Para elas" },
      {
        tipo: "p",
        texto:
          "Nas peças femininas as medidas mais importantes são busto, cintura e quadril. Em vestidos e saias, o comprimento também conta: meça do ombro ou da cintura até onde a peça deve terminar. Leve essas medidas para a loja e prove mais de um tamanho quando a modelagem for diferente da que você conhece.",
      },
      {
        tipo: "p",
        texto:
          "Ficou entre dois tamanhos? Mande as medidas para a loja pelo WhatsApp. A equipe compara com a modelagem da peça antes de você sair de casa.",
      },
    ],
  },
  {
    slug: "como-combinar-cores",
    titulo: "Como combinar cores no social",
    tema: "Estilo",
    resumo:
      "Uma regra simples para acertar terno, camisa e gravata, e as combinações que funcionam quase sempre.",
    produtos: ["sm-camisa-bambu", "sm-terno"],
    corpo: [
      {
        tipo: "p",
        texto:
          "No social, a cor organiza o visual. Uma regra resolve a maior parte das dúvidas: a peça maior é a mais neutra, e a cor entra nas peças menores.",
      },
      { tipo: "h2", texto: "Comece pelo terno" },
      {
        tipo: "p",
        texto:
          "Marinho, cinza e preto são as bases mais versáteis. O marinho funciona de dia e de noite. O cinza vai bem no trabalho. O preto é o mais formal e combina com eventos à noite.",
      },
      { tipo: "h2", texto: "Depois a camisa" },
      {
        tipo: "lista",
        itens: [
          "Branca: combina com qualquer terno e qualquer ocasião.",
          "Azul-clara: a segunda mais versátil, ótima para o trabalho.",
          "Cinza-clara e lilás: mais suaves, ficam bem com marinho e cinza-chumbo.",
          "Vinho e rosa: dão personalidade, melhores à noite ou sem gravata.",
          "Preta: com terno escuro e sem gravata, para um visual noturno.",
        ],
      },
      { tipo: "h2", texto: "Por último, os detalhes" },
      {
        tipo: "p",
        texto:
          "Gravata, lenço e meia são onde a cor pode aparecer mais. Uma gravata deve ser mais escura que a camisa. Sapato e cinto ficam na mesma cor: preto com preto, marrom com marrom.",
      },
      { tipo: "h2", texto: "Combinações que quase nunca falham" },
      {
        tipo: "lista",
        itens: [
          "Terno marinho, camisa branca, gravata vinho.",
          "Terno cinza, camisa azul-clara, gravata marinho.",
          "Blazer xadrez cinza, camisa azul-clara, sem gravata.",
          "Terno escuro, camisa vinho, primeiro botão aberto.",
        ],
      },
      {
        tipo: "p",
        texto:
          "No visual feminino a lógica é parecida: uma base neutra, como preto, off-white ou marinho, e a cor nas peças de destaque ou nos acessórios.",
      },
    ],
  },
  {
    slug: "diferencas-entre-trajes",
    titulo: "Esporte fino, passeio e passeio completo",
    tema: "Ocasiões",
    resumo:
      "O que cada traje do convite pede, para chegar vestido do jeito certo.",
    produtos: ["sm-terno", "sm-blazer-xadrez", "sm-camisa-poliamida"],
    corpo: [
      {
        tipo: "p",
        texto:
          "Quando o convite indica o traje, ele está dizendo o grau de formalidade da festa. As nomenclaturas variam um pouco de região para região, mas a ideia geral é esta.",
      },
      { tipo: "h2", texto: "Esporte fino" },
      {
        tipo: "p",
        texto:
          "É o mais flexível. Para eles, calça social ou de sarja com camisa, e blazer opcional. Gravata não é obrigatória. Para elas, vestidos e conjuntos mais leves, sem a exigência de tecidos de festa.",
      },
      { tipo: "h2", texto: "Passeio ou social" },
      {
        tipo: "p",
        texto:
          "Pede terno, que pode ser de cor mais clara se o evento for de dia. Gravata é recomendada. Para elas, vestidos de comprimento médio ou conjuntos de alfaiataria.",
      },
      { tipo: "h2", texto: "Passeio completo" },
      {
        tipo: "p",
        texto:
          "Terno escuro, camisa clara e gravata. É o traje mais comum em casamentos à noite e em formaturas. Para elas, vestidos longos ou tecidos mais nobres.",
      },
      { tipo: "h2", texto: "Black tie" },
      {
        tipo: "p",
        texto:
          "O mais formal: smoking para eles e vestido longo para elas. É raro, e o convite costuma deixar claro.",
      },
      {
        tipo: "p",
        texto:
          "Se o convite não indicar nada, considere o horário e o local. Evento à noite e em salão pede mais formalidade do que almoço ao ar livre. Na dúvida, chegar um pouco mais arrumado é melhor do que o contrário.",
      },
    ],
  },
  {
    slug: "como-cuidar-das-pecas",
    titulo: "Como cuidar das suas peças",
    tema: "Cuidados",
    resumo:
      "Lavar, secar, guardar e passar: os cuidados que fazem camisa e terno durarem muito mais.",
    produtos: ["sm-camisa-poliamida", "sm-camisa-bambu"],
    corpo: [
      {
        tipo: "p",
        texto:
          "Roupa social bem cuidada dura anos. A primeira regra vale para qualquer peça: leia a etiqueta. Ela traz a temperatura de lavagem e o que o tecido aceita.",
      },
      { tipo: "h2", texto: "Camisas" },
      {
        tipo: "lista",
        itens: [
          "Lave do avesso e com os botões abertos, inclusive os do colarinho e dos punhos.",
          "Separe as claras das escuras.",
          "Evite secadora quando a etiqueta não indicar. O calor encolhe e desgasta.",
          "Seque no cabide: a camisa já seca quase sem marcas e precisa de menos ferro.",
        ],
      },
      { tipo: "h2", texto: "Ternos e blazers" },
      {
        tipo: "lista",
        itens: [
          "Não lave o paletó a cada uso. Areje por uma noite antes de guardar.",
          "Use cabide largo, que acompanhe o formato do ombro.",
          "Tire tudo dos bolsos antes de pendurar.",
          "Para limpeza completa, siga a etiqueta. Muitos tecidos pedem lavagem a seco.",
        ],
      },
      { tipo: "h2", texto: "Guardar" },
      {
        tipo: "p",
        texto:
          "Dê espaço no armário. Peça apertada amassa e marca. Capa de tecido protege do pó sem abafar, e plástico de lavanderia não deve ficar na peça por muito tempo.",
      },
      { tipo: "h2", texto: "Passar" },
      {
        tipo: "p",
        texto:
          "Passe a camisa ainda um pouco úmida, começando pelo colarinho, depois punhos, mangas e corpo. No terno, use um pano entre o ferro e o tecido para não deixar brilho. Um vaporizador resolve boa parte das marcas sem encostar na peça.",
      },
    ],
  },
  {
    slug: "looks-para-eventos",
    titulo: "Looks para cada tipo de evento",
    tema: "Ocasiões",
    resumo:
      "Casamento de dia, formatura, jantar de empresa: o que vestir em cada um, sem errar o tom.",
    produtos: ["sm-terno", "sm-camisa-bambu", "sm-blazer-xadrez"],
    apoio: { texto: "Ver as ocasiões", href: "/ocasioes/casamentos/" },
    corpo: [
      {
        tipo: "p",
        texto:
          "Cada evento tem um código, mesmo quando o convite não fala nada. O horário, o local e quem convidou dizem muito sobre o que vestir.",
      },
      { tipo: "h2", texto: "Casamento de dia" },
      {
        tipo: "p",
        texto:
          "Cores mais claras e tecidos leves. Terno cinza-claro, bege ou azul médio com camisa branca ou azul-clara. Para elas, vestidos de comprimento médio e tons suaves.",
      },
      { tipo: "h2", texto: "Casamento à noite" },
      {
        tipo: "p",
        texto:
          "Terno escuro, camisa clara e gravata. Marinho e chumbo são mais versáteis que o preto, que fica bem formal. Para elas, vestidos longos ou midi em tecidos com mais caimento.",
      },
      { tipo: "h2", texto: "Formatura" },
      {
        tipo: "p",
        texto:
          "Para a colação, terno e gravata. Para o baile, dá para manter o terno e trocar a camisa ou tirar a gravata. Prove tudo antes, com o sapato que você vai usar.",
      },
      { tipo: "h2", texto: "Evento de empresa" },
      {
        tipo: "p",
        texto:
          "Premiação e convenção pedem terno. Confraternização costuma aceitar blazer com camisa, sem gravata. Na dúvida, pergunte a quem organiza.",
      },
      { tipo: "h2", texto: "Aniversário e jantar" },
      {
        tipo: "p",
        texto:
          "Mais liberdade. Uma camisa de cor, como vinho ou lilás, com blazer e calça escura. Sem gravata e com o primeiro botão aberto.",
      },
    ],
  },
  {
    slug: "guarda-roupa-versatil",
    titulo: "Como montar um guarda-roupa versátil",
    tema: "Estilo",
    resumo:
      "Poucas peças bem escolhidas que se combinam entre si e cobrem a maior parte das ocasiões.",
    produtos: ["sm-camisa-poliamida", "sm-camisa-bambu", "sm-blazer-xadrez", "sm-terno"],
    corpo: [
      {
        tipo: "p",
        texto:
          "Um guarda-roupa versátil não precisa ser grande. Precisa de peças que conversem entre si, para que cada uma forme vários looks diferentes.",
      },
      { tipo: "h2", texto: "A base masculina" },
      {
        tipo: "lista",
        itens: [
          "Um terno marinho ou cinza, que também funciona separado: o paletó com jeans, a calça com camisa.",
          "Um blazer que não seja do terno, como um xadrez discreto.",
          "Três camisas: branca, azul-clara e uma de cor que você goste.",
          "Duas calças sociais em tons neutros.",
          "Um sapato preto e um marrom, com os cintos correspondentes.",
        ],
      },
      { tipo: "h2", texto: "A base feminina" },
      {
        tipo: "lista",
        itens: [
          "Um blazer de alfaiataria em cor neutra.",
          "Uma calça e uma saia que combinem com esse blazer.",
          "Camisas e blusas em tons claros.",
          "Um vestido que funcione de dia e, com acessórios, à noite.",
        ],
      },
      { tipo: "h2", texto: "Como escolher as próximas peças" },
      {
        tipo: "p",
        texto:
          "Antes de comprar, pense em três combinações possíveis com o que você já tem. Se não encontrar, a peça provavelmente vai ficar parada. Prefira tecidos que aguentam a rotina e cores que se repetem no seu armário.",
      },
      {
        tipo: "p",
        texto:
          "Na loja, vale contar à equipe o que você já tem em casa. Fica mais fácil indicar o que falta, e não o que repete.",
      },
    ],
  },
];

export function artigoPorSlug(slug: string) {
  return ARTIGOS.find((a) => a.slug === slug);
}

/** Minutos de leitura a 200 palavras por minuto, nunca menos de 1. */
export function minutosDeLeitura(artigo: Artigo): number {
  const palavras = artigo.corpo
    .map((b) => (b.tipo === "lista" ? b.itens.join(" ") : b.texto))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}
