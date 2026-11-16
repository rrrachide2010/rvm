import dados from "../../public/produtos.json";
import type { Produto } from "@/types/catalogo";

/**
 * O catálogo vem do mesmo `produtos.json` que a API e o painel usam. O site
 * lê o arquivo na hora do build; para um produto novo aparecer, basta
 * cadastrá-lo e publicar de novo.
 */
const todos = (dados as { produtos: Produto[] }).produtos;

/** Converte um caminho relativo do catálogo no absoluto, que é o que o <Image> espera. */
export function caminho(foto: string | undefined | null): string | null {
  if (!foto) return null;
  return foto.startsWith("/") ? foto : `/${foto}`;
}

export const produtos: readonly Produto[] = todos.filter((p) => !p.breve);

export function produtoPorId(id: string): Produto | undefined {
  return produtos.find((p) => p.id === id);
}

export function corDe(produto: Produto, nomeCor?: string) {
  if (!nomeCor) return produto.cores[0];
  return produto.cores.find((c) => c.nome === nomeCor) ?? produto.cores[0];
}

/** Foto de capa de um produto numa cor específica, quando ela existe. */
export function fotoDe(produto: Produto, nomeCor?: string): string {
  const cor = corDe(produto, nomeCor);
  return caminho(cor?.foto ?? produto.foto) ?? "/assets/og.jpg";
}

/** Todas as fotos de um produto numa cor, sem repetir. */
export function fotosDe(produto: Produto, nomeCor?: string): string[] {
  const cor = corDe(produto, nomeCor);
  const lista = cor?.fotos?.length ? cor.fotos : [produto.foto, ...produto.galeria];
  return [...new Set(lista.map((f) => caminho(f)).filter((f): f is string => Boolean(f)))];
}

export const NOMES_CATEGORIA: Record<string, string> = {
  Camisa: "Camisa social",
  Terno: "Alfaiataria",
};
