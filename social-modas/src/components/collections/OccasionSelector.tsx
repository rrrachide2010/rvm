"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Foto } from "@/components/ui/Foto";
import type { Ocasiao } from "@/data/ocasioes";

type ProdutoResumo = { id: string; nome: string };

/**
 * Módulo 04. Abas acessíveis (setas, Home e End trocam de ocasião; só a
 * aba ativa entra no Tab). Cada painel leva à página da ocasião, que lista
 * as peças reais relacionadas.
 */
export function OccasionSelector({ ocasioes, produtos }: { ocasioes: Ocasiao[]; produtos: Record<string, ProdutoResumo> }) {
  const [ativa, setAtiva] = useState(0);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const reduzir = useReducedMotion();
  const atual = ocasioes[ativa];
  if (!atual) return null;

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const ultimo = ocasioes.length - 1;
    const mapa: Record<string, number> = {
      ArrowRight: ativa === ultimo ? 0 : ativa + 1,
      ArrowDown: ativa === ultimo ? 0 : ativa + 1,
      ArrowLeft: ativa === 0 ? ultimo : ativa - 1,
      ArrowUp: ativa === 0 ? ultimo : ativa - 1,
      Home: 0,
      End: ultimo,
    };
    const proxima = mapa[e.key];
    if (proxima === undefined) return;
    e.preventDefault();
    setAtiva(proxima);
    abas.current[proxima]?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
      <div
        role="tablist"
        aria-label="Ocasiões"
        aria-orientation="vertical"
        onKeyDown={aoTeclar}
        className="-mx-[var(--spacing-gutter)] flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {ocasioes.map((o, i) => {
          const selecionada = i === ativa;
          return (
            <button
              key={o.slug}
              ref={(el) => {
                abas.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-aba-${i}`}
              aria-selected={selecionada}
              aria-controls={`${base}-painel`}
              tabIndex={selecionada ? 0 : -1}
              onClick={() => setAtiva(i)}
              className={[
                "group relative shrink-0 text-left transition-colors duration-400",
                "min-h-11 rounded-full border px-5 lg:flex lg:min-h-0 lg:items-baseline lg:gap-5 lg:rounded-none lg:border-0 lg:border-b lg:border-fio lg:px-0 lg:py-5",
                selecionada
                  ? "border-ouro bg-marsala text-creme lg:bg-transparent lg:text-ouro"
                  : "border-creme/20 text-creme hover:text-ouro",
              ].join(" ")}
            >
              <span className="hidden font-sans text-rotulo text-fosco tabular-nums lg:inline" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.875rem] font-medium lg:font-serif lg:text-[1.5rem] lg:leading-tight lg:font-normal">{o.titulo}</span>
              <span
                aria-hidden="true"
                className={`absolute bottom-[-1px] left-0 hidden h-px bg-marsala transition-[width] duration-[600ms] ease-suave lg:block ${selecionada ? "w-full" : "w-0"}`}
              />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${base}-painel`} aria-labelledby={`${base}-aba-${ativa}`} tabIndex={0} className="relative">
        <LazyMotion features={domAnimation} strict>
<AnimatePresence mode="wait" initial={false}>
          <m.div
            key={atual.slug}
            initial={reduzir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduzir ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-end"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-peca bg-superficie">
              <Foto src={atual.foto} alt={atual.fotoAlt} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw" posicao="50% 25%" />
            </div>
            <div>
              <p className="font-serif text-h3 text-ouro">{atual.resumo}</p>
              <p className="mt-4 text-nevoa">{atual.texto}</p>
              <p className="mt-6 rotulo">Peças para esta ocasião</p>
              <ul className="mt-2 divide-y divide-fio border-y border-fio">
                {atual.produtos.map((id) => {
                  const p = produtos[id];
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Link href={`/produtos/${id}/`} className="flex min-h-11 items-center justify-between gap-3 text-[0.9375rem] text-creme hover:text-ouro">
                        {p.nome}
                        <ArrowRight className="size-4 shrink-0 text-fosco" strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-legenda text-fosco">{atual.notaFeminina}</p>
              <Link href={`/ocasioes/${atual.slug}/`} className="link-editorial mt-6">
                Tudo para {atual.titulo.toLowerCase()}
                <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
</LazyMotion>
      </div>
    </div>
  );
}
