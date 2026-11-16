"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Foto } from "@/components/ui/Foto";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { classeBotao } from "@/components/ui/Botao";

export type PecaResolvida = {
  produtoId: string;
  papel: string;
  nome: string;
  cor?: string;
  foto: string;
  preco: number | null;
  href: string;
};

export type LookResolvido = {
  id: string;
  titulo: string;
  ocasiao: string;
  texto: string;
  complemento: string;
  pecas: PecaResolvida[];
  /** Link de WhatsApp já montado no servidor, com a lista de peças. */
  whatsapp: string;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Módulo 05. Escolha um look, depois uma peça: a foto grande mostra a peça
 * escolhida e o link leva direto a ela, na cor do look. Sem conta, sem
 * carrinho novo, sem IA: composições fixas de produtos reais.
 */
export function LookBuilder({ looks, mostrarPrecos }: { looks: LookResolvido[]; mostrarPrecos: boolean }) {
  const [lookAtivo, setLookAtivo] = useState(0);
  const [pecaAtiva, setPecaAtiva] = useState(0);
  const reduzir = useReducedMotion();

  const look = looks[lookAtivo];
  if (!look) return null;
  const peca = look.pecas[pecaAtiva] ?? look.pecas[0];
  if (!peca) return null;

  const precos = look.pecas.map((p) => p.preco);
  const total = precos.every((p): p is number => typeof p === "number") ? precos.reduce((a, b) => a + b, 0) : null;

  const escolherLook = (i: number) => {
    setLookAtivo(i);
    setPecaAtiva(0);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-peca bg-superficie">
          <LazyMotion features={domAnimation} strict>
<AnimatePresence initial={false}>
            <m.div
              key={`${look.id}-${peca.produtoId}-${peca.cor ?? ""}`}
              className="absolute inset-0"
              initial={reduzir ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Foto src={peca.foto} alt={`${peca.nome}${peca.cor ? `, cor ${peca.cor}` : ""}`} sizes="(min-width: 1024px) 44vw, 100vw" posicao="50% 30%" />
            </m.div>
          </AnimatePresence>
</LazyMotion>
        </div>
        <p className="mt-3 text-legenda text-fosco" aria-live="polite">
          {peca.papel}: {peca.nome}
          {peca.cor ? `, ${peca.cor}` : ""}
        </p>
      </div>

      <div>
        <div role="group" aria-label="Escolha um look" className="flex flex-wrap gap-2">
          {looks.map((l, i) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={i === lookAtivo}
              onClick={() => escolherLook(i)}
              className="min-h-11 rounded-full border border-creme/20 px-5 text-[0.875rem] font-medium text-creme transition-colors duration-400 hover:border-ouro hover:text-ouro aria-pressed:border-ouro aria-pressed:bg-marsala aria-pressed:text-creme"
            >
              {l.titulo}
            </button>
          ))}
        </div>

        <p className="mt-10 rotulo">{look.ocasiao}</p>
        <p className="mt-3 font-serif text-h3 text-creme">{look.texto}</p>

        <ul className="mt-8 divide-y divide-fio border-y border-fio" aria-label={`Peças do look ${look.titulo}`}>
          {look.pecas.map((p, i) => {
            const ativa = i === pecaAtiva;
            return (
              <li key={`${p.produtoId}-${p.cor ?? ""}`} className="flex items-center gap-4 py-4">
                <button
                  type="button"
                  onClick={() => setPecaAtiva(i)}
                  aria-pressed={ativa}
                  aria-label={`Mostrar ${p.papel.toLowerCase()}: ${p.nome}`}
                  className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-peca bg-superficie outline-offset-2 transition-shadow duration-400 ${ativa ? "ring-2 ring-ouro ring-offset-2 ring-offset-ivory" : "opacity-80 hover:opacity-100"}`}
                >
                  <Foto src={p.foto} alt="" sizes="64px" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="rotulo">{p.papel}</p>
                  <p className="mt-1 truncate text-[0.9375rem] font-medium text-creme">
                    {p.nome}
                    {p.cor ? <span className="font-normal text-nevoa">, {p.cor}</span> : null}
                  </p>
                  {mostrarPrecos && p.preco ? <p className="mt-0.5 text-legenda text-nevoa">{brl.format(p.preco)}</p> : null}
                </div>
                <Link href={p.href} className="link-editorial shrink-0 text-[0.875rem]">
                  Ver peça
                  <ArrowRight className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>

        {mostrarPrecos && total ? (
          <p className="mt-5 flex items-baseline justify-between text-[0.9375rem] text-creme">
            <span>Peças do look</span>
            <span className="font-medium">{brl.format(total)}</span>
          </p>
        ) : null}
        <p className="mt-3 text-legenda text-fosco">{look.complemento}</p>

        <a href={look.whatsapp} target="_blank" rel="noopener noreferrer" className={classeBotao("contorno", "mt-8 w-full sm:w-auto")}>
          <IconeWhatsApp className="size-4" />
          Consultar este look na loja
        </a>
      </div>
    </div>
  );
}
