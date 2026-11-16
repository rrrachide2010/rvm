/**
 * Looks do "Um look, todas as peças". Cada peça é um produto real do
 * catálogo, numa cor que existe. O que a Social Modas não vende pelo site
 * (gravata, cinto, sapato) não vira peça clicável: aparece só no texto de
 * apoio, como sugestão para a loja.
 */
export type PecaDoLook = { produtoId: string; cor?: string; papel: string };

export type Look = {
  id: string;
  titulo: string;
  ocasiao: string;
  texto: string;
  pecas: PecaDoLook[];
  complemento: string;
};

export const LOOKS: Look[] = [
  {
    id: "grande-dia",
    titulo: "Para o grande dia",
    ocasiao: "Casamentos e formaturas",
    texto: "Terno slim com camisa branca: a combinação que não erra em cerimônia.",
    pecas: [
      { produtoId: "sm-terno", papel: "Terno" },
      { produtoId: "sm-camisa-poliamida", cor: "Branco", papel: "Camisa" },
    ],
    complemento: "Gravata e sapato a equipe da loja ajuda a escolher na prova.",
  },
  {
    id: "segunda-feira",
    titulo: "Reunião de segunda",
    ocasiao: "Trabalho",
    texto: "Blazer xadrez com camisa azul-clara. Formal o suficiente, sem o peso do terno.",
    pecas: [
      { produtoId: "sm-blazer-xadrez", papel: "Blazer" },
      { produtoId: "sm-camisa-bambu", cor: "Azul Claro", papel: "Camisa" },
    ],
    complemento: "Vai bem com calça social cinza ou marinho.",
  },
  {
    id: "noite",
    titulo: "Jantar e celebração",
    ocasiao: "Celebrações",
    texto: "Terno escuro com camisa vinho, para a noite e sem gravata.",
    pecas: [
      { produtoId: "sm-terno", papel: "Terno" },
      { produtoId: "sm-camisa-bambu", cor: "Vinho", papel: "Camisa" },
    ],
    complemento: "Primeiro botão aberto e sapato marrom ou preto.",
  },
];
