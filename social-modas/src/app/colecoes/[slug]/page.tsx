import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { Foto } from "@/components/ui/Foto";
import { Botao } from "@/components/ui/Botao";
import { SimboloMarca } from "@/components/ui/Marca";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { ProductCard } from "@/components/products/ProductCard";
import { StoreLocator } from "@/components/stores/StoreLocator";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { COLECOES, colecaoPorSlug, pecasDa } from "@/data/colecoes";
import type { Produto } from "@/types/catalogo";
import { MARCA } from "@/data/marca";
import { linkWhatsApp } from "@/lib/whatsapp";
import { metadados } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLECOES.map((c) => ({ slug: c.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = colecaoPorSlug(slug);
  if (!c) return {};
  return metadados({ titulo: c.titulo, descricao: c.descricao, caminho: `/colecoes/${c.slug}/`, imagem: c.foto ?? undefined });
}

export default async function PaginaColecao({ params }: Params) {
  const { slug } = await params;
  const colecao = colecaoPorSlug(slug);
  if (!colecao) notFound();

  // Cada cor vira um cartão: nove camisas reais dizem mais do que duas.
  const variantes = pecasDa(colecao).flatMap((p): { produto: Produto; cor?: string }[] => (p.cores.length ? p.cores.map((c) => ({ produto: p, cor: c.nome })) : [{ produto: p, cor: undefined }]));

  return (
    <>
      <section className="pt-[4.5rem]">
        <div className="conteiner grid grid-cols-1 items-end gap-10 pt-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
          <div>
            <Breadcrumbs itens={[{ texto: "Coleções", href: "/colecoes/" }, { texto: colecao.titulo }]} />
            <p className="mt-12 rotulo flex items-center gap-3">
              <span className="filete" aria-hidden="true" />
              Coleção
            </p>
            <h1 className="mt-5 text-display text-creme">{colecao.titulo}</h1>
            <p className="mt-6 max-w-lg text-lead text-nevoa">{colecao.descricao}</p>
          </div>
          {colecao.foto ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-peca bg-superficie lg:aspect-[4/5]">
              <Foto src={colecao.foto} alt={colecao.fotoAlt} sizes="(min-width: 1024px) 40vw, 100vw" prioridade posicao="50% 25%" />
            </div>
          ) : (
            <div className="sobre-bordeaux relative flex aspect-[4/3] items-end overflow-hidden rounded-peca bg-marsala p-8 text-creme">
              <SimboloMarca className="absolute -top-6 -right-10 w-80 text-white/[0.06]" />
              <p className="relative max-w-xs font-serif text-h3 text-creme">{colecao.chamada}</p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="pecas" className="border-t border-fio py-secao">
        <div className="conteiner">
          {variantes.length > 0 ? (
            <>
              <h2 id="pecas" className="sr-only">
                Peças da coleção
              </h2>
              <p className="text-legenda text-nevoa">
                {variantes.length} {variantes.length === 1 ? "opção" : "opções"} entre peças e cores
              </p>
              <ul id="grade" className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {variantes.map(({ produto, cor }) => (
                  <li key={`${produto.id}-${cor ?? ""}`}>
                    <ProductCard produto={produto} cor={cor} />
                  </li>
                ))}
              </ul>
            </>
          ) : colecao.semPecas ? (
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
              <div>
                <CabecalhoSecao id="pecas" rotulo="Como comprar" titulo={colecao.semPecas.titulo} texto={colecao.semPecas.texto} />
                <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Botao href={linkWhatsApp(MARCA.whatsappCentral.numero, `Olá, Social Modas! Quero saber da coleção ${colecao.titulo.toLowerCase()} nas lojas.`)} externo>
                    <IconeWhatsApp className="size-4" />
                    Falar com a loja
                  </Botao>
                  <Botao href="/guia-de-tamanhos/" variante="contorno">
                    Como medir
                    <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  </Botao>
                </div>
              </div>
              <div data-revelar>
                <StoreLocator />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <EditorialCTA />
    </>
  );
}
