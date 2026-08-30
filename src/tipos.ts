/** Uma clinica como o Google Places devolve, antes de qualquer auditoria. */
export type Clinica = {
  id: string;
  nome: string;
  endereco: string;
  telefone?: string;
  site?: string;
  nota?: number;
  totalAvaliacoes?: number;
  status?: string;
  mapsUrl?: string;
  temHorarioPublicado: boolean;
  coletadaEm: string;
  consulta: string;
};

export type Severidade = "alta" | "media" | "baixa";

/** Um problema encontrado, escrito na linguagem do dono da clinica. */
export type Achado = {
  chave: string;
  severidade: Severidade;
  titulo: string;
  detalhe: string;
  /** Quanto soma ao indice de oportunidade (0-100). */
  peso: number;
};

export type AnaliseSite = {
  alcancavel: boolean;
  urlFinal?: string;
  status?: number;
  https: boolean;
  tempoRespostaMs?: number;
  responsivo: boolean;
  temAgendamentoOnline: boolean;
  provedorAgendamento?: string;
  temLinkWhatsapp: boolean;
  temInstagram: boolean;
  temTitulo: boolean;
  temDescricao: boolean;
  erro?: string;
};

/**
 * Estagio comercial da conversa com a clinica. Chaves sem acento porque sao
 * digitadas na linha de comando; o rotulo bonito fica em ROTULO_ESTAGIO.
 */
export const ESTAGIOS = [
  "nao-contactado",
  "contactado",
  "respondeu",
  "reuniao",
  "fechado",
  "perdido",
] as const;

export type Estagio = (typeof ESTAGIOS)[number];

export const ROTULO_ESTAGIO: Record<Estagio, string> = {
  "nao-contactado": "não contactado",
  contactado: "contactado",
  respondeu: "respondeu",
  reuniao: "reunião",
  fechado: "fechado",
  perdido: "perdido",
};

export type Auditoria = {
  clinicaId: string;
  auditadaEm: string;
  site?: AnaliseSite;
  achados: Achado[];
  indiceOportunidade: number;
  /** Campos que a API do Google nao expoe e precisam ser preenchidos a mao. */
  manual: {
    minutosParaResponder?: number;
    avaliacoesSemResposta?: number;
    observacoes?: string;
    /**
     * Estagio comercial. Opcional de proposito: base gravada antes deste campo
     * existir carrega sem migracao, e ausencia significa "nao-contactado".
     * Fica dentro de `manual` porque e dado digitado a mao — e porque `auditar
     * --forcar` ja preserva `manual` inteiro ao reauditar.
     */
    estagio?: Estagio;
    /** Quando o estagio mudou pela ultima vez, em ISO. */
    estagioEm?: string;
  };
};

export type Base = {
  atualizadoEm: string;
  clinicas: Clinica[];
  auditorias: Auditoria[];
};
