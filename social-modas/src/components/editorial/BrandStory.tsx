import { ArrowRight } from "lucide-react";
import { SplitEditorialSection } from "./SplitEditorialSection";
import { Botao } from "@/components/ui/Botao";
import { MARCA } from "@/data/marca";

/** Módulo 06. Curto de propósito: a história completa mora em /nossa-historia/. */
export function BrandStory() {
  return (
    <SplitEditorialSection
      id="nossa-historia"
      foto="/assets/fachada.jpg"
      fotoAlt="Fachada de uma loja Social Modas, com vitrine de moda feminina e masculina"
      proporcao="aspect-[4/3]"
      fundo="papel"
      legenda="Fachada de uma das lojas Social Modas."
    >
      <p className="rotulo flex items-center gap-3">
        <span className="filete" aria-hidden="true" />
        Nossa história
      </p>
      <h2 className="mt-5 text-h2 text-creme">Uma loja de cada vez, um cliente de cada vez.</h2>
      <div className="prosa mt-6 text-lead text-nevoa">
        <p>
          São {MARCA.tradicao} vestindo o {MARCA.regiao}. A Social Modas começou com uma loja e cresceu até virar
          uma rede, sem mudar o jeito de atender.
        </p>
        <p>Provador com calma, fita métrica na mão e ajuste feito para o corpo de quem vai usar.</p>
      </div>
      <div className="mt-9">
        <Botao href="/nossa-historia/" variante="contorno">
          Conheça a Social Modas
          <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
        </Botao>
      </div>
    </SplitEditorialSection>
  );
}
