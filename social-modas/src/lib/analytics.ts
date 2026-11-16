type SMAnalytics = { enviar: (tipo: string, extra?: { produto_id?: string; valor?: number | null; dados?: unknown }) => void };

/**
 * Manda um evento para o analytics próprio da marca (`/analytics.js`).
 * O script carrega com atraso de propósito; se ainda não chegou, tenta de
 * novo por até 6 segundos e desiste em silêncio. Medir nunca atrapalha.
 */
export function registrar(tipo: string, extra?: Parameters<SMAnalytics["enviar"]>[1]) {
  if (typeof window === "undefined") return;
  let tentativas = 0;
  const tentar = () => {
    const sm = (window as unknown as { SMAnalytics?: SMAnalytics }).SMAnalytics;
    if (sm) {
      try {
        sm.enviar(tipo, extra);
      } catch {
        /* nada */
      }
      return;
    }
    if (++tentativas < 12) window.setTimeout(tentar, 500);
  };
  tentar();
}
