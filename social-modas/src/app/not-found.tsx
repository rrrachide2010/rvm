import { ArrowRight } from "lucide-react";
import { Botao } from "@/components/ui/Botao";

export default function NaoEncontrada() {
  return (
    <section className="pt-[4.5rem]">
      <div className="conteiner flex min-h-[70svh] flex-col items-start justify-center py-secao">
        <p className="rotulo flex items-center gap-3">
          <span className="filete" aria-hidden="true" />
          Página não encontrada
        </p>
        <h1 className="mt-5 max-w-2xl text-h1 text-creme">Esta página saiu da vitrine.</h1>
        <p className="mt-5 max-w-md text-lead text-nevoa">O endereço pode ter mudado. As coleções e as lojas continuam no mesmo lugar.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Botao href="/colecoes/">
            Ver coleções
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Botao>
          <Botao href="/" variante="contorno">
            Página inicial
          </Botao>
        </div>
      </div>
    </section>
  );
}
