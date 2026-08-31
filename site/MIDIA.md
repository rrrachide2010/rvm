# Imagens e animação do site

Cada moldura de foto no HTML tem um código (`F1`…`F10`) que aparece no canto
superior esquerdo enquanto está vazia. Este arquivo traz o prompt de cada uma.

## Antes de gerar qualquer coisa: três limites

**1. `F6` não recebe imagem gerada.** É a foto de vocês dois na seção "quem
somos". Uma imagem de IA ali seria uma pessoa inventada apresentada como
fundadora — é enganoso, e é justamente a parte da página que existe para
construir confiança. Tirem uma foto de verdade, mesmo que simples, com luz de
janela.

**2. Nada de paciente, pele tratada, resultado ou antes-e-depois.** Além de ser
fabricação de prova, imagem de paciente em publicidade de saúde tem restrição
no Código de Ética da enfermagem. Todos os prompts abaixo são de **ambiente,
objeto e detalhe** — nenhum tem pessoa.

**3. Nenhum rosto, nenhuma mão reconhecível.** Simplifica a produção, evita a
estética de banco de imagens e elimina a questão de direito de imagem.

## Base de estilo — cole em todos os prompts

Isso é o que faz as dez imagens parecerem do mesmo lugar em vez de dez fotos
aleatórias. Mantenha idêntico entre as gerações:

> fotografia editorial de interior, luz natural difusa vindo de uma janela
> lateral, paleta de neutros quentes — off-white #efe9e7, greige #e1d7d3,
> madeira clara, marrom espresso #5c4a3b —, superfícies foscas, sombras suaves
> e longas, composição limpa com bastante espaço negativo, lente 50 mm,
> profundidade de campo rasa, cor levemente dessaturada, sem pessoas

**Negativo (o que excluir):** pessoas, rostos, mãos, texto, letras, marca
d'água, logotipo, cores saturadas, HDR, gradiente, plástico brilhante, luz de
flash, estética de banco de imagens, colagem, moldura.

## Os dez prompts

| Cód | Onde | Proporção | Prompt (some a base de estilo acima) |
| --- | --- | --- | --- |
| **F1** | Home, herói | 3:4 retrato | Recepção de uma clínica de estética pequena e bem cuidada, balcão de madeira clara, uma planta de folhas largas ao lado, cadeira de espera com estofado bege, parede off-white, luz da manhã entrando pela esquerda |
| **F2** | Home, "o que roda" | 4:3 paisagem | Celular apoiado sobre uma mesa de madeira clara ao lado de uma xícara, tela ligada mostrando uma conversa de mensagens sem texto legível, foco raso no aparelho |
| **F3** | Home, mosaico | 1:1 | Agenda de papel aberta sobre bancada clara, caneta ao lado, páginas com marcações genéricas ilegíveis, sombra suave de janela |
| **F4** | Home, mosaico | 1:1 | Bancada de atendimento organizada, frascos âmbar e brancos alinhados, toalha dobrada, tudo em neutros quentes, sem rótulos legíveis |
| **F5** | Home, mosaico | 1:1 | Maca de atendimento preparada com lençol branco e toalha dobrada, luminária de haste desligada ao lado, sala vazia e calma |
| **F6** | Home, quem somos | 3:4 retrato | **Foto real de vocês dois — não gerar.** Sugestão: os dois lado a lado perto de uma janela, roupa neutra, fundo liso, sorriso natural |
| **F7** | Enfermeiras, herói | 3:4 retrato | Mesa de trabalho com caderno aberto, calculadora simples, xícara de café e um vaso pequeno, madeira clara, luz de janela pela direita |
| **F8** | Enfermeiras, quem faz | 4:3 paisagem | Pilha de livros e um caderno com marcadores coloridos sobre mesa escura, luz lateral quente, atmosfera de estudo à noite |
| **F9** | Especialistas, herói | 3:4 retrato | Consultório de estética vazio e bem equipado, cadeira de atendimento em couro claro, armário de madeira, luz suave, ambiente premium e silencioso |
| **F10** | Especialistas, perfil | 4:3 paisagem | Tripé de celular apontado para uma bancada clara e organizada, anel de luz desligado ao lado, cenário de gravação caseira e simples |

## Como colocar a imagem na moldura

Salve em `site/fotos/` como `.webp`, com no máximo ~250 KB cada, e troque o
conteúdo da moldura:

```html
<!-- antes -->
<div class="foto arco retrato viva">
  <span class="cod">F1</span>
  <span class="vazio"><b>Recepção da clínica</b>…</span>
</div>

<!-- depois -->
<div class="foto arco retrato viva">
  <img src="./fotos/f1.webp" alt="Recepção de uma clínica de estética com balcão de madeira clara e luz de manhã">
</div>
```

A moldura já recorta, mantém a proporção e aplica o arco. O `alt` descreve a
cena para quem usa leitor de tela — escreva um de verdade, não repita o prompt.

## Animação

O site já traz **uma** animação, e de propósito só uma: uma revelação suave ao
rolar (`.revela`) e um zoom lento nas fotos marcadas com `.viva`. Ambas usam
`animation-timeline` nativo — sem biblioteca, sem JavaScript — e desligam
sozinhas para quem pediu menos movimento no sistema. Movimento espalhado é o
que faz um site parecer gerado; um gesto bem colocado é o que faz parecer caro.

### Se quiser transformar as fotos em vídeo curto

Para ferramentas de imagem-para-vídeo, o pedido é sempre o mesmo: **quase nada
acontecendo**. O erro comum é pedir movimento demais e o resultado escorregar.

> a câmera se aproxima muito lentamente, cerca de 5% ao longo de 4 segundos,
> movimento contínuo e constante, sem cortes, sem zoom brusco, luz estável,
> nada se move na cena além da câmera

Variações que funcionam com estas imagens:

- **F1 e F9 (ambientes):** *travelling lateral lentíssimo da esquerda para a direita, 4 s.*
- **F4 e F5 (objetos):** *a luz da janela muda muito devagar, como uma nuvem passando, 5 s.*
- **F2 (celular):** *a tela acende suavemente no primeiro segundo, o resto permanece imóvel.*

### Para Reels e TikTok, ancorados no texto do site

Os ganchos das páginas já são falas de vídeo. Estes três reaproveitam:

1. **"A cliente não faltou porque não gostou. Faltou porque esqueceu."**
   Abertura com a frase em tela sobre a imagem F3 (agenda), corte para o celular
   com a confirmação chegando, fecha com o número 30%.
2. **"Você não precisa de mais clientes."** Fala direto para a câmera, contra
   parede neutra, cinco segundos de pausa depois da frase antes de continuar.
3. **"Uma sessão de R$ 45 de insumo custa R$ 83."** Tela da calculadora sendo
   preenchida, número mudando ao vivo — a ferramenta é o vídeo.

Para gerar cenas do zero em vídeo, mantenha a base de estilo e acrescente:
*plano fixo, câmera na mão quase imperceptível, 24 fps, sem música épica.*
