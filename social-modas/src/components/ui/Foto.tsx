import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  /** Atributo `sizes` do <img>: quanto da tela a foto ocupa em cada largura. */
  sizes: string;
  prioridade?: boolean;
  className?: string;
  imgClassName?: string;
  posicao?: string;
};

/**
 * Foto que preenche o quadro do pai (o pai define a proporção).
 *
 * Sem `src`, mostra um quadro areia com o símbolo apagado em vez de um
 * ícone de imagem quebrada: dado incompleto no catálogo não pode virar
 * defeito visível na vitrine.
 */
export function Foto({ src, alt, sizes, prioridade, className = "", imgClassName = "", posicao = "center" }: Props) {
  if (!src) {
    return (
      <div className={`absolute inset-0 grid place-items-center bg-superficie/50 ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <svg viewBox="0 0 64 40" className="w-14 text-fosco/60" aria-hidden="true">
          <path d="M32 7.5 44.5 20 32 32.5 19.5 20Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={prioridade}
      fetchPriority={prioridade ? "high" : undefined}
      className={`object-cover ${imgClassName} ${className}`}
      style={{ objectPosition: posicao }}
    />
  );
}
