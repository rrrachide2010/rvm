import { MARCA } from "./marca";

/**
 * Unidades da Social Modas.
 *
 * PARA ACRESCENTAR UMA LOJA: copie um bloco, troque os campos e publique.
 * Só preencha `endereco`, `horario` e `whatsapp` com dados confirmados pela
 * loja. Campo vazio não aparece no site; campo errado manda cliente para a
 * porta fechada.
 *
 * Estado atual: o site antigo publicava um endereço (Mairinque) e dizia que
 * o atendimento online cobre cinco cidades pelo mesmo WhatsApp. É só isso
 * que está aqui.
 */
export type Unidade = {
  id: string;
  cidade: string;
  estado: string;
  /** Rua e número, exatamente como na fachada. */
  endereco?: string;
  bairro?: string;
  /** Telefone fixo da loja, só dígitos com DDI. */
  telefone?: { numero: string; exibicao: string };
  /** WhatsApp que responde por esta cidade, só dígitos com DDI. */
  whatsapp: { numero: string; exibicao: string };
  /** Ex.: "Segunda a sexta, 9h às 18h". Deixe vazio até a loja confirmar. */
  horario?: string;
};

export const UNIDADES: Unidade[] = [
  {
    id: "mairinque",
    cidade: "Mairinque",
    estado: "SP",
    endereco: "Rua Santos Dumont, 129",
    bairro: "Centro",
    telefone: { numero: "551532687328", exibicao: "(15) 3268-7328" },
    whatsapp: { numero: "551532687328", exibicao: "(15) 3268-7328" },
  },
  { id: "boituva", cidade: "Boituva", estado: "SP", whatsapp: MARCA.whatsappCentral },
  { id: "votorantim", cidade: "Votorantim", estado: "SP", whatsapp: MARCA.whatsappCentral },
  { id: "sao-roque", cidade: "São Roque", estado: "SP", whatsapp: MARCA.whatsappCentral },
  { id: "piedade", cidade: "Piedade", estado: "SP", whatsapp: MARCA.whatsappCentral },
];

export function rotaNoMapa(u: Unidade): string | null {
  if (!u.endereco) return null;
  const consulta = [u.endereco, u.bairro, `${u.cidade} - ${u.estado}`, MARCA.nome]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/** Busca sem acento e sem caixa: "sao roque" encontra "São Roque". */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
