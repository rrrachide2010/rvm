"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Liga a revelação ao rolar: tudo que tem `data-revelar` ganha a classe
 * `visivel` quando entra na tela. O CSS em globals.css só esconde esses
 * elementos quando a classe `js` está no <html>, então sem este script
 * nada fica invisível.
 */
export function Revelador() {
  const caminho = usePathname();

  useEffect(() => {
    const alvos = document.querySelectorAll<HTMLElement>("[data-revelar]:not(.visivel)");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visivel");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [caminho]);

  return null;
}
