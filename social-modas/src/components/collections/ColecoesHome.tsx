import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle, Palette, Ruler } from "lucide-react";
import { CartaoColecao } from "@/components/collections/CollectionGrid";
import { SimboloMarca } from "@/components/ui/Marca";
import { Widget } from "@/components/ui/Widget";
import { COLECOES, opcoesDa, pecasDa, colecaoPorSlug } from "@/data/colecoes";
import { UNIDADES } from "@/data/lojas";
import { MARCA } from "@/data/marca";
import { brl } from "@/lib/seo";
import { linkWhatsApp } from "@/lib/whatsapp";

/**
 * Módulo 02 da home: coleções + widgets.
 *
 * O cartão Masculino não tem foto aqui: virou um widget com as subcoleções,
 * o preço inicial e o total de opções. Embaixo, quatro widgets curtos
 * (cores, tamanhos, lojas e reserva). Todo número sai do catálogo, das
 * lojas ou da marca: nada é escrito à mão, então nada fica desatualizado.
 *
 * A página /colecoes/ continua usando o CollectionGrid original.
 */

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

function dadosMasculino() {
  const masculino = colecaoPorSlug("masculino");
  if (!masculino) return null;
  const pecas = pecasDa(masculino);
  const ids = new Set(pecas.map((p) => p.id));
  // Subcoleções: as coleções cujas peças estão todas dentro do masculino.
  const sub = COLECOES.filter((c) => {
    if (c.slug === masculino.slug || c.slug === "feminino") return false;
    const ps = pecasDa(c);
    return ps.length > 0 && ps.every((p) => ids.has(p.id));
  }).map((c) => ({ slug: c.slug, titulo: c.titulo, opcoes: opcoesDa(c) }));
  const precos = pecas.map((p) => p.preco).filter((v): v is number => typeof v === "number");
  return {
    colecao: masculino,
    total: opcoesDa(masculino),
    sub,
    aPartirDe: MARCA.mostrarPrecos && precos.length ? Math.min(...precos) : null,
  };
}

function paleta() {
  const masculino = colecaoPorSlug("masculino");
  const pecas = masculino ? pecasDa(masculino) : [];
  const vistas = new Map<string, { nome: string; hex: string }>();
  for (const p of pecas) for (const c of p.cores) if (!vistas.has(c.nome)) vistas.set(c.nome, { nome: c.nome, hex: c.hex });
  const tecidos = new Set(pecas.filter((p) => p.cores.length > 0).map((p) => p.tecido));
  return { cores: [...vistas.values()], tecidos: tecidos.size };
}

function numeracao() {
  const camisas = colecaoPorSlug("camisas");
  const todos = new Set((camisas ? pecasDa(camisas) : []).flatMap((p) => p.tamanhos));
  return [...todos].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
}

