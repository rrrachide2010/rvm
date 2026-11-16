import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EditorialHero } from "@/components/editorial/EditorialHero";
import { BrandStory } from "@/components/editorial/BrandStory";
import { SplitEditorialSection } from "@/components/editorial/SplitEditorialSection";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { OccasionSelector } from "@/components/collections/OccasionSelector";
import { ProductCard } from "@/components/products/ProductCard";
import { ItemCarrossel, ProductCarousel } from "@/components/products/ProductCarousel";
import { LookBuilder } from "@/components/products/LookBuilder";
import { StoreLocator } from "@/components/stores/StoreLocator";
import { JournalPreview } from "@/components/journal/JournalPreview";
import { CabecalhoSecao } from "@/components/ui/CabecalhoSecao";
import { Botao } from "@/components/ui/Botao";
import { produtos } from "@/data/catalogo";
import { OCASIOES } from "@/data/ocasioes";
import { MARCA } from "@/data/marca";
import { looksResolvidos } from "@/lib/looks";

/**
 * A vitrine mostra cada camisa em uma cor diferente da capa padrão, para a
 * faixa não parecer quatro vezes a mesma foto. Cores que deixarem de
 * existir no catálogo caem na capa do produto.
 */
const VITRINE: { id: string; cor?: string }[] = [
  { id: "sm-camisa-bambu", cor: "Vinho" },
  { id: "sm-terno" },
  { id: "sm-camisa-poliamida", cor: "Branco" },
  { id: "sm-blazer-xadrez" },
  { id: "sm-camisa-bambu", cor: "Azul Claro" },
  { id: "sm-camisa-poliamida", cor: "Marinho" },
];

const BENEFICIOS = [
  { titulo: "Orientação na escolha", texto: "A equipe ajuda a montar o visual de acordo com a ocasião." },
  { titulo: "Prova com calma", texto: "Provador sem pressa e, se preferir, com hora marcada pelo WhatsApp." },
  { titulo: "Tamanho certo", texto: "Fita métrica na mão para acertar o número antes de levar." },
  { titulo: "Ajuste antes da retirada", texto: "Barra e manga acertadas para o seu corpo." },
];

export default function Inicio() {
  const resumo = Object.fromEntries(produtos.map((p) => [p.id, { id: p.id, nome: p.nome }]));
  const vitrine = VITRINE.flatMap((v) => {
    const p = produtos.find((x) => x.id === v.id);
    if (!p) return [];
    const cor = v.cor && p.cores.some((c) => c.nome === v.cor) ? v.cor : undefined;
    return [{ produto: p, cor }];
  });

  return (
    <>
      {/* 01 · Hero editorial */}
      <EditorialHero />

      {/* 02 · Explore as coleções */}
      <section aria-labelledby="colecoes" className="py-secao">
        <div className="conteiner">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <CabecalhoSecao id="colecoes" rotulo="Coleções" titulo="Explore as coleções" texto="Comece pelo que você procura. Cada coleção reúne as peças disponíveis no site." />
            <Link href="/colecoes/" className="link-editorial shrink-0" data-revelar>
              Todas as coleções
              <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-14">
            <CollectionGrid />
          </div>
        </div>
      </section>

      {/* 03 · Peças em destaque */}
      <section aria-labelledby="pecas" className="bg-papel py-secao">
        <div className="conteiner">
          <CabecalhoSecao id="pecas" rotulo="Vitrine" titulo="Peças para diferentes estilos." texto="Camisaria e alfaiataria para o trabalho, para a festa e para o dia a dia." />
          <div className="mt-14">
            <ProductCarousel rotulo="Peças em destaque" grade>
              {vitrine.map(({ produto, cor }) => (
                <ItemCarrossel key={`${produto.id}-${cor ?? ""}`}>
                  <ProductCard produto={produto} cor={cor} />
                </ItemCarrossel>
              ))}
            </ProductCarousel>
          </div>
        </div>
      </section>

      {/* 04 · Vista a ocasião */}
      <section aria-labelledby="ocasioes" className="py-secao">
        <div className="conteiner">
          <CabecalhoSecao id="ocasioes" rotulo="Vista a ocasião" titulo={MARCA.conceito} texto="Escolha o momento e veja as peças que funcionam para ele." />
          <div className="mt-14">
            <OccasionSelector ocasioes={OCASIOES} produtos={resumo} />
          </div>
        </div>
      </section>

      {/* 05 · Complete o visual */}
      <section aria-labelledby="look" className="border-t border-linha bg-ivory py-secao">
        <div className="conteiner">
          <CabecalhoSecao id="look" rotulo="Complete o visual" titulo="Um look, todas as peças." texto="Combinações prontas com peças do catálogo. Escolha um look e veja cada peça de perto." />
          <div className="mt-14">
            <LookBuilder looks={looksResolvidos()} mostrarPrecos={MARCA.mostrarPrecos} />
          </div>
        </div>
      </section>

      {/* 06 · Nossa história */}
      <BrandStory />

      {/* 07 · Experiência Social Modas */}
      <SplitEditorialSection
        foto="/assets/gal-01-time.jpg"
        fotoAlt="Equipe da Social Modas de terno, reunida dentro da loja"
        proporcao="aspect-[4/3]"
        posicaoFoto="50% 60%"
        fotoADireita
        legenda="Equipe Social Modas."
      >
        <p className="rotulo flex items-center gap-3">
          <span className="filete" aria-hidden="true" />
          Experiência Social Modas
        </p>
        <h2 className="mt-5 text-h2 text-bordeaux">O atendimento certo faz a diferença.</h2>
        <p className="mt-6 text-lead text-mute">Comprar roupa na loja é provar, tirar dúvida e sair com a peça certa.</p>
        <dl className="mt-9 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="border-t border-linha pt-4">
              <dt className="font-medium text-graphite">{b.titulo}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-mute">{b.texto}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <Botao href="/lojas/">
            Encontre sua loja
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Botao>
        </div>
      </SplitEditorialSection>

      {/* 08 · Localizador de lojas */}
      <section aria-labelledby="lojas" className="bg-papel py-secao">
        <div className="conteiner">
          <CabecalhoSecao id="lojas" rotulo="Lojas" titulo="Social Modas mais perto de você." texto="Encontre a sua cidade e fale direto com a loja." />
          <div className="mt-12" data-revelar>
            <StoreLocator compacto />
          </div>
        </div>
      </section>

      {/* 09 · Social Journal */}
      <section aria-labelledby="journal" className="py-secao">
        <div className="conteiner">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <CabecalhoSecao id="journal" rotulo="Social Journal" titulo="Para escolher com mais segurança." texto="Guias curtos sobre caimento, cores, trajes e cuidados com as peças." />
            <Link href="/journal/" className="link-editorial shrink-0" data-revelar>
              Todos os textos
              <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-14">
            <JournalPreview />
          </div>
        </div>
      </section>

      {/* 10 · CTA final */}
      <EditorialCTA />
    </>
  );
}
