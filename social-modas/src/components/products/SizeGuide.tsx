import Link from "next/link";
import { Ruler } from "lucide-react";
import { DICAS_DE_MEDIDA, MEDIR_FEMININO, MEDIR_MASCULINO, TABELA_MASCULINA, type ComoMedir } from "@/data/tamanhos";

function ListaMedidas({ itens }: { itens: ComoMedir[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {itens.map((m) => (
        <div key={m.parte} className="border-t border-fio pt-3">
          <dt className="font-medium text-creme">{m.parte}</dt>
          <dd className="mt-1 text-[0.9375rem] text-nevoa">{m.como}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TabelaMasculina() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-[0.9375rem]">
          <caption className="mb-3 text-left font-medium text-creme">{TABELA_MASCULINA.titulo}</caption>
          <thead>
            <tr className="border-b border-creme/70">
              {TABELA_MASCULINA.colunas.map((c) => (
                <th key={c} scope="col" className="py-3 pr-4 text-rotulo font-medium tracking-[0.12em] text-fosco uppercase">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABELA_MASCULINA.linhas.map((linha) => (
              <tr key={linha[0]} className="border-b border-fio">
                {linha.map((celula, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="py-3 pr-4 font-medium text-creme tabular-nums">
                      {celula}
                    </th>
                  ) : (
                    <td key={i} className="py-3 pr-4 text-nevoa tabular-nums">
                      {celula}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-legenda text-fosco">{TABELA_MASCULINA.nota}</p>
    </div>
  );
}

/**
 * Guia de tamanhos. `completo` é a página /guia-de-tamanhos/; o modo
 * compacto entra na página de produto dentro de um <details>, que abre e
 * fecha sem JavaScript.
 */
export function SizeGuide({ genero = "Masculino", completo = false }: { genero?: string; completo?: boolean }) {
  const feminino = genero === "Feminino";
  const conteudo = (
    <div className="space-y-8">
      <div>
        <p className="rotulo">Como medir</p>
        <ul className="mt-3 space-y-1 text-[0.9375rem] text-nevoa">
          {DICAS_DE_MEDIDA.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <ListaMedidas itens={feminino ? MEDIR_FEMININO : MEDIR_MASCULINO} />
      {feminino ? (
        <p className="text-[0.9375rem] text-nevoa">A tabela de cada peça feminina está com a loja: envie suas medidas e a equipe indica o tamanho.</p>
      ) : (
        <TabelaMasculina />
      )}
      {!completo ? (
        <Link href="/guia-de-tamanhos/" className="link-editorial text-[0.875rem]">
          Abrir o guia completo
        </Link>
      ) : null}
    </div>
  );

  if (completo) return conteudo;

  return (
    <details className="group border-y border-fio">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 font-medium text-creme marker:hidden hover:text-ouro [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-3">
          <Ruler className="size-4 text-fosco" strokeWidth={1.8} aria-hidden="true" />
          Guia de tamanhos
        </span>
        <span aria-hidden="true" className="text-xl leading-none text-fosco transition-transform duration-400 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pt-2 pb-8">{conteudo}</div>
    </details>
  );
}
