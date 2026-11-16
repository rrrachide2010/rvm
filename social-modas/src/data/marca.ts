/**
 * Dados institucionais. Tudo aqui já aparece no site atual ou no catálogo
 * da própria marca. O que ainda não foi confirmado fica de fora em vez de
 * entrar como estimativa.
 */
export const MARCA = {
  nome: "Social Modas",
  url: "https://socialmodas.com.br",
  conceito: "Cada momento merece sua melhor versão.",
  descricao: "Moda feminina e masculina para acompanhar você em cada ocasião.",
  /**
   * O site antigo dizia "27 anos" em 2026. "Mais de 25" continua verdade
   * em 2030 sem ninguém precisar lembrar de trocar o número.
   */
  tradicao: "mais de 25 anos",
  regiao: "interior de São Paulo",
  whatsappCentral: {
    numero: "5515974050177",
    exibicao: "(15) 97405-0177",
  },
  instagram: {
    usuario: "socialmodasboituva",
    url: "https://www.instagram.com/socialmodasboituva/",
  },
  /**
   * Os preços do catálogo foram alinhados ao Mercado Livre pela marca.
   * Se um dia ficarem sem conferência, desligue aqui e o site passa a
   * mostrar só "Consultar valor" em todos os cartões.
   */
  mostrarPrecos: true,
} as const;
