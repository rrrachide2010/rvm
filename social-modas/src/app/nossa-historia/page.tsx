import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SplitEditorialSection } from "@/components/editorial/SplitEditorialSection";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { Foto } from "@/components/ui/Foto";
import { Botao } from "@/components/ui/Botao";
import { MARCA } from "@/data/marca";
import { UNIDADES } from "@/data/lojas";
import { metadados } from "@/lib/seo";

export const metadata = metadados({
  titulo: "Nossa história",
  descricao: `A Social Modas veste o ${MARCA.regiao} há ${MARCA.tradicao}. Conheça a rede, o jeito de atender e o que não mudou desde a primeira loja.`,
  caminho: "/nossa-historia/",
  imagem: "/assets/fachada.jpg",
});

/**
 * Narrativa curta e sem linha do tempo: só o que a marca já afirmava no site
 * anterior (tradição, crescimento a partir de uma loja, atendimento no
 * provador). Datas e números que exigem atualização ficaram de fora.
 */
export default function NossaHistoria() {
  const cidades = UNIDADES.map((u) => u.cidade);
  return (
    <>
      <section className="pt-[4.5rem]">
        <div className="conteiner pt-10">
          <Breadcrumbs itens={[{ texto: "Nossa história" }]} />
          <div className="mt-12 max-w-4xl">
            <p className="rotulo flex items-center gap-3">
              <span className="filete" aria-hidden="true" />
              Nossa história
            </p>
            <h1 className="mt-5 text-display text-creme">Começou com uma loja. O jeito de atender é o mesmo.</h1>
          </div>
        </div>
        <div className="conteiner mt-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-peca bg-superficie sm:aspect-[21/9]">
            <Foto src="/assets/fachada.jpg" alt="Fachada de uma loja Social Modas, com vitrine de moda feminina e masculina" sizes="100vw" prioridade posicao="50% 40%" />
          </div>
        </div>
      </section>

      <section className="py-secao">
        <div className="conteiner grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:gap-24">
          <p className="font-serif text-h3 text-ouro">São {MARCA.tradicao} vestindo o {MARCA.regiao}.</p>
          <div className="prosa max-w-2xl text-lead text-nevoa">
            <p>
              A Social Modas nasceu como uma loja de roupa social e cresceu peça por peça, cliente por cliente. Hoje é uma rede de lojas,
              com moda feminina e masculina para o trabalho, para as festas e para o dia a dia.
            </p>
            <p>
              O que não mudou foi o atendimento: provador com calma, fita métrica na mão e ajuste feito para o corpo de quem vai usar.
            </p>
            <p>Atendemos em {`${cidades.slice(0, -1).join(", ")} e ${cidades.at(-1)}`}, com lojas físicas e atendimento pelo WhatsApp.</p>
          </div>
        </div>
      </section>

      <SplitEditorialSection
        foto="/assets/gal-01-time.jpg"
        fotoAlt="Equipe da Social Modas de terno, reunida dentro da loja"
        proporcao="aspect-[4/3]"
        posicaoFoto="50% 60%"
        fundo="papel"
        legenda="Equipe Social Modas."
      >
        <p className="rotulo flex items-center gap-3">
          <span className="filete" aria-hidden="true" />
          Quem atende
        </p>
        <h2 className="mt-5 text-h2 text-creme">Gente que entende de caimento.</h2>
        <p className="mt-6 text-lead text-nevoa">
          Na loja, você fala com quem conhece as peças, o tecido e a modelagem. A equipe ajuda a escolher pela ocasião, acerta o tamanho e
          indica o ajuste quando ele é necessário.
        </p>
        <div className="mt-9">
          <Botao href="/lojas/">
            Encontre sua loja
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Botao>
        </div>
      </SplitEditorialSection>

      <section className="py-secao">
        <div className="conteiner grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { src: "/assets/look-2.jpg", alt: "Homem de terno bege na loja Social Modas" },
            { src: "/assets/foto-quem-somos.jpg", alt: "Dois homens de terno azul" },
            { src: "/assets/gal-04-barbearia.jpg", alt: "Homem de terno cinza sentado em uma cadeira de barbearia" },
          ].map((f, i) => (
            <figure key={f.src} className="relative aspect-[3/4] overflow-hidden rounded-peca bg-superficie" data-revelar style={{ "--ordem": i } as React.CSSProperties}>
              <Foto src={f.src} alt={f.alt} sizes="(min-width: 640px) 33vw, 100vw" posicao="50% 25%" />
            </figure>
          ))}
        </div>
        <p className="conteiner mt-4 text-legenda text-fosco">Da galeria da Social Modas.</p>
      </section>

      <EditorialCTA />
    </>
  );
}
