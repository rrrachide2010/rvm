import { ArrowRight } from "lucide-react";
import { Botao } from "@/components/ui/Botao";
import { SimboloMarca } from "@/components/ui/Marca";

type Props = {
  titulo?: string;
  texto?: string;
};

/** Módulo 10. O único bloco inteiro em bordeaux além do rodapé. */
export function EditorialCTA({
  titulo = "Encontre o que combina com você.",
  texto = "Explore nossas coleções ou visite uma Social Modas perto de você.",
}: Props) {
  return (
    <section aria-labelledby="cta-final" className="sobre-bordeaux relative overflow-hidden bg-marsala py-secao text-creme">
      <SimboloMarca className="pointer-events-none absolute top-1/2 -right-24 w-[34rem] -translate-y-1/2 text-white/[0.04]" />
      <div className="conteiner relative text-center" data-revelar>
        <span className="filete mx-auto !bg-superficie" aria-hidden="true" />
        <h2 id="cta-final" className="mx-auto mt-8 max-w-3xl text-h1 text-creme">{titulo}</h2>
        <p className="mx-auto mt-6 max-w-lg text-lead text-ouro">{texto}</p>
        <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
          <Botao href="/colecoes/" variante="claro">
            Explorar coleções
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Botao>
          <Botao href="/lojas/" variante="contorno-claro">
            Encontrar uma loja
          </Botao>
        </div>
      </div>
    </section>
  );
}
