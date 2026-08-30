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
