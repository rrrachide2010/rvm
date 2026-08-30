import type { Achado, Auditoria, Clinica } from "./tipos.ts";

export type Remetente = { nome: string; contato: string };

const esc = (t: string): string =>
  t.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

const ROTULO: Record<Achado["severidade"], string> = {
  alta: "Prioridade alta",
  media: "Prioridade média",
  baixa: "Ajuste fino",
};

const ESTILO = `
:root{--ground:#F7F6F3;--surface:#fff;--ink:#14201F;--ink-2:#3D4A48;--muted:#6B7776;
--line:#DEDCD4;--accent:#0E5B52;--accent-soft:#E2EDEA;--rose:#9E3F5E;--rose-soft:#F5E6EA;
--warn:#8A5A12;--warn-soft:#F6ECD9}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
font-family:Karla,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6}
.folha{max-width:760px;margin:0 auto;padding:44px 40px 56px;background:var(--surface);
min-height:100vh;border-left:1px solid var(--line);border-right:1px solid var(--line)}
.eyebrow{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.14em;
text-transform:uppercase;color:var(--rose);margin:0}
h1{font-family:Newsreader,Georgia,serif;font-weight:500;font-size:31px;line-height:1.15;
letter-spacing:-.01em;margin:10px 0 6px}
.sub{color:var(--muted);margin:0;font-size:14px}
.resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;
background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden;margin:28px 0}
.cel{background:var(--surface);padding:14px 16px}
.cel .rot{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.11em;
text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px}
.cel .val{font-family:Newsreader,Georgia,serif;font-size:26px;line-height:1;
font-variant-numeric:tabular-nums}
.cel .val small{font-size:13px;color:var(--muted);font-family:Karla,sans-serif}
h2{font-family:Newsreader,Georgia,serif;font-weight:600;font-size:19px;margin:34px 0 4px}
.lede{color:var(--muted);font-size:14px;margin:0 0 16px}
.achado{border:1px solid var(--line);border-left-width:3px;border-radius:0 7px 7px 0;
padding:13px 16px;margin-bottom:10px;background:var(--surface);break-inside:avoid}
.achado.alta{border-left-color:var(--rose);background:var(--rose-soft)}
.achado.media{border-left-color:var(--warn);background:var(--warn-soft)}
.achado.baixa{border-left-color:var(--line)}
.achado .tag{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.1em;
text-transform:uppercase;color:var(--muted)}
.achado h3{margin:3px 0 4px;font-size:16px;font-family:Karla,sans-serif;font-weight:700}
.achado p{margin:0;font-size:14px;color:var(--ink-2)}
.aberto{border:1px dashed var(--line);border-radius:8px;padding:16px 18px;margin:22px 0;
background:var(--ground)}
.aberto ul{margin:8px 0 0;padding-left:18px;font-size:14px;color:var(--ink-2)}
.rodape{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);
font-size:13px;color:var(--muted)}
.rodape strong{color:var(--ink)}
.limpo{padding:16px 18px;border:1px solid var(--accent);background:var(--accent-soft);
border-radius:8px;color:var(--accent);font-size:14.5px}
@media print{body{background:#fff}.folha{border:none;max-width:none;padding:0}
@page{margin:16mm}}
`;

