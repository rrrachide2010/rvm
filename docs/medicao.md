# Medição

O que medir, como cada evento dispara nas páginas de hoje, e como observar
desistência. **Nada foi instalado.** Este documento especifica; você decide se
aceita script de terceiro.

---

## 1. O que já foi feito: `data-evento` nos CTAs

As cinco páginas ganharam **19 marcações** nos CTAs. O atributo é só um rótulo no
HTML — ele **não mede nada sozinho** e não trouxe script nenhum.

Ele existe para que, no dia em que você escolher uma ferramenta, ligar seja **um
listener que lê o atributo**, e não reescrever cinco páginas caçando botão.

### A convenção

```html
<a href="..." data-evento="clique_whatsapp" data-local="clinicas-contato">
```

| atributo | responde | regra |
| --- | --- | --- |
| `data-evento` | **o quê** a pessoa fez | vocabulário fechado, igual em todas as páginas |
| `data-local` | **onde** ela estava | sempre `<pagina>-<secao>` |

A separação importa: se `clique_whatsapp` significar coisas diferentes em páginas
diferentes, o relatório não soma. E `data-local` é o que distingue o botão do
herói do botão do rodapé **sem inventar evento novo** — a pergunta "qual seção
converte" se responde agrupando por `data-local`, não criando `clique_whatsapp_heroi`.

### Inventário

| evento | quantos | onde |
| --- | --- | --- |
| `ir_contato` | 6 | topo, herói e rodapé de `clinicas`; topo de `index` e `especialistas` |
| `clique_whatsapp` | 3 | `index`, `clinicas`, `especialistas` |
| `clique_email` | 3 | as mesmas três |
| `ir_lista` | 2 | topo e rodapé de `enfermeiras` |
| `ver_frentes`, `ver_quem` | 2 | herói de `index` |
| `ver_divisao` | 1 | herói de `especialistas` |
| `abrir_calculadora` | 1 | herói de `enfermeiras` |
| `enviar_lista` | 1 | botão do formulário (hoje `disabled`) |

### 🔴 `calculadora.html` tem zero CTA

Não é esquecimento meu: **a página não tem nenhum.** Sem botão, sem contato, sem
próximo passo.

Isso importa porque `/calculadora` é o **link da bio** — o destino do tráfego
mais barato que vocês têm. A pessoa chega, descobre que estava cobrando errado,
tem a reação mais forte que o site inteiro consegue provocar… e a página acaba.

É o maior vazamento mensurável do site, e é decisão sua qual CTA entra ali:
entrar na lista de espera, ver o mapa do permitido, ou falar com vocês. Não
inventei um.

---

## 2. Os eventos que importam

### Visita

**O que é:** um carregamento de página.

**Como dispara hoje:** não dispara. Sem script, o navegador não avisa ninguém.

**A única fonte sem script:** os **logs do host**. Vercel e similares contam
requisições sem que você instale nada na página. Dá volume por URL e origem
(o cabeçalho `Referer`), e não dá comportamento dentro da página.

Se você aceitar **zero** script de terceiro, é isto que existe — e para começar,
resolve: responde "quantas pessoas chegaram em `/calculadora` este mês".

### Clique no WhatsApp

**O que é:** a pessoa saindo do site para falar com vocês. **É a conversão
principal do site.**

**Como dispara hoje:** o clique acontece e ninguém registra. O link leva para
fora e a página é abandonada.

**O detalhe que já está resolvido e quase ninguém percebe:** cada página tem um
`text=` diferente pré-preenchido no `wa.me`.

| página | texto que chega na sua caixa |
| --- | --- |
| `index` | "Oi! Vim pelo site." |
| `clinicas` | "Oi! Quero saber sobre o piloto de 30 dias." |
| `especialistas` | "Oi! Sou enfermeira especialista e quero saber da co-produção." |

**Isso já é atribuição, e é de graça.** A primeira mensagem diz de qual página a
pessoa veio, sem script nenhum, sem cookie e sem consentimento. Conte à mão as
mensagens por texto de origem e você tem a conversão por página antes de
instalar qualquer coisa.

**Não mude esses textos sem lembrar disso.** Textos iguais nas três páginas
destroem a atribuição gratuita.

### Envio de formulário

**O que é:** a entrada na lista de espera.

**Como dispara hoje:** não dispara — o formulário está `disabled` e não há
endpoint. O botão já está marcado `enviar_lista`.

