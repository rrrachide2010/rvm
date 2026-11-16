import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ARTIGOS, minutosDeLeitura, type Artigo } from "@/data/journal";

/** Cartão tipográfico de artigo: sem foto, para não repetir as imagens da vitrine. */
export function CartaoArtigo({ artigo, indice }: { artigo: Artigo; indice: number }) {
  return (
    <article className="group relative flex h-full flex-col border-t border-graphite/80 pt-6" data-revelar style={{ "--ordem": indice } as React.CSSProperties}>
      <div className="flex items-center justify-between">
        <p className="rotulo">{artigo.tema}</p>
        <p className="text-legenda text-mute">{minutosDeLeitura(artigo)} min de leitura</p>
      </div>
      <h3 className="mt-6 font-serif text-[1.5rem] leading-[1.2] text-graphite transition-colors duration-400 group-hover:text-bordeaux">
        <Link href={`/journal/${artigo.slug}/`} className="after:absolute after:inset-0">
          {artigo.titulo}
        </Link>
      </h3>
      <p className="mt-4 text-mute">{artigo.resumo}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.8125rem] font-medium tracking-[0.1em] text-bordeaux uppercase" aria-hidden="true">
        Ler
        <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
      </span>
    </article>
  );
}

export function JournalPreview({ quantidade = 3 }: { quantidade?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
      {ARTIGOS.slice(0, quantidade).map((a, i) => (
        <CartaoArtigo key={a.slug} artigo={a} indice={i} />
      ))}
    </div>
  );
}
