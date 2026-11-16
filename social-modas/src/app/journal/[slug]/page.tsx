import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductCard } from "@/components/products/ProductCard";
import { CartaoArtigo } from "@/components/journal/JournalPreview";
import { ARTIGOS, artigoPorSlug, minutosDeLeitura } from "@/data/journal";
import { produtoPorId } from "@/data/catalogo";
import { MARCA } from "@/data/marca";
import { metadados } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTIGOS.map((a) => ({ slug: a.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = artigoPorSlug(slug);
  if (!a) return {};
  return metadados({ titulo: a.titulo, descricao: a.resumo, caminho: `/journal/${a.slug}/` });
}

export default async function PaginaArtigo({ params }: Params) {
  const { slug } = await params;
  const artigo = artigoPorSlug(slug);
  if (!artigo) notFound();
  const pecas = artigo.produtos.map(produtoPorId).filter((p) => p !== undefined).slice(0, 4);
  const outros = ARTIGOS.filter((a) => a.slug !== artigo.slug).slice(0, 3);

  // Sem datePublished: o texto não tem data, e o schema não ganha uma inventada.
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.resumo,
    author: { "@type": "Organization", name: MARCA.nome },
    publisher: { "@type": "Organization", name: MARCA.nome, logo: { "@type": "ImageObject", url: `${MARCA.url}/assets/logo.png` } },
    mainEntityOfPage: new URL(`/journal/${artigo.slug}/`, MARCA.url).toString(),
  };

  return (
    <>
      <article className="pt-[4.5rem]">
        <div className="conteiner pt-10">
          <Breadcrumbs itens={[{ texto: "Social Journal", href: "/journal/" }, { texto: artigo.titulo }]} />
        </div>
        <header className="conteiner mt-14 max-w-4xl">
          <p className="rotulo flex items-center gap-3">
            <span className="filete" aria-hidden="true" />
            {artigo.tema} · {minutosDeLeitura(artigo)} min de leitura
          </p>
          <h1 className="mt-6 text-h1 text-bordeaux">{artigo.titulo}</h1>
          <p className="mt-6 text-lead text-mute">{artigo.resumo}</p>
        </header>

        <div className="conteiner mt-14 max-w-4xl pb-secao">
          <div className="max-w-[40rem] border-t border-linha pt-10 text-[1.0625rem] leading-[1.75] text-graphite">
            {artigo.corpo.map((b, i) => {
              if (b.tipo === "h2")
                return (
                  <h2 key={i} className="mt-12 mb-4 font-serif text-h3 text-bordeaux first:mt-0">
                    {b.texto}
                  </h2>
                );
              if (b.tipo === "lista")
                return (
                  <ul key={i} className="my-6 space-y-3">
                    {b.itens.map((item) => (
                      <li key={item} className="relative pl-6 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-3 before:bg-bordeaux">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={i} className="mt-5 first:mt-0">
                  {b.texto}
                </p>
              );
            })}
            {artigo.apoio ? (
              <Link href={artigo.apoio.href} className="link-editorial mt-10">
                {artigo.apoio.texto}
                <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </article>

      {pecas.length ? (
        <section aria-labelledby="pecas-artigo" className="border-t border-linha bg-papel py-secao">
          <div className="conteiner">
            <h2 id="pecas-artigo" className="text-h2 text-bordeaux">
              Peças para colocar em prática
            </h2>
            <ul id="grade" className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {pecas.map((p) => (
                <li key={p.id}>
                  <ProductCard produto={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="mais-textos" className="py-secao">
        <div className="conteiner">
          <h2 id="mais-textos" className="text-h2 text-bordeaux">
            Continue lendo
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
            {outros.map((a, i) => (
              <CartaoArtigo key={a.slug} artigo={a} indice={i} />
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
