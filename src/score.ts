import type { Achado, AnaliseSite, Auditoria, Clinica } from "./tipos.ts";

const NOTA_ALVO = 4.5;
const AVALIACOES_MINIMAS = 40;
const LENTO_MS = 3000;

/** Status da ficha do Maps que o Places devolve em `businessStatus`. */
const FECHADA_DEFINITIVA = "CLOSED_PERMANENTLY";
const FECHADA_TEMPORARIA = "CLOSED_TEMPORARILY";

/**
 * Todos os pesos, em um lugar so — e o "um lugar so" que o README promete.
 * Antes eles eram literais espalhados por cada achado, o que tornava impossivel
 * comparar dois pesos sem rolar o arquivo inteiro.
 *
 * A escala e arbitraria e so precisa ser coerente consigo mesma: o indice e a
 * soma dos pesos dos achados, limitada a 100. Ajuste conforme aprender o que faz
 * o dono responder — e mexa aqui, nunca no meio do texto do achado.
 *
 * Peso 0 e proposital: o achado aparece no relatorio mas nao conta como
 * oportunidade. Serve para o que e informacao, nao problema a vender.
 */
const PESO = {
  // vitrine inexistente ou quebrada — o que mais pesa
  siteFora: 24,
  semSite: 22,
  semAgendamento: 20,
  semHttps: 14,
  naoResponsivo: 12,

  // ficha do Maps incompleta
  poucasAvaliacoes: 11,
  semTelefone: 10,
  semHorario: 9,
  notaBaixa: 6,

  // atrito no site
  siteLento: 8,
  semWhatsapp: 8,
  seoBasico: 5,

  // informativos: aparecem no relatorio, nao somam oportunidade
  fechadaTemporaria: 0,
  fechadaDefinitiva: 0,
} as const;

/**
 * Monta a lista de achados de uma clinica. Cada achado e escrito como o dono
 * da clinica reconheceria o problema — nao em jargao tecnico — porque este
 * texto vai direto para o relatorio que ele recebe.
 */
