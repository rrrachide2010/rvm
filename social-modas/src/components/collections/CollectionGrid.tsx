import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Foto } from "@/components/ui/Foto";
import { SimboloMarca } from "@/components/ui/Marca";
import { COLECOES, opcoesDa, type Colecao } from "@/data/colecoes";

/**
 * Módulo 02. Grade assimétrica: cada cartão tem uma proporção diferente
 * no desktop. No celular vira uma coluna, com o feminino e o masculino
 * lado a lado no topo.
 *
 * Posições por slug, para a grade não depender da ordem do array.
 */
const POSICAO: Record<string, string> = {
  masculino: "lg:col-span-5 lg:row-span-2 min-h-[26rem] lg:min-h-0",
  feminino: "lg:col-span-7 min-h-[20rem]",
  alfaiataria: "lg:col-span-4 min-h-[22rem]",
  camisas: "lg:col-span-3 min-h-[22rem]",
};

function Cartao({ colecao, ordem }: { colecao: Colecao; ordem: number }) {
  const total = opcoesDa(colecao);
  const href = `/colecoes/${colecao.slug}/`;
  const posicao = POSICAO[colecao.slug] ?? "lg:col-span-4 min-h-[22rem]";

  if (!colecao.foto) {
    // Cartão tipográfico: a coleção feminina, sem fotos por decisão da marca.
    return (
      <Link
        href={href}
        data-revelar
        style={{ "--ordem": ordem } as React.CSSProperties}
        className={`sobre-bordeaux group relative flex flex-col justify-between overflow-hidden rounded-peca bg-bordeaux p-8 text-ivory sm:p-10 ${posicao}`}
      >
        <SimboloMarca className="absolute -right-10 -bottom-12 w-72 text-white/[0.05] transition-transform duration-[900ms] ease-suave group-hover:scale-105" />
        <p className="rotulo !text-sand">Coleção</p>
        <div className="relative">
          <h3 className="font-serif text-[clamp(2.5rem,1.9rem+2.6vw,4rem)] leading-none text-ivory">{colecao.titulo}</h3>
          <p className="mt-4 max-w-sm text-lead text-sand">{colecao.chamada}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium tracking-[0.12em] uppercase">
            {total > 0 ? `Ver ${total} ${total === 1 ? "opção" : "opções"}` : "Saiba como comprar"}
            <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} aria-hidden="true" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      data-revelar
      style={{ "--ordem": ordem } as React.CSSProperties}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-peca bg-sand p-7 sm:p-8 ${posicao}`}
    >
      <Foto
        src={colecao.foto}
        alt=""
        sizes="(min-width: 1024px) 40vw, 100vw"
        posicao="50% 25%"
        imgClassName="transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.04]"
      />
      {/* Véu só na base, onde fica o texto: a foto continua limpa em cima. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/25 to-transparent" />
      <div className="relative text-ivory">
        <h3 className="font-serif text-[clamp(1.75rem,1.45rem+1.3vw,2.5rem)] leading-none">{colecao.titulo}</h3>
        <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/90">{colecao.chamada}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.75rem] font-medium tracking-[0.14em] uppercase opacity-90 transition-opacity duration-400 group-hover:opacity-100">
          Ver {total} {total === 1 ? "opção" : "opções"}
          <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function CollectionGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(18rem,auto)] lg:grid-cols-12 lg:gap-5">
      {COLECOES.map((c, i) => (
        <Cartao key={c.slug} colecao={c} ordem={i} />
      ))}
    </div>
  );
}
