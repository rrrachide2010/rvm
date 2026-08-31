import type { Achado, AnaliseSite, Auditoria, Clinica } from "./tipos.ts";

const NOTA_ALVO = 4.5;
const AVALIACOES_MINIMAS = 40;
const LENTO_MS = 3000;

/**
 * Monta a lista de achados de uma clinica. Cada achado e escrito como o dono
 * da clinica reconheceria o problema — nao em jargao tecnico — porque este
 * texto vai direto para o relatorio que ele recebe.
 */
export function avaliar(clinica: Clinica, site: AnaliseSite | undefined): Auditoria {
  const achados: Achado[] = [];

  if (!clinica.site) {
    achados.push({
      chave: "sem-site",
      severidade: "alta",
      peso: 22,
      titulo: "A clínica não tem site",
      detalhe:
        "Quem procura no Google encontra apenas a ficha do Maps. Sem site, não há como explicar procedimentos, mostrar a equipe nem receber agendamento fora do horário comercial.",
    });
  } else if (site?.bloqueadoPorRobots) {
    // Nao e achado, e ausencia de dado. Acusar a clinica de ter site fora do ar
    // porque o robots.txt dela nos barrou seria mentir no relatorio que ela vai
    // ler — e peso zero mantem o indice de oportunidade honesto.
    achados.push({
      chave: "site-nao-verificado",
      severidade: "baixa",
      peso: 0,
      titulo: "O site não pôde ser verificado",
      detalhe:
        "O robots.txt do site pede que ferramentas automatizadas não o leiam, e nós respeitamos o pedido. Os itens que dependem de abrir a página ficaram de fora desta análise — o que não quer dizer que estejam certos ou errados.",
    });
  } else if (site && !site.alcancavel) {
    achados.push({
      chave: "site-fora",
      severidade: "alta",
      peso: 24,
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
        peso: 20,
        titulo: "Não há agendamento online",
        detalhe:
          "Toda marcação depende de alguém responder. Fora do expediente e nos horários de pico, o pedido de horário simplesmente se perde.",
      });
    }
    if (!site.https) {
      achados.push({
        chave: "sem-https",
        severidade: "alta",
        peso: 14,
        titulo: "O site não usa conexão segura",
        detalhe:
          "O navegador exibe aviso de site não seguro para quem entra. Além da desconfiança, o Google rebaixa páginas assim no resultado de busca.",
      });
    }
    if (!site.responsivo) {
      achados.push({
        chave: "nao-responsivo",
        severidade: "media",
        peso: 12,
        titulo: "O site não se adapta ao celular",
        detalhe:
          "A maior parte das buscas por estética vem do telefone. Uma página que exige zoom para ser lida perde a visita nos primeiros segundos.",
      });
    }
    if (site.tempoRespostaMs && site.tempoRespostaMs > LENTO_MS) {
      achados.push({
        chave: "site-lento",
        severidade: "media",
        peso: 8,
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
        peso: 8,
        titulo: "Não há botão de WhatsApp no site",
        detalhe:
          "O WhatsApp é o canal preferido para marcar horário. Sem link direto, a pessoa precisa copiar o número — e muitas não copiam.",
      });
    }
    if (!site.temTitulo || !site.temDescricao) {
      achados.push({
        chave: "seo-basico",
        severidade: "baixa",
        peso: 5,
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
      peso: 10,
      titulo: "Não há telefone na ficha do Google",
      detalhe: "Quem encontra a clínica pelo Maps não tem como ligar sem procurar em outro lugar.",
    });
  }
  if (!clinica.temHorarioPublicado) {
    achados.push({
      chave: "sem-horario",
      severidade: "media",
      peso: 9,
      titulo: "O horário de funcionamento não está publicado",
      detalhe:
        "O Google prioriza fichas completas e mostra 'aberto agora' para quem busca por perto. Sem horário, a clínica fica de fora desse filtro.",
    });
  }
  if ((clinica.totalAvaliacoes ?? 0) < AVALIACOES_MINIMAS) {
    achados.push({
      chave: "poucas-avaliacoes",
      severidade: "media",
      peso: 11,
      titulo: `Poucas avaliações no Google (${clinica.totalAvaliacoes ?? 0})`,
      detalhe:
        "Volume de avaliações pesa mais que a nota no ranking local. Pedir avaliação de forma automática após o atendimento é a correção mais rápida disponível.",
    });
  }
  if (clinica.nota !== undefined && clinica.nota < NOTA_ALVO) {
    achados.push({
      chave: "nota-baixa",
      severidade: "baixa",
      peso: 6,
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
