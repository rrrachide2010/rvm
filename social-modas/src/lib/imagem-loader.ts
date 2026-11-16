import { TODAS_AS_LARGURAS } from "./larguras";

/**
 * Converte `/assets/pb-marinho.jpg` + largura pedida em
 * `/img/pb-marinho-768.webp`, o arquivo que `scripts/imagens.mjs` gerou.
 *
 * Se alguém pedir uma largura fora da lista, arredonda para a próxima maior
 * que existe; nunca devolve um caminho que não foi gerado.
 */
export default function imagemLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/assets/")) return src;
  const nome = src.slice("/assets/".length).replace(/\.(jpe?g|png)$/i, "");
  const largura =
    TODAS_AS_LARGURAS.find((l) => l >= width) ??
    TODAS_AS_LARGURAS[TODAS_AS_LARGURAS.length - 1];
  return `/img/${nome}-${largura}.webp`;
}
