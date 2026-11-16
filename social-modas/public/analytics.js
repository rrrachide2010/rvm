/* =========================================================
   ANALYTICS PRÓPRIO

   Mede o funil da loja sem depender de terceiros e sem cookie:
   um id de sessão aleatório no navegador, e pronto. Nenhum dado
   sai para fora do domínio da Social Modas.

   Se a API não responder, tudo falha em silêncio — medição
   nunca pode atrapalhar a venda.
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'sm_sessao';

  /* id aleatório por navegador (não identifica a pessoa) */
  function sessao() {
    var s = null;
    try { s = localStorage.getItem(CHAVE); } catch (e) {}
    if (!s) {
      s = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
      try { localStorage.setItem(CHAVE, s); } catch (e) {}
    }
    return s;
  }

  function enviar(tipo, extra) {
    var corpo = {
      tipo: tipo,
      sessao: sessao(),
      pagina: location.pathname,
      produto_id: (extra && extra.produto_id) || null,
      valor: (extra && extra.valor) || null,
      dados: (extra && extra.dados) || null
    };
    try {
      var texto = JSON.stringify(corpo);
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/eventos', new Blob([texto], { type: 'application/json' }));
      } else {
        fetch('/api/eventos', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: texto, keepalive: true
        }).catch(function () {});
      }
    } catch (e) { /* medir nunca quebra a página */ }
  }

  window.SMAnalytics = { enviar: enviar, sessao: sessao };

  /* ---------- eventos automáticos ---------- */

  // 1. visita
  enviar('pageview');

  // 2. cliques em WhatsApp (botão flutuante, contatos, catálogo)
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href*="wa.me"], a[href*="web.whatsapp.com"]');
    if (a) enviar('whatsapp_click', { dados: { origem: a.className || 'link' } });

    var avisar = ev.target.closest('[data-avisar]');
    if (avisar) enviar('avise_me', { dados: { produto: avisar.getAttribute('data-avisar') } });
  });

  // 3. produto visto: quando o cartão entra na tela
  if ('IntersectionObserver' in window) {
    var vistos = {};
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var art = e.target;
        var id = art.getAttribute('data-id');
        if (!id || vistos[id]) return;
        vistos[id] = true;
        enviar('ver_produto', { produto_id: id });
        io.unobserve(art);
      });
    }, { threshold: 0.5 });

    // os cartões nascem via JS: observa quando aparecerem
    var ligar = function () {
      document.querySelectorAll('#grade .produto').forEach(function (a) { io.observe(a); });
    };
    var grade = document.getElementById('grade');
    if (grade) {
      new MutationObserver(ligar).observe(grade, { childList: true });
      ligar();
    }
  }
})();
