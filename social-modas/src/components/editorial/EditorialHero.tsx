import { ArrowRight } from "lucide-react";
import { Botao } from "@/components/ui/Botao";
import { Foto } from "@/components/ui/Foto";
import { UNIDADES } from "@/data/lojas";

/**
 * Módulo 01. Texto e foto lado a lado no desktop; no celular o texto vem
 * primeiro, para os dois botões caberem na primeira tela, e a foto logo
 * abaixo, em composição própria (4:5, sem a foto de apoio).
 *
 * A foto principal é de um cliente na loja, diante do letreiro; a de apoio,
 * do photobook da marca. Nenhuma é ilustrativa.
 */
export function EditorialHero() {
  const cidades = UNIDADES.map((u) => u.cidade);
  const listaCidades = `${cidades.slice(0, -1).join(", ")} e ${cidades.at(-1)}`;

  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden pt-[4.5rem]">
      <div className="conteiner grid grid-cols-1 items-center gap-12 pt-10 pb-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20 lg:py-16">
        <div className="max-w-xl">
          <p className="rotulo flex items-center gap-3 motion-safe:animate-[revelar-titulo_700ms_var(--ease-entrada)_both]">
            <span className="filete" aria-hidden="true" />
            Moda feminina e masculina
          </p>
          <h1 id="hero-titulo" className="mt-7 text-display text-creme motion-safe:animate-revelar-titulo motion-safe:[animation-delay:120ms]">
            A primeira impressão <em className="block">também veste.</em>
          </h1>
          <p className="mt-7 max-w-md text-lead text-nevoa motion-safe:animate-[revelar-titulo_900ms_var(--ease-entrada)_300ms_both]">
            Moda feminina e masculina para acompanhar você em cada ocasião.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row motion-safe:animate-[revelar-titulo_900ms_var(--ease-entrada)_420ms_both]">
            <Botao href="/colecoes/">
              Explorar coleções
              <ArrowRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden="true" />
            </Botao>
            <Botao href="/lojas/" variante="contorno">
              Encontrar uma loja
            </Botao>
          </div>
          <p className="mt-12 hidden max-w-sm border-t border-fio pt-5 text-legenda text-nevoa lg:block">
            Atendimento em {listaCidades}.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-peca bg-superficie motion-safe:animate-surgir lg:ml-auto lg:aspect-[3/4] lg:max-h-[82svh] lg:w-auto">
            <div className="parallax-suave absolute -inset-y-6 inset-x-0">
              <Foto
                src="/assets/look-3.jpg"
                alt="Homem de blazer marinho e camisa branca diante do letreiro da Social Modas"
                sizes="(min-width: 1024px) 45vw, 100vw"
                prioridade
                posicao="50% 30%"
              />
            </div>
          </div>
          <figure className="absolute -bottom-8 -left-6 hidden w-[34%] overflow-hidden rounded-peca border-[6px] border-tinta shadow-[0_24px_48px_-28px_rgb(41_40_43/0.5)] lg:block">
            <div className="relative aspect-[3/4]">
              <Foto src="/assets/pb-branco-3.jpg" alt="Detalhe de camisa social branca" sizes="16vw" />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
