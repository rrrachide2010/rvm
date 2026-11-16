/**
 * Larguras em que cada foto existe em WebP. Lidas pelo `next.config.ts`
 * (quais tamanhos o <Image> pode pedir) e pelo `scripts/imagens.mjs`
 * (quais tamanhos gerar). Mudar aqui muda os dois juntos.
 */
export const LARGURAS = {
  miniaturas: [160, 320],
  telas: [480, 768, 1080, 1440],
} as const;

export const TODAS_AS_LARGURAS: readonly number[] = [
  ...LARGURAS.miniaturas,
  ...LARGURAS.telas,
];
