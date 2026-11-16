import type { MetadataRoute } from "next";
import { MARCA } from "@/data/marca";
import { produtos } from "@/data/catalogo";
import { COLECOES } from "@/data/colecoes";
import { OCASIOES } from "@/data/ocasioes";
import { ARTIGOS } from "@/data/journal";

export const dynamic = "force-static";

/**
 * Sem `lastModified`: o export não sabe quando cada página mudou de verdade,
 * e uma data igual para todas a cada build só ensinaria o Google a ignorá-la.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    "/",
    "/colecoes/",
    ...COLECOES.map((c) => `/colecoes/${c.slug}/`),
    ...produtos.map((p) => `/produtos/${p.id}/`),
    ...OCASIOES.map((o) => `/ocasioes/${o.slug}/`),
    "/nossa-historia/",
    "/lojas/",
    "/guia-de-tamanhos/",
    "/journal/",
    ...ARTIGOS.map((a) => `/journal/${a.slug}/`),
  ];
  return rotas.map((r) => ({ url: new URL(r, MARCA.url).toString() }));
}
