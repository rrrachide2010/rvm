export type Link = { texto: string; href: string };

export const NAV_PRINCIPAL: Link[] = [
  { texto: "Feminino", href: "/colecoes/feminino/" },
  { texto: "Masculino", href: "/colecoes/masculino/" },
  { texto: "Coleções", href: "/colecoes/" },
  { texto: "Nossa história", href: "/nossa-historia/" },
  { texto: "Lojas", href: "/lojas/" },
];

export const NAV_RODAPE: { titulo: string; links: Link[] }[] = [
  {
    titulo: "Coleções",
    links: [
      { texto: "Feminino", href: "/colecoes/feminino/" },
      { texto: "Masculino", href: "/colecoes/masculino/" },
      { texto: "Alfaiataria", href: "/colecoes/alfaiataria/" },
      { texto: "Camisas", href: "/colecoes/camisas/" },
    ],
  },
  {
    titulo: "Social Modas",
    links: [
      { texto: "Nossa história", href: "/nossa-historia/" },
      { texto: "Lojas", href: "/lojas/" },
      { texto: "Social Journal", href: "/journal/" },
    ],
  },
  {
    titulo: "Atendimento",
    links: [
      { texto: "Guia de tamanhos", href: "/guia-de-tamanhos/" },
      { texto: "Ocasiões", href: "/ocasioes/trabalho/" },
    ],
  },
];
