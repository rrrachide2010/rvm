import type { Clinica } from "./tipos.ts";

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

/**
 * Campos pedidos ao Places API (New). O field mask define o preco da chamada,
 * entao pedimos exatamente o que a auditoria usa e nada alem disso.
 */
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.googleMapsUri",
  "places.regularOpeningHours.openNow",
  "nextPageToken",
].join(",");

type RespostaPlaces = {
  places?: Array<{
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
    businessStatus?: string;
    googleMapsUri?: string;
    regularOpeningHours?: { openNow?: boolean };
  }>;
  nextPageToken?: string;
  error?: { message?: string; status?: string };
};

export type OpcoesBusca = {
  consulta: string;
  cidade: string;
  max: number;
  chave: string;
  regiao: string;
};

/**
 * Busca clinicas paginando o searchText ate atingir `max`.
 * O Places API devolve no maximo 20 por pagina e ate 60 no total por consulta —
 * para passar disso, varie a consulta (bairro, termo) em vez de insistir na mesma.
 */
export async function buscarClinicas(opcoes: OpcoesBusca): Promise<Clinica[]> {
  const textQuery = `${opcoes.consulta} em ${opcoes.cidade}`;
  const encontradas: Clinica[] = [];
  let pageToken: string | undefined;

  while (encontradas.length < opcoes.max) {
    const resposta = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": opcoes.chave,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "pt-BR",
        regionCode: opcoes.regiao,
        pageSize: Math.min(20, opcoes.max - encontradas.length),
        ...(pageToken ? { pageToken } : {}),
      }),
    });

    const dados = (await resposta.json()) as RespostaPlaces;

    if (!resposta.ok) {
      const detalhe = dados.error?.message ?? `HTTP ${resposta.status}`;
      throw new Error(`Places API recusou a chamada: ${detalhe}`);
    }

    for (const lugar of dados.places ?? []) {
      encontradas.push({
        id: lugar.id,
        nome: lugar.displayName?.text ?? "(sem nome)",
        endereco: lugar.formattedAddress ?? "",
        telefone: lugar.nationalPhoneNumber,
        site: lugar.websiteUri,
        nota: lugar.rating,
        totalAvaliacoes: lugar.userRatingCount,
        status: lugar.businessStatus,
        mapsUrl: lugar.googleMapsUri,
        temHorarioPublicado: lugar.regularOpeningHours !== undefined,
        coletadaEm: new Date().toISOString(),
        consulta: textQuery,
      });
    }

    pageToken = dados.nextPageToken;
    if (!pageToken) break;
    // O token leva alguns instantes para ficar valido do lado do Google.
    await new Promise((r) => setTimeout(r, 2000));
  }

  return encontradas.slice(0, opcoes.max);
}
