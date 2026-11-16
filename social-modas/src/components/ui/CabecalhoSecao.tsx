import type { ReactNode } from "react";

type Props = {
  rotulo: string;
  titulo: ReactNode;
  texto?: ReactNode;
  alinhamento?: "esquerda" | "centro";
  claro?: boolean;
  id?: string;
  nivel?: "h1" | "h2";
};

/** Rótulo + título + linha de apoio: a abertura padrão de toda seção. */
export function CabecalhoSecao({ rotulo, titulo, texto, alinhamento = "esquerda", claro, id, nivel = "h2" }: Props) {
  const Titulo = nivel;
  const centro = alinhamento === "centro";
  return (
    <div className={`max-w-2xl ${centro ? "mx-auto text-center" : ""}`} data-revelar>
      <p className={`rotulo flex items-center gap-3 ${centro ? "justify-center" : ""}`}>
        <span className="filete" aria-hidden="true" />
        {rotulo}
      </p>
      <Titulo id={id} className={`mt-5 text-creme ${nivel === "h1" ? "text-h1" : "text-h2"}`}>
        {titulo}
      </Titulo>
      {texto ? <p className={`mt-5 text-lead ${claro ? "text-creme/85" : "text-nevoa"}`}>{texto}</p> : null}
    </div>
  );
}
