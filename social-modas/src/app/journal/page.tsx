import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { CartaoArtigo } from "@/components/journal/JournalPreview";
import { ARTIGOS } from "@/data/journal";
import { metadados } from "@/lib/seo";

export const metadata = metadados({
  titulo: "Social Journal",
  descricao: "Guias da Social Modas sobre caimento, tamanhos, cores, trajes e cuidados com as peças.",
  caminho: "/journal/",
});

export default function Journal() {
  return (
    <section className="pt-[4.5rem]">
      <div className="conteiner pt-10 pb-secao">
        <Breadcrumbs itens={[{ texto: "Social Journal" }]} />
        <div className="mt-12">
          <CabecalhoSecao nivel="h1" rotulo="Social Journal" titulo="Para escolher com mais segurança." texto="Guias curtos para acertar o tamanho, combinar cores, entender o traje do convite e cuidar das peças." />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {ARTIGOS.map((a, i) => (
            <CartaoArtigo key={a.slug} artigo={a} indice={i % 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
