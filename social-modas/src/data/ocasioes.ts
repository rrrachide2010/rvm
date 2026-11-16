/**
 * Ocasiões. Cada uma aponta para produtos reais do catálogo pelo id.
 * As fotos são da própria marca (photobook, loja e clientes) e mostram
 * roupas que servem para a ocasião, sem fingir que foram tiradas nela.
 */
export type Ocasiao = {
  slug: string;
  titulo: string;
  /** Uma linha, no seletor da home. */
  resumo: string;
  /** Parágrafo da página da ocasião. */
  texto: string;
  dicas: string[];
  foto: string;
  fotoAlt: string;
  produtos: string[];
  /** Linha para quem procura moda feminina, enquanto ela não está no site. */
  notaFeminina: string;
};

export const OCASIOES: Ocasiao[] = [
  {
    slug: "trabalho",
    titulo: "Trabalho",
    resumo: "Camisa que chega inteira ao fim do expediente.",
    texto:
      "Para o dia a dia no escritório, o que importa é a peça aguentar a rotina. Tecidos que amassam pouco, cores que combinam entre si e um blazer para quando a reunião pede mais.",
    dicas: [
      "Comece por camisas em cores neutras: branco, azul-claro e cinza combinam com quase tudo.",
      "Um blazer que funcione com calça social e com jeans rende mais do que dois ternos parados.",
      "Prefira tecidos que não amassam se você passa o dia sentado ou dirige até o trabalho.",
    ],
    foto: "/assets/pb-chumbo-2.jpg",
    fotoAlt: "Modelo com camisa social cinza chumbo",
    produtos: ["sm-camisa-poliamida", "sm-camisa-bambu", "sm-blazer-xadrez"],
    notaFeminina: "Também há opções femininas para o trabalho nas lojas.",
  },
  {
    slug: "casamentos",
    titulo: "Casamentos",
    resumo: "Para o noivo, os padrinhos e quem vai celebrar.",
    texto:
      "Casamento é a ocasião em que o caimento mais aparece, nas fotos e ao vivo. Vale escolher com antecedência e provar com calma, para dar tempo de qualquer ajuste.",
    dicas: [
      "Combine o tom do terno com o horário: cores mais claras de dia, mais escuras à noite.",
      "Padrinhos costumam combinar entre si. Leve a referência do casal para a loja.",
      "Prove a camisa com o paletó. A manga da camisa deve aparecer um dedo abaixo da manga do paletó.",
    ],
    foto: "/assets/foto-quem-somos.jpg",
    fotoAlt: "Dois homens de terno azul e gravata rosa",
    produtos: ["sm-terno", "sm-camisa-poliamida", "sm-blazer-xadrez"],
    notaFeminina: "Convidadas também encontram opções femininas nas lojas.",
  },
  {
    slug: "formaturas",
    titulo: "Formaturas",
    resumo: "Da colação ao baile, com as fotos que ficam.",
    texto:
      "Na formatura o visual aparece em foto o tempo todo. Um terno bem ajustado e uma camisa que não amassa resolvem a colação e o baile.",
    dicas: [
      "Se a colação e o baile são no mesmo dia, troque só a camisa ou a gravata para mudar o visual.",
      "Cores escuras no terno funcionam bem na maioria das fotos de palco.",
      "Deixe o ajuste da barra e da manga para depois de escolher o sapato.",
    ],
    foto: "/assets/gal-02-azul.jpg",
    fotoAlt: "Homem de terno azul na loja",
    produtos: ["sm-terno", "sm-camisa-bambu", "sm-camisa-poliamida"],
    notaFeminina: "Formandas encontram opções femininas nas lojas.",
  },
  {
    slug: "celebracoes",
    titulo: "Celebrações",
    resumo: "Aniversários, jantares e encontros de família.",
    texto:
      "Para celebrar, a roupa pode ter mais cor. Uma camisa vinho ou lilás com blazer muda o tom do social sem perder a elegância.",
    dicas: [
      "Cores como vinho, lilás e rosa funcionam bem à noite e com blazer escuro.",
      "Sem gravata, abra o primeiro botão da camisa.",
      "Um blazer xadrez dá personalidade e dispensa acessório.",
    ],
    foto: "/assets/pb-vinho-2.jpg",
    fotoAlt: "Modelo com camisa social cor vinho",
    produtos: ["sm-camisa-bambu", "sm-blazer-xadrez"],
    notaFeminina: "As lojas têm opções femininas para festas e celebrações.",
  },
  {
    slug: "dia-a-dia",
    titulo: "Dia a dia",
    resumo: "Peças leves para quem se veste bem sem esforço.",
    texto:
      "No dia a dia, conforto conta tanto quanto aparência. A fibra de bambu é leve, respira e vai do trabalho ao fim de semana.",
    dicas: [
      "Camisa social também vai com jeans escuro e sapatênis.",
      "Dobre a manga duas vezes, na altura do antebraço, para um visual mais solto.",
      "Tons claros, como azul-claro e cinza-claro, são os mais fáceis de combinar.",
    ],
    foto: "/assets/pb-azulclaro-2.jpg",
    fotoAlt: "Modelo com camisa social azul-clara",
    produtos: ["sm-camisa-bambu", "sm-camisa-poliamida"],
    notaFeminina: "A moda feminina para o dia a dia está nas lojas.",
  },
  {
    slug: "eventos-especiais",
    titulo: "Eventos especiais",
    resumo: "Premiações, convenções e noites que pedem traje completo.",
    texto:
      "Em eventos com traje definido no convite, o terno é a base. Os detalhes mudam conforme o horário e o tipo de evento.",
    dicas: [
      "Traje passeio completo pede terno e gravata. Leia o convite antes de escolher.",
      "Terno claro é para eventos diurnos e ao ar livre.",
      "Combine sapato e cinto da mesma cor.",
    ],
    foto: "/assets/look-2.jpg",
    fotoAlt: "Homem de terno bege e camisa escura na loja",
    produtos: ["sm-terno", "sm-blazer-xadrez", "sm-camisa-poliamida"],
    notaFeminina: "Para elas, a equipe das lojas indica opções para cada tipo de evento.",
  },
];

export function ocasiaoPorSlug(slug: string) {
  return OCASIOES.find((o) => o.slug === slug);
}
