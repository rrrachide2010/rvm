import Link from "next/link";
import { MARCA } from "@/data/marca";

export type Migalha = { texto: string; href?: string };

/** Trilha de navegação + o JSON-LD BreadcrumbList correspondente. */
export function Breadcrumbs({ itens }: { itens: Migalha[] }) {
  const todos: Migalha[] = [{ texto: "Início", href: "/" }, ...itens];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todos.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.texto,
      ...(m.href ? { item: new URL(m.href, MARCA.url).toString() } : {}),
    })),
  };
  return (
    <>
      <nav aria-label="Você está em" className="text-legenda text-nevoa">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {todos.map((m, i) => (
            <li key={`${m.texto}-${i}`} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true" className="text-fosco">/</span> : null}
              {m.href && i < todos.length - 1 ? (
                <Link href={m.href} className="inline-flex min-h-8 items-center hover:text-ouro">
                  {m.texto}
                </Link>
              ) : (
                <span aria-current="page" className="text-creme">{m.texto}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
