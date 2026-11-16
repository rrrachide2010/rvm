import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Foto } from "@/components/ui/Foto";
import { ProductCard } from "@/components/products/ProductCard";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { OCASIOES, ocasiaoPorSlug } from "@/data/ocasioes";
import { produtoPorId } from "@/data/catalogo";
import { metadados } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return OCASIOES.map((o) => ({ slug: o.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const o = ocasiaoPorSlug(slug);
  if (!o) return {};
  return metadados({ titulo: `Looks para ${o.titulo.toLowerCase()}`, descricao: `${o.resumo} ${o.texto}`, caminho: `/ocasioes/${o.slug}/`, imagem: o.foto });
}

export default async function PaginaOcasiao({ params }: Params) {
  const { slug } = await params;
  const ocasiao = ocasiaoPorSlug(slug);
  if (!ocasiao) notFound();
  const pecas = ocasiao.produtos.map(produtoPorId).filter((p) => p !== undefined);

  return (
    <>
      <section className="pt-[4.5rem]">
        <div className="conteiner grid grid-cols-1 gap-12 pt-10 pb-secao lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <Breadcrumbs itens={[{ texto: "Ocasiões" }, { texto: ocasiao.titulo }]} />
            <p className="mt-12 rotulo flex items-center gap-3">
              <span className="filete" aria-hidden="true" />
              Vista a ocasião
            </p>
            <h1 className="mt-5 text-display text-bordeaux">{ocasiao.titulo}</h1>
            <p className="mt-6 font-serif text-h3 text-graphite">{ocasiao.resumo}</p>
            <p className="mt-5 max-w-lg text-lead text-mute">{ocasiao.texto}</p>

            <h2 className="mt-12 rotulo">Dicas para acertar</h2>
            <ol className="mt-4 space-y-4">
              {ocasiao.dicas.map((d, i) => (
                <li key={d} className="flex gap-5 border-t border-linha pt-4">
                  <span className="font-serif text-[1.5rem] leading-none text-bordeaux tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-graphite">{d}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-legenda text-taupe-ink">{ocasiao.notaFeminina}</p>
          </div>
          <div className="relative aspect-[4/5] self-start overflow-hidden rounded-peca bg-sand lg:sticky lg:top-24">
            <Foto src={ocasiao.foto} alt={ocasiao.fotoAlt} sizes="(min-width: 1024px) 40vw, 100vw" prioridade posicao="50% 25%" />
          </div>
        </div>
      </section>

      <section aria-labelledby="pecas" className="border-t border-linha bg-papel py-secao">
        <div className="conteiner">
          <h2 id="pecas" className="text-h2 text-bordeaux">
            Peças para {ocasiao.titulo.toLowerCase()}
          </h2>
          <ul id="grade" className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pecas.map((p) => (
              <li key={p.id}>
                <ProductCard produto={p} />
              </li>
            ))}
          </ul>

          <nav aria-label="Outras ocasiões" className="mt-20 border-t border-linha pt-8">
            <p className="rotulo">Outras ocasiões</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {OCASIOES.filter((o) => o.slug !== ocasiao.slug).map((o) => (
                <li key={o.slug}>
                  <Link href={`/ocasioes/${o.slug}/`} className="inline-flex min-h-11 items-center rounded-full border border-graphite/20 px-5 text-[0.875rem] text-graphite transition-colors hover:border-bordeaux hover:text-bordeaux">
                    {o.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <EditorialCTA />
    </>
  );
}
