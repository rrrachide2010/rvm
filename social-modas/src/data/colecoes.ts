import type { Produto } from "@/types/catalogo";
import { produtos } from "./catalogo";

/**
 * Coleções exibidas no site. Cada uma filtra o catálogo real; nenhuma
 * inventa produto. Calças e acessórios ficaram de fora porque o catálogo
 * ainda não tem peças dessas categorias: entram aqui no dia em que tiverem.
 *
 * A coleção feminina não tem fotos por decisão da marca. Ela aparece com
 * tratamento tipográfico e lista os produtos femininos assim que existirem
 * em `produtos.json` com `"genero": "Feminino"`.
 */
export type Colecao = {
  slug: string;
  titulo: string;
  chamada: string;
  descricao: string;
  /** Foto real da marca. `null` = cartão tipográfico. */
  foto: string | null;
  fotoAlt: string;
  filtro: (p: Produto) => boolean;
  /** Texto para quando ainda não há peça desta coleção no site. */
  semPecas?: { titulo: string; texto: string };
};

export const COLECOES: Colecao[] = [
  {
    slug: "feminino",
    titulo: "Feminino",
    chamada: "Para o trabalho, para a festa e para o resto da semana.",
    descricao:
      "A moda feminina da Social Modas está nas lojas, com peças para o escritório, eventos e o dia a dia. A equipe ajuda a montar o visual e a acertar o tamanho.",
    foto: null,
    fotoAlt: "",
    filtro: (p) => p.genero === "Feminino" || p.genero === "Unissex",
    semPecas: {
      titulo: "A coleção feminina está nas lojas",
      texto:
        "As peças femininas ainda não estão à venda pelo site. Fale com a loja da sua cidade: a equipe conta o que chegou, separa os tamanhos e reserva para você provar.",
    },
  },
  {
    slug: "masculino",
    titulo: "Masculino",
    chamada: "Camisaria e alfaiataria com caimento de loja.",
    descricao:
      "Camisas sociais em poliamida e fibra de bambu, ternos e blazers. Peças para o trabalho, para casamentos e para quem gosta de estar bem vestido em qualquer dia.",
    foto: "/assets/gal-03-cinza.jpg",
    fotoAlt: "Homem de terno cinza e camisa vinho na loja Social Modas",
    filtro: (p) => p.genero === "Masculino" || p.genero === "Unissex",
  },
  {
    slug: "alfaiataria",
    titulo: "Alfaiataria",
    chamada: "Terno e blazer para os dias que pedem estrutura.",
    descricao:
      "Ternos e blazers slim em poliviscose com elastano: corte moderno e conforto para passar o dia inteiro vestido.",
    foto: "/assets/gal-02-azul.jpg",
    fotoAlt: "Homem de terno azul na loja Social Modas",
    filtro: (p) => p.categoria === "Terno",
  },
  {
    slug: "camisas",
    titulo: "Camisas",
    chamada: "Nove cores, dois tecidos, nenhuma que amasse fácil.",
    descricao:
      "Camisas sociais em poliamida de alta gramatura e em fibra natural de bambu. Escolha pelo tecido, depois pela cor.",
    foto: "/assets/pb-vinho.jpg",
    fotoAlt: "Modelo com camisa social cor vinho",
    filtro: (p) => p.categoria === "Camisa",
  },
];

export function colecaoPorSlug(slug: string) {
  return COLECOES.find((c) => c.slug === slug);
}

export function pecasDa(colecao: Colecao): Produto[] {
  return produtos.filter(colecao.filtro);
}

/** Peças contadas por cor: a camisa em seis cores conta como seis opções. */
export function opcoesDa(colecao: Colecao): number {
  return pecasDa(colecao).reduce((n, p) => n + Math.max(1, p.cores.length), 0);
}
