import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { StoreLocator } from "@/components/stores/StoreLocator";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { MARCA } from "@/data/marca";
import { UNIDADES } from "@/data/lojas";
import { linkWhatsApp } from "@/lib/whatsapp";
import { metadados } from "@/lib/seo";

export const metadata = metadados({
  titulo: "Lojas",
  descricao: `Encontre a Social Modas na sua cidade: ${UNIDADES.map((u) => u.cidade).join(", ")}. Endereço, rota e WhatsApp de atendimento.`,
  caminho: "/lojas/",
  imagem: "/assets/fachada.jpg",
});

export default function Lojas() {
  return (
    <section className="pt-[4.5rem]">
      <div className="conteiner pt-10 pb-secao">
        <Breadcrumbs itens={[{ texto: "Lojas" }]} />
        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <div>
            <CabecalhoSecao nivel="h1" rotulo="Lojas" titulo="Social Modas mais perto de você." texto="Busque pela sua cidade. Em cada uma, você fala direto com a equipe que atende ali." />
            <div className="mt-10 border-t border-linha pt-6">
              <p className="font-medium text-graphite">Não achou a sua cidade?</p>
              <p className="mt-1.5 text-[0.9375rem] text-mute">O atendimento online indica a loja mais próxima e tira dúvidas sobre peças e tamanhos.</p>
              <a href={linkWhatsApp(MARCA.whatsappCentral.numero, "Olá, Social Modas! Qual a loja mais perto de mim?")} target="_blank" rel="noopener noreferrer" className="link-editorial mt-3">
                <IconeWhatsApp className="size-4" />
                {MARCA.whatsappCentral.exibicao}
              </a>
            </div>
          </div>
          <div>
            <StoreLocator />
          </div>
        </div>
      </div>
    </section>
  );
}
