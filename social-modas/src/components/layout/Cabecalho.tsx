"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { NAV_PRINCIPAL } from "@/data/navegacao";
import { Marca } from "@/components/ui/Marca";

/**
 * Cabeçalho fixo. Sobre o topo da página ele é transparente; depois de
 * 24px de rolagem ganha fundo e um filete, com transição de 400ms.
 *
 * O menu móvel prende o foco, fecha com Esc e na troca de página, e devolve
 * o foco ao botão que o abriu. A entrada é CSS puro: o cabeçalho está em
 * todas as páginas, e a biblioteca de animação custaria ~43 KB em cada uma.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Fecha o menu ao navegar. Ajuste durante o render (padrão recomendado
  // pelo React) em vez de efeito, que custaria um render extra.
  const [caminhoVisto, setCaminhoVisto] = useState(caminho);
  if (caminho !== caminhoVisto) {
    setCaminhoVisto(caminho);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const primeiro = painelRef.current?.querySelector<HTMLElement>("a, button");
    primeiro?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !painelRef.current) return;
      const focaveis = painelRef.current.querySelectorAll<HTMLElement>("a, button");
      const ini = focaveis[0];
      const fim = focaveis[focaveis.length - 1];
      if (!ini || !fim) return;
      if (e.shiftKey && document.activeElement === ini) {
        e.preventDefault();
        fim.focus();
      } else if (!e.shiftKey && document.activeElement === fim) {
        e.preventDefault();
        ini.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const ativo = (href: string) => caminho === href || (href !== "/" && caminho?.startsWith(href));

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-400 ease-suave",
        // Com o menu aberto, fundo sólido e SEM backdrop-filter: o filtro cria um
        // bloco de contenção para filhos `fixed`, e o painel do menu ficaria
        // preso dentro dos 72px do cabeçalho, com altura zero.
        aberto
          ? "bg-tinta shadow-[0_1px_0_var(--color-fio)]"
          : rolou
            ? "bg-tinta/95 shadow-[0_1px_0_var(--color-fio)] backdrop-blur-md"
            : "bg-transparent",
      ].join(" ")}
    >
      <div className="conteiner flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 flex min-h-11 items-center text-ouro" aria-label="Social Modas, página inicial">
          <Marca />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_PRINCIPAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className="group relative inline-flex min-h-11 items-center text-[0.8125rem] font-medium tracking-[0.1em] text-creme uppercase transition-colors hover:text-ouro aria-[current=page]:text-ouro"
                >
                  {item.texto}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-2.5 h-px origin-left scale-x-0 bg-marsala transition-transform duration-400 ease-suave group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Link href="/lojas/" className="inline-flex size-11 items-center justify-center text-creme hover:text-ouro" aria-label="Encontrar uma loja">
            <MapPin className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </Link>
          <button
            ref={botaoRef}
            type="button"
            className="relative z-10 inline-flex size-11 items-center justify-center text-creme hover:text-ouro"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X className="size-6" strokeWidth={1.5} aria-hidden="true" /> : <Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {aberto ? (
          <div
            id="menu-movel"
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-tinta motion-safe:animate-[menu-entrar_300ms_var(--ease-suave)_both] lg:hidden"
          >
            <nav aria-label="Principal" className="conteiner border-t border-fio pt-6 pb-12">
              <ul>
                {NAV_PRINCIPAL.map((item, i) => (
                  <li
                    key={item.href}
                    className="border-b border-fio motion-safe:animate-[menu-entrar_300ms_var(--ease-suave)_both]"
                    style={{ animationDelay: `${40 * i}ms` }}
                  >
                    <Link
                      href={item.href}
                      aria-current={ativo(item.href) ? "page" : undefined}
                      className="flex min-h-16 items-center justify-between font-serif text-[1.5rem] text-creme aria-[current=page]:text-ouro"
                    >
                      {item.texto}
                    </Link>
                  </li>
                ))}
                <li className="border-b border-fio">
                  <Link href="/journal/" className="flex min-h-16 items-center font-serif text-[1.5rem] text-creme">
                    Social Journal
                  </Link>
                </li>
              </ul>
              <Link href="/lojas/" className="mt-8 flex min-h-12 items-center justify-center gap-2 bg-marsala px-6 text-[0.8125rem] font-medium tracking-[0.12em] text-creme uppercase">
                <MapPin className="size-4" strokeWidth={1.8} aria-hidden="true" />
                Encontrar uma loja
              </Link>
            </nav>
          </div>
        ) : null}
    </header>
  );
}