export function avaliar(clinica: Clinica, site: AnaliseSite | undefined): Auditoria {
  const achados: Achado[] = [];

  // `businessStatus` era coletado em places.ts e nunca lido aqui. Uma clinica
  // fechada em definitivo aparecia na fila com indice alto — justamente porque
  // tudo nela esta ruim — e alguem perderia tempo escrevendo para um endereco
  // que nao existe mais.
  //
  // Nao ha o que vender para quem fechou, entao o indice e zero e os demais
  // achados nem sao calculados: dizer a uma clinica encerrada que o site dela
  // esta lento nao ajuda ninguem.
  if (clinica.status === FECHADA_DEFINITIVA) {
    return {
      clinicaId: clinica.id,
      auditadaEm: new Date().toISOString(),
      site,
      achados: [
        {
          chave: "fechada-definitiva",
          severidade: "alta",
          peso: PESO.fechadaDefinitiva,
          titulo: "O Google marca esta clínica como encerrada",
          detalhe:
            "A ficha está com status de fechada em definitivo. Se a clínica ainda funciona, esse é o problema mais caro da lista: quem procura no Maps vê 'Fechado permanentemente' e não liga. Corrige-se pelo Google Meu Negócio, e é a primeira coisa a fazer.",
        },
      ],
      indiceOportunidade: 0,
      manual: {},
    };
  }

  if (clinica.status === FECHADA_TEMPORARIA) {
    achados.push({
      chave: "fechada-temporaria",
      severidade: "media",
      peso: PESO.fechadaTemporaria,
      titulo: "O Google marca esta clínica como temporariamente fechada",
      detalhe:
        "Enquanto o status estiver assim, a ficha perde posição na busca local e deixa de aparecer no filtro de 'aberto agora'. Se a clínica voltou a atender, mudar isso leva um minuto e tem efeito imediato.",
    });
  }

  if (!clinica.site) {
    achados.push({
      chave: "sem-site",
      severidade: "alta",
      peso: PESO.semSite,
      titulo: "A clínica não tem site",
      detalhe:
        "Quem procura no Google encontra apenas a ficha do Maps. Sem site, não há como explicar procedimentos, mostrar a equipe nem receber agendamento fora do horário comercial.",
    });
  } else if (site && !site.alcancavel) {
    achados.push({
      chave: "site-fora",
      severidade: "alta",
      peso: PESO.siteFora,
      titulo: "O site cadastrado não abre",
      detalhe: `O endereço ${clinica.site} não respondeu na verificação${
        site.erro ? ` (${site.erro})` : site.status ? ` (código ${site.status})` : ""
      }. Um link quebrado no Google custa mais que não ter link nenhum.`,
    });
  }

  if (site?.alcancavel) {
    if (!site.temAgendamentoOnline) {
      achados.push({
        chave: "sem-agendamento",
        severidade: "alta",
        peso: PESO.semAgendamento,
        titulo: "Não há agendamento online",
        detalhe:
          "Toda marcação depende de alguém responder. Fora do expediente e nos horários de pico, o pedido de horário simplesmente se perde.",
      });
    }
    if (!site.https) {
      achados.push({
        chave: "sem-https",
        severidade: "alta",
        peso: PESO.semHttps,
        titulo: "O site não usa conexão segura",
        detalhe:
          "O navegador exibe aviso de site não seguro para quem entra. Além da desconfiança, o Google rebaixa páginas assim no resultado de busca.",
      });
    }
    if (!site.responsivo) {
      achados.push({
        chave: "nao-responsivo",
        severidade: "media",
        peso: PESO.naoResponsivo,
        titulo: "O site não se adapta ao celular",
        detalhe:
          "A maior parte das buscas por estética vem do telefone. Uma página que exige zoom para ser lida perde a visita nos primeiros segundos.",
      });
    }
    if (site.tempoRespostaMs && site.tempoRespostaMs > LENTO_MS) {
      achados.push({
        chave: "site-lento",
        severidade: "media",
        peso: PESO.siteLento,
        titulo: "O site demora a carregar",
        detalhe: `A primeira resposta levou ${(site.tempoRespostaMs / 1000).toFixed(
          1,
        )} segundos. Acima de 3 segundos, boa parte das visitas desiste antes de ver a página.`,
      });
    }
    if (!site.temLinkWhatsapp) {
      achados.push({
        chave: "sem-whatsapp",
        severidade: "media",
        peso: PESO.semWhatsapp,
        titulo: "Não há botão de WhatsApp no site",
        detalhe:
          "O WhatsApp é o canal preferido para marcar horário. Sem link direto, a pessoa precisa copiar o número — e muitas não copiam.",
      });
    }
    if (!site.temTitulo || !site.temDescricao) {
      achados.push({
        chave: "seo-basico",
        severidade: "baixa",
        peso: PESO.seoBasico,
        titulo: "A página não tem título ou descrição configurados",
        detalhe:
          "É o texto que aparece no resultado do Google. Sem ele, a busca mostra um trecho aleatório do site.",
      });
    }
  }

  if (!clinica.telefone) {
    achados.push({
      chave: "sem-telefone",
      severidade: "media",
      peso: PESO.semTelefone,
      titulo: "Não há telefone na ficha do Google",
      detalhe: "Quem encontra a clínica pelo Maps não tem como ligar sem procurar em outro lugar.",
    });
  }
  if (!clinica.temHorarioPublicado) {
    achados.push({
      chave: "sem-horario",
      severidade: "media",
      peso: PESO.semHorario,
      titulo: "O horário de funcionamento não está publicado",
      detalhe:
        "O Google prioriza fichas completas e mostra 'aberto agora' para quem busca por perto. Sem horário, a clínica fica de fora desse filtro.",
    });
  }
  if ((clinica.totalAvaliacoes ?? 0) < AVALIACOES_MINIMAS) {
    achados.push({
      chave: "poucas-avaliacoes",
      severidade: "media",
      peso: PESO.poucasAvaliacoes,
      titulo: `Poucas avaliações no Google (${clinica.totalAvaliacoes ?? 0})`,
      detalhe:
        "Volume de avaliações pesa mais que a nota no ranking local. Pedir avaliação de forma automática após o atendimento é a correção mais rápida disponível.",
    });
  }
  if (clinica.nota !== undefined && clinica.nota < NOTA_ALVO) {
    achados.push({
      chave: "nota-baixa",
      severidade: "baixa",
      peso: PESO.notaBaixa,
      titulo: `Nota abaixo de ${NOTA_ALVO.toFixed(1)} (${clinica.nota.toFixed(1)})`,
      detalhe:
        "Na comparação lado a lado que o Maps faz, a diferença de meio ponto costuma decidir o clique.",
    });
  }

  const bruto = achados.reduce((soma, a) => soma + a.peso, 0);

  return {
    clinicaId: clinica.id,
    auditadaEm: new Date().toISOString(),
    site,
    achados: achados.sort((a, b) => b.peso - a.peso),
    indiceOportunidade: Math.min(100, bruto),
    manual: {},
  };
}
