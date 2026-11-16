import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "contorno" | "claro" | "contorno-claro";

/* Dourado do site anterior: degradê por cima de um fundo ouro sólido (o
   sólido é o que o auditor de contraste e quem tem o degradê desligado veem). */
const OURO =
  "bg-ouro bg-[linear-gradient(135deg,var(--color-ouro-escuro),var(--color-ouro)_45%,var(--color-ouro-claro)_62%,var(--color-ouro)_80%,var(--color-ouro-escuro))] text-[#1a0509] font-semibold shadow-[0_6px_26px_rgb(234_192_123/0.14)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(234_192_123/0.28)]";

const ESTILOS: Record<Variante, string> = {
  primario: OURO,
  contorno: "border border-fio-forte bg-ouro/[0.03] text-creme hover:-translate-y-0.5 hover:border-ouro hover:bg-ouro/[0.09]",
  claro: OURO,
  "contorno-claro": "border border-fio-forte text-creme hover:-translate-y-0.5 hover:border-ouro hover:bg-ouro/[0.09]",
};

export const classeBotao = (variante: Variante = "primario", extra = "") =>
  [
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-peca px-7",
    "text-[0.8125rem] font-medium tracking-[0.12em] uppercase",
    "transition-[background-color,border-color,color,transform,box-shadow] duration-400 ease-suave",
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
