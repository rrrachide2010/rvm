"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Faixa horizontal com rolagem nativa (dedo, trackpad, teclado) e dois
 * botões para quem usa mouse. Os botões somem quando tudo cabe na tela e
 * desligam no começo e no fim: nenhum botão decorativo sem ação.
 *
 * `id="grade"` é o que o analytics da marca observa para contar produtos
 * vistos; só pode existir uma por página.
 */
export function ProductCarousel({ children, rotulo, grade = false }: { children: ReactNode; rotulo: string; grade?: boolean }) {
  const trilho = useRef<HTMLUListElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(true);

  const medir = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    setInicio(el.scrollLeft <= 4);
    setFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [medir]);

  const rolar = (sentido: 1 | -1) => {
    const el = trilho.current;
    if (!el) return;
    const item = el.querySelector("li");
    const passo = item ? item.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: passo * sentido, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const semRolagem = inicio && fim;

  return (
    <div className="relative">
      <ul
        ref={trilho}
        id={grade ? "grade" : undefined}
        aria-label={rotulo}
        className="-mx-[var(--spacing-gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      {!semRolagem ? (
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => rolar(-1)}
            disabled={inicio}
            aria-label="Peças anteriores"
            className="inline-flex size-12 items-center justify-center rounded-full border border-graphite/25 text-graphite transition-colors hover:border-bordeaux hover:text-bordeaux disabled:cursor-default disabled:opacity-35 disabled:hover:border-graphite/25 disabled:hover:text-graphite"
          >
            <ChevronLeft className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => rolar(1)}
            disabled={fim}
            aria-label="Próximas peças"
            className="inline-flex size-12 items-center justify-center rounded-full border border-graphite/25 text-graphite transition-colors hover:border-bordeaux hover:text-bordeaux disabled:cursor-default disabled:opacity-35 disabled:hover:border-graphite/25 disabled:hover:text-graphite"
          >
            <ChevronRight className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ItemCarrossel({ children }: { children: ReactNode }) {
  return <li className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-3.75rem)/4)]">{children}</li>;
}
