import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { SizeGuide } from "@/components/products/SizeGuide";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { Botao } from "@/components/ui/Botao";
import { MARCA } from "@/data/marca";
import { linkWhatsApp } from "@/lib/whatsapp";
import { metadados } from "@/lib/seo";

export const metadata = metadados({
  titulo: "Guia de tamanhos",
  descricao: "Como medir peito, cintura, quadril e manga, e a tabela masculina de referência da Social Modas.",
  caminho: "/guia-de-tamanhos/",
});

export default function GuiaDeTamanhos() {
  return (
    <section className="pt-[4.5rem]">
      <div className="conteiner pt-10 pb-secao">
        <Breadcrumbs itens={[{ texto: "Guia de tamanhos" }]} />
        <div className="mt-12">
          <CabecalhoSecao
            nivel="h1"
            rotulo="Atendimento"
            titulo="Guia de tamanhos"
            texto="Com quatro medidas em mãos, fica fácil acertar. O guia orienta; a confirmação final é sempre na prova ou com a loja."
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          <section aria-labelledby="masculino" className="border-t border-graphite/80 pt-8">
            <h2 id="masculino" className="text-h2 text-bordeaux">
              Masculino
            </h2>
            <div className="mt-8">
              <SizeGuide genero="Masculino" completo />
            </div>
          </section>
          <section aria-labelledby="feminino" className="border-t border-graphite/80 pt-8">
            <h2 id="feminino" className="text-h2 text-bordeaux">
              Feminino
            </h2>
            <div className="mt-8">
              <SizeGuide genero="Feminino" completo />
            </div>
          </section>
        </div>

        <div className="mt-20 flex flex-col gap-6 rounded-peca bg-papel p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="font-serif text-h3 text-graphite">Ficou entre dois tamanhos?</p>
            <p className="mt-2 text-mute">Mande suas medidas. A equipe compara com a modelagem da peça.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Botao href={linkWhatsApp(MARCA.whatsappCentral.numero, "Olá, Social Modas! Quero ajuda com o tamanho. Minhas medidas são:")} externo>
              <IconeWhatsApp className="size-4" />
              Enviar medidas
            </Botao>
            <Botao href="/journal/como-escolher-o-tamanho-ideal/" variante="contorno">
              Ler o guia de caimento
              <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