function WidgetMasculino({ ordem }: { ordem: number }) {
  const d = dadosMasculino();
  if (!d) return null;
  return (
    <div
      className="cartao relative flex flex-col justify-between overflow-hidden p-7 sm:col-span-1 sm:p-9 lg:col-span-5 lg:row-span-2"
      style={{ "--ordem": ordem } as React.CSSProperties}
      data-revelar
    >
      <SimboloMarca className="pointer-events-none absolute -top-10 -right-12 w-64 text-ouro/[0.06]" />
      <div className="relative">
        <p className="rotulo">Coleção</p>
        <h3 className="mt-4 font-serif text-[clamp(2.25rem,1.8rem+2vw,3.5rem)] leading-none text-creme">{d.colecao.titulo}</h3>
        <p className="mt-4 max-w-sm text-lead text-nevoa">{d.colecao.chamada}</p>
      </div>

      <ul className="relative mt-8 divide-y divide-fio border-y border-fio">
        {d.sub.map((s) => (
          <li key={s.slug}>
            <Link href={`/colecoes/${s.slug}/`} className="group/linha flex items-center justify-between gap-4 py-4 text-creme transition-colors hover:text-ouro">
              <span className="font-serif text-[1.125rem] tracking-[0.06em] uppercase">{s.titulo}</span>
              <span className="flex items-center gap-2 text-legenda text-nevoa group-hover/linha:text-ouro">
                {plural(s.opcoes, "opção", "opções")}
                <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-6">
        {d.aPartirDe !== null ? (
          <p>
            <span className="rotulo !text-nevoa">A partir de</span>
            <span className="mt-1 block font-serif text-[1.75rem] font-semibold text-ouro">{brl.format(d.aPartirDe)}</span>
          </p>
        ) : null}
        <Link href={`/colecoes/${d.colecao.slug}/`} className="link-editorial">
          Ver {plural(d.total, "opção", "opções")}
          <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function ColecoesHome() {
  const feminino = colecaoPorSlug("feminino");
  const alfaiataria = colecaoPorSlug("alfaiataria");
  const camisas = colecaoPorSlug("camisas");
  const { cores, tecidos } = paleta();
  const tamanhos = numeracao();
  const comEndereco = UNIDADES.find((u) => u.endereco);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(18rem,auto)] lg:grid-cols-12 lg:gap-5">
      {feminino ? <CartaoColecao colecao={feminino} ordem={0} arredondado posicao="lg:col-span-7 min-h-[20rem]" /> : null}
      <WidgetMasculino ordem={1} />
      {alfaiataria ? <CartaoColecao colecao={alfaiataria} ordem={2} arredondado posicao="lg:col-span-4 min-h-[22rem]" /> : null}
      {camisas ? <CartaoColecao colecao={camisas} ordem={3} arredondado posicao="lg:col-span-3 min-h-[22rem]" /> : null}

      <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4 lg:gap-5">
        <Widget
          ordem={4}
          rotulo="Cores"
          Icone={Palette}
          titulo={plural(cores.length, "cor", "cores")}
          href={camisas ? `/colecoes/${camisas.slug}/` : "/colecoes/"}
          acao="Ver as camisas"
        >
          <p>Em {plural(tecidos, "tecido", "tecidos")}. Escolha pela cor, depois pelo caimento.</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Cores disponíveis">
            {cores.map((c) => (
              <li key={c.nome} title={c.nome} className="size-6 rounded-full border border-tinta ring-1 ring-creme/20" style={{ background: c.hex }}>
                <span className="sr-only">{c.nome}</span>
              </li>
            ))}
          </ul>
        </Widget>

        {tamanhos.length ? (
          <Widget
            ordem={5}
            rotulo="Tamanhos"
            Icone={Ruler}
            titulo={`Camisa do ${tamanhos[0]} ao ${tamanhos[tamanhos.length - 1]}`}
            href="/guia-de-tamanhos/"
            acao="Guia de tamanhos"
          >
            <ul className="flex flex-wrap gap-1.5" aria-label="Numeração das camisas">
              {tamanhos.map((t) => (
                <li key={t} className="grid size-8 place-items-center rounded-full border border-fio-forte font-serif text-[0.9375rem] text-creme">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4">Na dúvida do número, o guia mostra como medir.</p>
          </Widget>
        ) : null}

        <Widget
          ordem={6}
          rotulo="Lojas"
          Icone={MapPin}
          titulo={plural(UNIDADES.length, "cidade", "cidades")}
          href="/lojas/"
          acao="Encontrar uma loja"
        >
          <ul className="flex flex-wrap gap-1.5" aria-label="Cidades atendidas">
            {UNIDADES.map((u) => (
              <li key={u.id} className="rounded-full border border-fio px-2.5 py-1 text-[0.75rem] text-creme">
                {u.cidade}
              </li>
            ))}
          </ul>
          {comEndereco ? (
            <p className="mt-4">
              {comEndereco.endereco}, {comEndereco.cidade}/{comEndereco.estado}
            </p>
          ) : null}
        </Widget>

        <Widget
          ordem={7}
          destaque
          rotulo="Reserva"
          Icone={MessageCircle}
          titulo="Reserve para provar"
          href={linkWhatsApp(MARCA.whatsappCentral.numero, `Olá, ${MARCA.nome}! Quero reservar uma peça para provar na loja.`)}
          acao="Chamar no WhatsApp"
        >
          <p className="text-creme/85">Escolha a peça e a cor. A loja separa o seu tamanho para você provar com calma.</p>
          <p className="mt-3 text-creme/85">{MARCA.whatsappCentral.exibicao}</p>
        </Widget>
      </div>
    </div>
  );
}
