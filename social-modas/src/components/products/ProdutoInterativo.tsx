"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Foto } from "@/components/ui/Foto";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { classeBotao } from "@/components/ui/Botao";
import { linkWhatsApp, mensagemDeReserva } from "@/lib/whatsapp";
import { registrar } from "@/lib/analytics";
import type { Unidade } from "@/data/lojas";

export type CorResolvida = { nome: string; hex: string; fotos: string[] };

type Props = {
  id: string;
  nome: string;
  cores: CorResolvida[];
  fotosSemCor: string[];
  tamanhos: string[];
  linkMl?: string;
  unidades: Pick<Unidade, "id" | "cidade" | "estado" | "whatsapp">[];
  /** Conteúdo do servidor (descrição, guia) que fica entre a cor e a reserva. */
  children?: ReactNode;
  cabecalho: ReactNode;
};

/**
 * A parte viva da página de produto: galeria, cor, compra e reserva.
 *
 * A cor pode vir da URL (`?cor=Vinho`), que é como os looks e a vitrine
 * linkam uma cor específica. Trocar de cor atualiza a URL sem
 * recarregar, para o link copiado abrir na mesma cor.
 */
export function ProdutoInterativo({ id, nome, cores, fotosSemCor, tamanhos, linkMl, unidades, cabecalho, children }: Props) {
  const [indiceCor, setIndiceCor] = useState(0);
  const [foto, setFoto] = useState(0);
  const [tamanho, setTamanho] = useState("");
  const [unidade, setUnidade] = useState("");
  const reduzir = useReducedMotion();
  const idTamanho = useId();
  const idUnidade = useId();

  const cor = cores[indiceCor];
  const fotos = useMemo(() => (cor?.fotos.length ? cor.fotos : fotosSemCor), [cor, fotosSemCor]);
  const fotoAtual = fotos[Math.min(foto, fotos.length - 1)];

  useEffect(() => {
    registrar("ver_produto", { produto_id: id });
  }, [id]);

  // A cor pedida na URL só é lida depois de montar: assim o HTML estático
  // sai completo (na primeira cor) em vez de virar um esqueleto vazio, que
  // é o que o Next faria com useSearchParams num export estático.
  useEffect(() => {
    const pedida = new URLSearchParams(window.location.search).get("cor");
    const i = cores.findIndex((c) => c.nome === pedida);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com a URL uma vez, após a hidratação
    if (i > 0) setIndiceCor(i);
  }, [cores]);

  const escolherCor = (i: number) => {
    setIndiceCor(i);
    setFoto(0);
    const nomeCor = cores[i]?.nome;
    if (nomeCor) {
      const url = new URL(window.location.href);
      url.searchParams.set("cor", nomeCor);
      window.history.replaceState(null, "", url);
    }
  };

  const escolhida = unidades.find((u) => u.id === unidade);
  const linkReserva = escolhida
    ? linkWhatsApp(
        escolhida.whatsapp.numero,
        mensagemDeReserva({ produto: nome, cidade: escolhida.cidade, cor: cor?.nome, tamanho: tamanho || undefined }),
      )
    : null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
      {/* Galeria */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-peca bg-sand sm:order-2">
            <LazyMotion features={domAnimation} strict>
<AnimatePresence initial={false}>
              <m.div
                key={fotoAtual}
                className="absolute inset-0"
                initial={reduzir ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Foto src={fotoAtual} alt={`${nome}${cor ? `, cor ${cor.nome}` : ""}, foto ${foto + 1} de ${fotos.length}`} sizes="(min-width: 1024px) 46vw, 100vw" prioridade={foto === 0} />
              </m.div>
            </AnimatePresence>
</LazyMotion>
          </div>
          {fotos.length > 1 ? (
            <ul className="flex gap-3 sm:order-1 sm:flex-col" aria-label="Fotos do produto">
              {fotos.map((f, i) => (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => setFoto(i)}
                    aria-pressed={i === foto}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`relative block aspect-[3/4] w-16 overflow-hidden rounded-peca bg-sand transition-opacity sm:w-full ${i === foto ? "ring-2 ring-bordeaux ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={f} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Informações */}
      <div>
        {cabecalho}

        {cores.length > 0 ? (
          <fieldset className="mt-8">
            <legend className="text-[0.9375rem] text-graphite">
              Cor: <span className="font-medium">{cor?.nome}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {cores.map((c, i) => (
                <button
                  key={c.nome}
                  type="button"
                  onClick={() => escolherCor(i)}
                  aria-pressed={i === indiceCor}
                  aria-label={c.nome}
                  title={c.nome}
                  className={`relative size-11 rounded-full border border-graphite/15 transition-shadow duration-400 ${i === indiceCor ? "ring-2 ring-bordeaux ring-offset-[3px] ring-offset-ivory" : "hover:ring-1 hover:ring-graphite/40 hover:ring-offset-2 hover:ring-offset-ivory"}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          {linkMl ? (
            <a
              href={linkMl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrar("ir_mercado_livre", { produto_id: id, dados: { cor: cor?.nome ?? null } })}
              className={classeBotao("primario", "w-full")}
            >
              Comprar no Mercado Livre
              <ExternalLink className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </a>
          ) : null}
          <p className="text-legenda text-mute">
            {linkMl
              ? "Pagamento, frete e parcelamento acontecem no ambiente do Mercado Livre."
              : "Esta peça é vendida nas lojas. Consulte a reserva abaixo."}
          </p>
        </div>

        {children}

        {/* Reserva na loja */}
        <section aria-labelledby="reserva" className="mt-10 rounded-peca border border-linha bg-papel p-6 sm:p-8">
          <h2 id="reserva" className="font-serif text-h3 text-bordeaux">
            Prefere provar na loja?
          </h2>
          <p className="mt-2 text-[0.9375rem] text-mute">
            Escolha a cidade e o tamanho. A mensagem chega pronta no WhatsApp da loja, e a equipe confirma se a peça está disponível.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={idUnidade} className="text-[0.875rem] font-medium text-graphite">
                Cidade
              </label>
              <select
                id={idUnidade}
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-peca border border-graphite/25 bg-white px-3 text-graphite"
              >
                <option value="">Escolha a cidade</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.cidade}/{u.estado}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={idTamanho} className="text-[0.875rem] font-medium text-graphite">
                Tamanho
              </label>
              <select
                id={idTamanho}
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-peca border border-graphite/25 bg-white px-3 text-graphite"
              >
                <option value="">{tamanhos.length ? "Escolha o tamanho" : "Ainda não sei"}</option>
                {tamanhos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                {tamanhos.length ? <option value="Ainda não sei">Ainda não sei</option> : null}
              </select>
            </div>
          </div>
          {linkReserva ? (
            <a
              href={linkReserva}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrar("consultar_reserva", { produto_id: id, dados: { cidade: escolhida?.cidade, tamanho, cor: cor?.nome ?? null } })}
              className={classeBotao("contorno", "mt-6 w-full")}
            >
              <IconeWhatsApp className="size-4" />
              Consultar reserva
            </a>
          ) : (
            <button type="button" disabled className={classeBotao("contorno", "mt-6 w-full cursor-not-allowed opacity-50 hover:border-graphite/30 hover:text-graphite")}>
              <IconeWhatsApp className="size-4" />
              Escolha a cidade para consultar
            </button>
          )}
          <p className="mt-3 text-legenda text-taupe-ink">A reserva só vale depois da confirmação da loja.</p>
        </section>
      </div>
    </div>
  );
}
