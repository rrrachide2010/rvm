/** Link `wa.me` com mensagem pronta. O número vai só com dígitos e DDI. */
export function linkWhatsApp(numero: string, mensagem?: string): string {
  const base = `https://wa.me/${numero.replace(/\D/g, "")}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export type PedidoDeReserva = {
  produto: string;
  cidade: string;
  tamanho?: string;
  cor?: string;
};

/**
 * Mensagem da consulta de reserva. Ela pergunta; não afirma que a peça
 * está reservada. Quem confirma é a equipe da loja.
 */
export function mensagemDeReserva(p: PedidoDeReserva): string {
  const linhas = [
    `Olá, Social Modas! Gostaria de consultar a reserva de uma peça na loja de ${p.cidade}.`,
    "",
    `Peça: ${p.produto}`,
    p.cor ? `Cor: ${p.cor}` : null,
    p.tamanho ? `Tamanho: ${p.tamanho}` : null,
    "",
    "Vocês têm disponível para eu provar?",
  ];
  return linhas.filter((l) => l !== null).join("\n");
}
