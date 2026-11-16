import Link from "next/link";
import { Foto } from "@/components/ui/Foto";
import type { Produto } from "@/types/catalogo";
import { NOMES_CATEGORIA, fotoDe, fotosDe } from "@/data/catalogo";
import { MARCA } from "@/data/marca";
import { brl } from "@/lib/seo";

type Props = {
  produto: Produto;
  cor?: string;
  sizes?: string;
  className?: string;
};

/**
 * Cartão de produto. Sem etiqueta promocional: "Novo" e "Mais vendido"
 * precisam de dado atualizado para serem verdade, e o site não tem.
 *
 * `produto` + `data-id` mantêm o evento `ver_produto` do analytics da marca
 * funcionando dentro de `#grade`, como no site anterior.
 */
export function ProductCard({ produto, cor, sizes = "(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 78vw", className = "" }: Props) {
  const fotos = fotosDe(produto, cor);
  const capa = fotoDe(produto, cor);
  const segunda = fotos.find((f) => f !== capa);
  const href = `/produtos/${produto.id}/${cor ? `?cor=${encodeURIComponent(cor)}` : ""}`;
  const esgotado = produto.estoque === 0;

  return (
    <article className={`produto group relative ${className}`} data-id={produto.id}>
      <Link href={href} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-peca bg-sand">
          <Foto src={capa} alt={`${produto.nome}${cor ? `, cor ${cor}` : ""}`} sizes={sizes} imgClassName="transition-[transform,opacity] duration-[900ms] ease-suave group-hover:scale-[1.03]" />
          {segunda ? (
            <Foto
              src={segunda}
              alt=""
              sizes={sizes}
              imgClassName="opacity-0 transition-opacity duration-[600ms] ease-suave group-hover:opacity-100"
            />
          ) : null}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="rotulo">{NOMES_CATEGORIA[produto.categoria] ?? produto.categoria}</p>
            <h3 className="mt-1.5 font-serif text-[1.1875rem] leading-snug text-graphite transition-colors group-hover:text-bordeaux">
              {produto.nome}
            </h3>
            {produto.cores.length > 1 ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-legenda text-mute">
                <span className="flex -space-x-1" aria-hidden="true">
                  {produto.cores.slice(0, 5).map((c) => (
                    <span key={c.nome} className="size-3 rounded-full border border-ivory ring-1 ring-graphite/10" style={{ background: c.hex }} />
                  ))}
                </span>
                {produto.cores.length} cores
              </p>
            ) : null}
          </div>
          <p className="shrink-0 pt-6 text-[0.9375rem] font-medium text-graphite">
            {esgotado ? "Esgotado" : MARCA.mostrarPrecos && produto.preco ? brl.format(produto.preco) : "Consultar valor"}
          </p>
        </div>
      </Link>
    </article>
  );
}
