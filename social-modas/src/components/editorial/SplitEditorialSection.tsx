import type { ReactNode } from "react";
import { Foto } from "@/components/ui/Foto";

type Props = {
  id?: string;
  foto: string;
  fotoAlt: string;
  posicaoFoto?: string;
  /** Proporção do quadro da foto no desktop. */
  proporcao?: "aspect-[4/5]" | "aspect-[3/4]" | "aspect-[4/3]" | "aspect-[5/4]";
  fotoADireita?: boolean;
  fundo?: "ivory" | "papel" | "sand";
  legenda?: string;
  children: ReactNode;
};

const FUNDOS = { ivory: "bg-ivory", papel: "bg-papel", sand: "bg-sand/40" } as const;

/** Imagem e texto divididos. Reutilizado em história, atendimento e páginas internas. */
export function SplitEditorialSection({
  id,
  foto,
  fotoAlt,
  posicaoFoto,
  proporcao = "aspect-[4/5]",
  fotoADireita,
  fundo = "ivory",
  legenda,
  children,
}: Props) {
  return (
    <section id={id} className={`${FUNDOS[fundo]} py-secao`}>
      <div className="conteiner grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <figure className={`${fotoADireita ? "lg:order-2" : ""}`} data-revelar>
          <div className={`relative ${proporcao} overflow-hidden rounded-peca bg-sand`}>
            <Foto src={foto} alt={fotoAlt} sizes="(min-width: 1024px) 50vw, 100vw" posicao={posicaoFoto} />
          </div>
          {legenda ? <figcaption className="mt-3 text-legenda text-taupe-ink">{legenda}</figcaption> : null}
        </figure>
        <div className="max-w-xl" data-revelar style={{ "--ordem": 1 } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </section>
  );
}