**Quando existir**, o evento não deve disparar no clique: deve disparar na
**resposta 2xx**. Clique é intenção; `2xx` é o e-mail guardado. Medir o clique
infla o número exatamente quando o endpoint está falhando — o momento em que o
número mentir mais é o momento em que você mais precisa dele. Os três estados
estão especificados em
[operacao-site.md §6](./operacao-site.md#6-formulário-da-lista-de-espera--comportamento-de-confirmação).

---

## 3. Como ligar, quando você decidir

### Um listener, e só

```html
<script>
document.addEventListener("click", function (e) {
  var alvo = e.target.closest("[data-evento]");
  if (!alvo) return;
  registrar(alvo.dataset.evento, {
    local: alvo.dataset.local,
    pagina: location.pathname
  });
});
</script>
```

Delegação no `document`: funciona para os 19 CTAs e para qualquer um que você
adicionar depois, sem tocar em nada. `registrar` é a função da ferramenta que
você escolher — é a única linha que muda entre uma opção e outra.

### As três opções, e o que cada uma custa

| opção | script de terceiro? | o que dá | o que custa |
| --- | --- | --- | --- |
| **Logs do host** | não | visitas por URL e origem | nenhum comportamento dentro da página |
| **Analytics leve sem cookie** (Plausible, Umami e similares) | **sim, um** | visitas, origem e eventos personalizados | um `<script>` externo; alguns não exigem aviso de cookie porque não usam cookie — confirme na ferramenta escolhida |
| **Google Analytics + Pixel** | **sim, dois ou mais** | tudo acima, mais público de remarketing | dois terceiros recebendo dados de quem visita, aviso de cookie obrigatório, e um banner que derruba conversão |

**Recomendação, se você me perguntar:** comece pelos logs do host e pela contagem
manual das mensagens do WhatsApp por texto de origem. Só instale script quando
houver tráfego pago — antes disso, o volume não sustenta decisão nenhuma e você
paga o custo (banner, terceiro, peso) sem receber a informação.

**A exceção:** anúncio com otimização por conversão **exige** o pixel da
plataforma. Se você for para tráfego pago, essa decisão vem junto. Ver
[docs/trafego.md](./trafego.md).

### Se instalar, o mínimo honesto

- Aviso de cookie **antes** do script rodar, se a ferramenta usar cookie.
- Registrar a decisão do visitante e respeitá-la.
- A frase de privacidade precisa dizer quem recebe o dado. Não vale "usamos
  cookies para melhorar sua experiência".

---

## 4. Observar desistência

Desistência não se mede num número: mede-se na **diferença entre dois números
consecutivos**. Com os eventos acima, os funis ficam assim.

### Funil da clínica

```
visita /clinicas                     [logs do host]
  → ir_contato                       (rolou até o fim, ou clicou no CTA)
    → clique_whatsapp                (saiu para falar)
      → respondeu no WhatsApp        [contagem manual]
        → reuniao                    [npm run estagio]
          → fechado                  [npm run estagio]
```

Os três primeiros degraus a medição responde. Do quarto em diante quem responde
é o campo de estágio da base — e é por isso que ele existe.

**Onde procurar o vazamento:** o degrau com a maior queda percentual, não o com
o menor número absoluto. Se 100 visitam, 40 clicam em `ir_contato` e 4 clicam no
WhatsApp, o problema está entre o segundo e o terceiro — a pessoa chegou na
seção de contato e não falou. Isso é objeção não respondida, não falta de
tráfego.

### Funil da enfermeira

```
visita /enfermeiras
  → abrir_calculadora
    → visita /calculadora
      → ??? nada. A pagina nao tem CTA.
```

O funil termina numa parede. Ver §1.

### O que **não** dá para saber, e é honesto admitir

- **Se a pessoa que clicou no WhatsApp mandou mensagem.** O clique sai do site; o
  que acontece depois só aparece na sua caixa. A ponte entre os dois é o `text=`
  pré-preenchido, contado à mão.
- **Quanto tempo alguém passou na página.** Exige script.
- **Se a pessoa leu a garantia antes de clicar.** Exigiria medir rolagem, que é
  mais instrumentação do que este site justifica hoje.

---

## 5. O mínimo para começar, sem instalar nada

1. Ler os logs do host uma vez por semana: visitas por URL e origem.
2. Contar as mensagens novas do WhatsApp **por texto de origem** — as três
   páginas já se identificam sozinhas.
3. Manter o estágio da base atualizado **na hora** da conversa
   (`npm run estagio`).

Três números por semana: quantos chegaram, quantos falaram, quantos avançaram.
É pouco, é grosseiro, e é mais do que a maioria tem — e não custa um script, um
banner nem um terceiro.
