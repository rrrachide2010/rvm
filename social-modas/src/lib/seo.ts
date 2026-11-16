import type { Metadata } from "next";
import { MARCA } from "@/data/marca";

type Opcoes = {
  titulo?: string;
  descricao: string;
  caminho: string;
  imagem?: string;
};

/** Metadados de uma rota: título, descrição, canonical e Open Graph juntos. */
export function metadados({ titulo, descricao, caminho, imagem }: Opcoes): Metadata {
  const url = new URL(caminho, MARCA.url).toString();
  const og = new URL(imagem ?? "/assets/og.jpg", MARCA.url).toString();
  const tituloCompleto = titulo ? `${titulo} · ${MARCA.nome}` : `${MARCA.nome} · Moda feminina e masculina`;
  return {
    title: tituloCompleto,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: MARCA.nome,
      title: tituloCompleto,
      description: descricao,
      url,
      images: [{ url: og }],
    },
    twitter: { card: "summary_large_image", title: tituloCompleto, description: descricao, images: [og] },
  };
}

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
