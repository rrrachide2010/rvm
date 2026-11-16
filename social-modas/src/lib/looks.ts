import { LOOKS } from "@/data/looks";
import { MARCA } from "@/data/marca";
import { fotoDe, produtoPorId } from "@/data/catalogo";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { LookResolvido, PecaResolvida } from "@/components/products/LookBuilder";

/**
 * Junta cada look com os dados reais do catálogo. Peça cujo produto saiu do
 * catálogo é descartada; look que fica com menos de duas peças sai inteiro.
 * Assim, apagar um produto nunca deixa um look quebrado no ar.
 */
export function looksResolvidos(): LookResolvido[] {
  return LOOKS.flatMap((look) => {
    const pecas: PecaResolvida[] = look.pecas.flatMap((p) => {
      const produto = produtoPorId(p.produtoId);
      if (!produto) return [];
      const cor = p.cor && produto.cores.some((c) => c.nome === p.cor) ? p.cor : undefined;
      return [
        {
          produtoId: produto.id,
          papel: p.papel,
          nome: produto.nome,
          cor,
          foto: fotoDe(produto, cor),
          preco: produto.preco,
          href: `/produtos/${produto.id}/${cor ? `?cor=${encodeURIComponent(cor)}` : ""}`,
        },
      ];
    });
    if (pecas.length < 2) return [];
    const lista = pecas.map((p) => `• ${p.papel}: ${p.nome}${p.cor ? ` (${p.cor})` : ""}`).join("\n");
    return [
      {
        id: look.id,
        titulo: look.titulo,
        ocasiao: look.ocasiao,
        texto: look.texto,
        complemento: look.complemento,
        pecas,
        whatsapp: linkWhatsApp(
          MARCA.whatsappCentral.numero,
          `Olá, Social Modas! Vi o look "${look.titulo}" no site e quero provar:\n${lista}`,
        ),
      },
    ];
  });
}
