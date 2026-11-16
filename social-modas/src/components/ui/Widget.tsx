import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  rotulo: string;
  Icone: LucideIcon;
  titulo: ReactNode;
  children?: ReactNode;
  /** Destino do widget inteiro. Externo abre em outra aba. */
  href?: string;
  /** Texto do rodapé com seta. Só aparece com `href`. */
  acao?: string;
  className?: string;
  ordem?: number;
  /** Fundo marsala, para o widget que é chamada de ação. */
  destaque?: boolean;
};

/**
 * Widget no estilo do site anterior: cartão com cantos de 24px, borda de
 * fio dourado e sombra profunda. Quando tem `href`, o cartão inteiro é o
 * link (um único alvo de clique, sem link dentro de link).
 */
export function Widget({ rotulo, Icone, titulo, children, href, acao, className = "", ordem = 0, destaque }: Props) {
  const externo = href?.startsWith("http");
  const corpo = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="rotulo">{rotulo}</p>
        <span className={`grid size-9 place-items-center rounded-full border ${destaque ? "border-ouro/40 bg-ouro/10" : "border-fio bg-ouro/[0.06]"}`} aria-hidden="true">
          <Icone className="size-4 text-ouro" strokeWidth={1.6} />
        </span>
      </div>
      <h3 className="mt-5 font-serif text-[1.375rem] leading-tight text-creme">{titulo}</h3>
      {children ? <div className="mt-3 flex-1 text-legenda leading-relaxed text-nevoa">{children}</div> : <div className="flex-1" />}
      {href && acao ? (
        <span className="mt-6 inline-flex items-center gap-2 text-[0.75rem] font-medium tracking-[0.14em] text-ouro uppercase">
          {acao}
          <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  const classe = `cartao group flex h-full flex-col p-6 sm:p-7 ${destaque ? "sobre-bordeaux !bg-marsala !bg-none" : ""} ${className}`;
  const estilo = { "--ordem": ordem } as CSSProperties;

  if (!href) {
    return (
      <div className={classe} style={estilo} data-revelar>
        {corpo}
      </div>
    );
  }
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classe} style={estilo} data-revelar>
        {corpo}
      </a>
    );
  }
  return (
    <Link href={href} className={classe} style={estilo} data-revelar>
      {corpo}
    </Link>
  );
}