export function relatorioClinica(
  clinica: Clinica,
  auditoria: Auditoria,
  remetente: Remetente,
): string {
  const data = new Date(auditoria.auditadaEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const alta = auditoria.achados.filter((a) => a.severidade === "alta").length;

  const achados = auditoria.achados.length
    ? auditoria.achados
        .map(
          (a) => `<div class="achado ${a.severidade}">
        <span class="tag">${ROTULO[a.severidade]}</span>
        <h3>${esc(a.titulo)}</h3>
        <p>${esc(a.detalhe)}</p>
      </div>`,
        )
        .join("\n")
    : `<div class="limpo">A verificação automática não encontrou problemas de presença digital.
       Esta clínica já resolveu o básico — o ganho aqui está na operação da agenda,
       não na vitrine.</div>`;

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presença digital — ${esc(clinica.nome)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Karla:wght@400;700&family=IBM+Plex+Mono:wght@400&display=swap">
<style>${ESTILO}</style></head><body><div class="folha">

<p class="eyebrow">Levantamento de presença digital</p>
<h1>${esc(clinica.nome)}</h1>
<p class="sub">${esc(clinica.endereco)} · verificado em ${data}</p>

<div class="resumo">
  <div class="cel"><span class="rot">Pontos de atenção</span>
    <span class="val">${auditoria.achados.length}<small> · ${alta} de prioridade alta</small></span></div>
  <div class="cel"><span class="rot">Nota no Google</span>
    <span class="val">${clinica.nota?.toFixed(1) ?? "—"}</span></div>
  <div class="cel"><span class="rot">Avaliações</span>
    <span class="val">${clinica.totalAvaliacoes ?? 0}</span></div>
  <div class="cel"><span class="rot">Agendamento online</span>
    <span class="val">${
      auditoria.site?.temAgendamentoOnline
        ? `sim<small>${auditoria.site.provedorAgendamento ? ` · ${esc(auditoria.site.provedorAgendamento)}` : ""}</small>`
        : "não"
    }</span></div>
</div>

<h2>O que encontramos</h2>
<p class="lede">Verificação automática do site e da ficha pública no Google, sem contato com a equipe.</p>
${achados}

<div class="aberto">
  <strong>O que não dá para medir de fora</strong>
  <ul>
    <li><strong>Tempo de resposta no WhatsApp.</strong> ${
      auditoria.manual.minutosParaResponder !== undefined
        ? `Na nossa mensagem de teste, a resposta veio em ${auditoria.manual.minutosParaResponder} minutos.`
        : "Só medimos enviando uma mensagem real, como uma cliente faria."
    }</li>
    <li><strong>Avaliações sem resposta.</strong> ${
      auditoria.manual.avaliacoesSemResposta !== undefined
        ? `Contamos ${auditoria.manual.avaliacoesSemResposta} avaliações sem resposta do proprietário.`
        : "A API do Google não expõe as respostas do proprietário; esse número é contado a olho na ficha."
    }</li>
    <li><strong>Taxa de falta.</strong> Só a agenda de vocês tem esse número — e costuma ser o mais caro de todos.</li>
  </ul>
</div>

<div class="rodape">
  <p>Levantamento feito por <strong>${esc(remetente.nome)}</strong> a partir de informações públicas
  (ficha do Google Maps e site da clínica). Nenhum dado de paciente foi acessado.
  O documento é seu, sem compromisso.</p>
  <p>${esc(remetente.contato)}</p>
</div>

</div></body></html>`;
}

export function indice(
  linhas: Array<{ clinica: Clinica; auditoria: Auditoria; arquivo: string }>,
  remetente: Remetente,
): string {
  const corpo = linhas
    .map(
      ({ clinica, auditoria, arquivo }) => `<tr>
      <td class="num">${auditoria.indiceOportunidade}</td>
      <td><a href="./${esc(arquivo)}">${esc(clinica.nome)}</a><br><span class="end">${esc(clinica.endereco)}</span></td>
      <td class="num">${clinica.nota?.toFixed(1) ?? "—"} · ${clinica.totalAvaliacoes ?? 0}</td>
      <td>${clinica.site ? "sim" : "<em>não tem</em>"}</td>
      <td>${auditoria.site?.temAgendamentoOnline ? "sim" : "<em>não</em>"}</td>
      <td>${esc(clinica.telefone ?? "—")}</td>
    </tr>`,
    )
    .join("\n");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fila de prospecção</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500&family=Karla:wght@400;700&family=IBM+Plex+Mono:wght@400&display=swap">
<style>${ESTILO}
table{border-collapse:collapse;width:100%;font-size:14px;margin-top:20px}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;
color:var(--muted);background:var(--ground)}
td.num{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;white-space:nowrap}
.end{color:var(--muted);font-size:12.5px}
a{color:var(--accent)}
</style></head><body><div class="folha">
<p class="eyebrow">Prospecção · ordenada por oportunidade</p>
<h1>Fila de abordagem</h1>
<p class="sub">${linhas.length} clínicas auditadas · quanto maior o índice, mais há para resolver</p>
<table>
<thead><tr><th>Índice</th><th>Clínica</th><th>Nota · avaliações</th><th>Site</th><th>Agenda online</th><th>Telefone</th></tr></thead>
<tbody>${corpo}</tbody></table>
<div class="rodape"><p>Gerado por <strong>${esc(remetente.nome)}</strong>.</p></div>
</div></body></html>`;
}
