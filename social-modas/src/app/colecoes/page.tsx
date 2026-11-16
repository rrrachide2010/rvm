import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { ProductCard } from "@/components/products/ProductCard";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { produtos } from "@/data/catalogo";
import { metadados } from "@/lib/seo";

export const metadata = metadados({
  titulo: "Coleções",
  descricao: "Moda feminina e masculina, alfaiataria e camisaria Social Modas. Veja as coleções e as peças disponíveis.",
  caminho: "/colecoes/",
});

export default function Colecoes() {
  return (
    <>
      <div className="conteiner pt-28">
        <Breadcrumbs itens={[{ texto: "Coleções" }]} />
        <div className="mt-10">
          <CabecalhoSecao nivel="h1" rotulo="Coleções" titulo="Explore as coleções" texto="Escolha por coleção ou veja todas as peças disponíveis no site logo abaixo." />
        </div>
        <div className="mt-14">
          <CollectionGrid />
        </div>
      </div>

      <section aria-labelledby="todas" className="py-secao">
        <div className="conteiner">
          <CabecalhoSecao id="todas" rotulo="Catálogo" titulo="Todas as peças" />
          <ul id="grade" className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {produtos.map((p) => (
              <li key={p.id}>
                <ProductCard produto={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <EditorialCTA titulo="Não encontrou o que procura?" texto="As lojas têm mais peças do que o site. Visite uma Social Modas ou fale com a equipe." />
    </>
  );
}
