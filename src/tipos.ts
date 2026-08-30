/**
 * Estagio da conversa comercial. A ordem do array e a ordem do funil, e e ela
 * que o subcomando `estagio` usa para ordenar a saida — nao a ordem alfabetica.
 */
export const ESTAGIOS = [
  "nao-contactado",
  "contactado",
  "respondeu",
  "reuniao",
  "fechado",
  "perdido",
] as const;

export type EstagioComercial = (typeof ESTAGIOS)[number];

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
  /**
   * Estagio da conversa, preenchido a mao pelo subcomando `estagio`.
   *
   * Fica NA CLINICA e nao no `manual` da auditoria de proposito: o estagio e uma
   * propriedade da relacao com a clinica, e existe antes de qualquer auditoria.
   * Uma clinica recem-buscada e "nao contactado" mesmo sem nunca ter sido
   * auditada, e nesse momento nao existe objeto de auditoria para hospedar o
   * campo.
   *
   * Opcional para que base ANTERIOR a este campo continue carregando: ausente
   * significa "nao-contactado", e nada precisa ser migrado.
   */
  estagio?: EstagioComercial;
  /** Quando o estagio mudou pela ultima vez. So existe se `estagio` existir. */
  estagioEm?: string;
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
  };
};

export type Base = {
  atualizadoEm: string;
  clinicas: Clinica[];
  auditorias: Auditoria[];
};
