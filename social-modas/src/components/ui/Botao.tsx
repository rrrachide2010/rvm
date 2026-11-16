import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "contorno" | "claro" | "contorno-claro";

const ESTILOS: Record<Variante, string> = {
  primario: "bg-bordeaux text-ivory hover:bg-bordeaux-deep",
  contorno: "border border-graphite/30 text-graphite hover:border-bordeaux hover:text-bordeaux",
  claro: "bg-ivory text-bordeaux hover:bg-white",
  "contorno-claro": "border border-sand/60 text-ivory hover:border-ivory hover:bg-ivory/5",
};

export const classeBotao = (variante: Variante = "primario", extra = "") =>
  [
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-peca px-7",
    "text-[0.8125rem] font-medium tracking-[0.12em] uppercase",
    "transition-[background-color,border-color,color,transform] duration-400 ease-suave",
    "active:translate-y-px",
    ESTILOS[variante],
    extra,
  ].join(" ");

type Props = {
  href: string;
  variante?: Variante;
  children: ReactNode;
  className?: string;
  externo?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/**
 * Botão-link. Interno usa <Link> (pré-carrega a página); externo abre em
 * outra aba com `noopener`.
 */
export function Botao({ href, variante = "primario", children, className = "", externo, ...resto }: Props) {
  const classe = classeBotao(variante, className);
  if (externo || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classe} {...resto}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classe} {...resto}>
      {children}
    </Link>
  );
}
