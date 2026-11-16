import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProdutoInterativo, type CorResolvida } from "@/components/products/ProdutoInterativo";
import { SizeGuide } from "@/components/products/SizeGuide";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemCarrossel, ProductCarousel } from "@/components/products/ProductCarousel";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { NOMES_CATEGORIA, caminho, fotoDe, fotosDe, produtoPorId, produtos } from "@/data/catalogo";
import { UNIDADES } from "@/data/lojas";
import { MARCA } from "@/data/marca";
import { brl, metadados } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return produtos.map((p) => ({ id: p.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = produtoPorId(id);
  if (!p) return {};
  return metadados({ titulo: p.nome, descricao: p.descricao, caminho: `/produtos/${p.id}/`, imagem: fotoDe(p) });
}

export default async function PaginaProduto({ params }: Params) {
  const { id } = await params;
  const produto = produtoPorId(id);
  if (!produto) notFound();

  const cores: CorResolvida[] = produto.cores.map((c) => ({ nome: c.nome, hex: c.hex, fotos: fotosDe(produto, c.nome) }));
  const fotosSemCor = [produto.foto, ...produto.galeria].map((f) => caminho(f)).filter((f): f is string => Boolean(f));
  const outros = produtos.filter((p) => p.id !== produto.id).sort((a, b) => Number(a.categoria === produto.categoria) - Number(b.categoria === produto.categoria));
  const categoria = NOMES_CATEGORIA[produto.categoria] ?? produto.categoria;
  const colecao = produto.categoria === "Terno" ? "alfaiataria" : "camisas";
  const mostrarPreco = MARCA.mostrarPrecos && produto.preco !== null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.descricao,
    image: fotosDe(produto).map((f) => new URL(f, MARCA.url).toString()),
    brand: { "@type": "Brand", name: MARCA.nome },
    category: categoria,
    material: produto.tecido,
    ...(produto.cores.length ? { color: produto.cores.map((c) => c.nome).join(", ") } : {}),
    ...(mostrarPreco
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: produto.preco,
            url: produto.link_ml ?? new URL(`/produtos/${produto.id}/`, MARCA.url).toString(),
            availability: produto.estoque === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      <div className="conteiner pt-28 pb-secao">
        <Breadcrumbs
          itens={[
            { texto: "Coleções", href: "/colecoes/" },
            { texto: colecao === "alfaiataria" ? "Alfaiataria" : "Camisas", href: `/colecoes/${colecao}/` },
            { texto: produto.nome },
          ]}
        />
        <div className="mt-8">
          <ProdutoInterativo
            id={produto.id}
            nome={produto.nome}
            cores={cores}
            fotosSemCor={fotosSemCor}
            tamanhos={produto.tamanhos}
            linkMl={produto.link_ml}
            unidades={UNIDADES.map(({ id, cidade, estado, whatsapp }) => ({ id, cidade, estado, whatsapp }))}
            cabecalho={
              <>
                <p className="rotulo">{categoria}</p>
                <h1 className="mt-3 text-h1 text-bordeaux">{produto.nome}</h1>
                <p className="mt-5 text-[1.375rem] font-medium text-graphite">
                  {produto.estoque === 0 ? "Esgotado" : mostrarPreco ? brl.format(produto.preco!) : "Consultar valor"}
                </p>
                <p className="mt-6 text-lead text-mute">{produto.descricao}</p>
              </>
            }
          >
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-linha pt-6 text-[0.9375rem]">
              <div>
                <dt className="rotulo">Tecido</dt>
                <dd className="mt-1 text-graphite">{produto.tecido}</dd>
              </div>
              <div>
                <dt className="rotulo">Tamanhos</dt>
                <dd className="mt-1 text-graphite">{produto.tamanhos.length ? produto.tamanhos.join(" · ") : "Consulte a loja"}</dd>
              </div>
            </dl>
            <div className="mt-8">
              <SizeGuide genero={produto.genero} />
            </div>
          </ProdutoInterativo>
        </div>
      </div>

      {outros.length ? (
        <section aria-labelledby="combina" className="border-t border-linha bg-papel py-secao">
          <div className="conteiner">
            <CabecalhoSecao id="combina" rotulo="Complete o visual" titulo="Combina com" />
            <div className="mt-12">
              <ProductCarousel rotulo="Peças que combinam">
                {outros.map((p) => (
                  <ItemCarrossel key={p.id}>
                    <ProductCard produto={p} />
                  </ItemCarrossel>
                ))}
              </ProductCarousel>
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
