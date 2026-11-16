/** Formato do `public/produtos.json`, o mesmo arquivo que `/api/produtos` serve. */
export type Cor = {
  nome: string;
  hex: string;
  foto: string;
  fotos: string[];
};

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  tecido: string;
  genero: "Masculino" | "Feminino" | "Unissex" | string;
  descricao: string;
  /** `null` quando a marca não confirmou o preço. */
  preco: number | null;
  tamanhos: string[];
  foto: string;
  galeria: string[];
  link_ml?: string;
  /** `null` = disponível, `0` = esgotado. */
  estoque: number | null;
  breve?: boolean;
  destaque?: string;
  cores: Cor[];
};
