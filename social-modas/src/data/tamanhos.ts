/**
 * Guia de tamanhos.
 *
 * A tabela masculina é a que o site da Social Modas já publicava em
 * venda.html. As camisas do catálogo usam numeração de 1 a 6; a conversão
 * entre as duas escalas não foi publicada pela marca, então o site não
 * inventa uma: orienta a medir e a confirmar com a loja.
 *
 * Não há tabela feminina publicada. A seção feminina ensina a medir e
 * encaminha para a loja, sem números.
 */
export type ComoMedir = { parte: string; como: string };

export type Tabela = {
  titulo: string;
  nota: string;
  colunas: string[];
  linhas: string[][];
};

export const MEDIR_MASCULINO: ComoMedir[] = [
  { parte: "Peito", como: "Na parte mais larga, por baixo das axilas, com os braços relaxados." },
  { parte: "Cintura", como: "Na altura do umbigo, onde a calça social assenta." },
  { parte: "Manga", como: "Do ombro até o osso do pulso, com o braço levemente dobrado." },
  { parte: "Altura", como: "Descalço, de costas para a parede." },
];

export const MEDIR_FEMININO: ComoMedir[] = [
  { parte: "Busto", como: "Na parte mais saliente do busto, com a fita paralela ao chão." },
  { parte: "Cintura", como: "Na parte mais fina do tronco, normalmente um pouco acima do umbigo." },
  { parte: "Quadril", como: "Na parte mais larga do quadril, com os pés juntos." },
  { parte: "Comprimento", como: "Do ombro até onde a peça deve terminar, com a pessoa em pé." },
];

export const TABELA_MASCULINA: Tabela = {
  titulo: "Tabela masculina de referência",
  nota: "Numeração 44 a 56. As camisas do site usam numeração de 1 a 6: com as suas medidas em mãos, a loja indica o número certo.",
  colunas: ["Tamanho", "Peito (cm)", "Cintura (cm)", "Manga (cm)"],
  linhas: [
    ["44", "86–90", "74–78", "60–61"],
    ["46", "90–94", "78–82", "61–62"],
    ["48", "94–98", "82–86", "62–63"],
    ["50", "98–102", "86–90", "63–64"],
    ["52", "102–106", "90–95", "64–65"],
    ["54", "106–111", "95–100", "65–66"],
    ["56", "111–116", "100–106", "66–67"],
  ],
};

export const DICAS_DE_MEDIDA = [
  "Use fita métrica de costura, sobre roupa leve.",
  "A fita encosta no corpo, mas não aperta.",
  "Se ficar entre dois tamanhos, fale com a loja antes de escolher.",
];
