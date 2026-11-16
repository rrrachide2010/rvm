/**
 * Símbolo da Social Modas (losango entre dois chevrons) redesenhado em SVG
 * a partir do logo oficial, para funcionar em uma cor só e em tamanho
 * pequeno. O logo dourado original continua no rodapé, sobre bordeaux,
 * onde o dourado tem contraste.
 */
export function SimboloMarca({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true" focusable="false">
      <path d="M4 20 15.5 8.5h6L10 20l11.5 11.5h-6Z" fill="currentColor" />
      <path d="M60 20 48.5 8.5h-6L54 20 42.5 31.5h6Z" fill="currentColor" />
      <path d="M32 7.5 44.5 20 32 32.5 19.5 20Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SimboloMarca className="h-6 w-auto shrink-0" />
      <span className="font-serif text-[1.0625rem] leading-none font-medium tracking-[0.16em] uppercase">
        Social Modas
      </span>
    </span>
  );
}
