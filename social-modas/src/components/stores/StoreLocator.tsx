"use client";

import { useId, useMemo, useState } from "react";
import { MapPin, Navigation, Phone, Search } from "lucide-react";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { UNIDADES, normalizar, rotaNoMapa, type Unidade } from "@/data/lojas";
import { linkWhatsApp } from "@/lib/whatsapp";
import { MARCA } from "@/data/marca";

/**
 * Módulo 08. Lista que funciona sem mapa, sem API paga e sem pedir a
 * localização do navegador. Busca por cidade (sem acento e sem caixa) e,
 * quando houver lojas em mais de um estado, filtro por estado.
 *
 * Os dados vêm de `src/data/lojas.ts`. Campo que não existe não aparece:
 * cidade sem endereço confirmado mostra só o atendimento pelo WhatsApp.
 */
export function StoreLocator({ compacto = false }: { compacto?: boolean }) {
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("todos");
  const idBusca = useId();
  const idEstado = useId();

  const estados = useMemo(() => [...new Set(UNIDADES.map((u) => u.estado))].sort(), []);

  const resultado = useMemo(() => {
    const termo = normalizar(busca);
    return UNIDADES.filter((u) => (estado === "todos" || u.estado === estado) && (!termo || normalizar(u.cidade).includes(termo)));
  }, [busca, estado]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row" role="search">
        <div className="relative flex-1">
          <label htmlFor={idBusca} className="sr-only">
            Buscar por cidade
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fosco" strokeWidth={1.8} aria-hidden="true" />
          <input
            id={idBusca}
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite sua cidade"
            autoComplete="address-level2"
            className="h-12 w-full rounded-peca border border-creme/25 bg-superficie-2 pr-4 pl-11 text-[1rem] text-creme placeholder:text-nevoa focus:border-ouro focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ouro"
          />
        </div>
        {estados.length > 1 ? (
          <div>
            <label htmlFor={idEstado} className="sr-only">
              Filtrar por estado
            </label>
            <select
              id={idEstado}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="h-12 w-full rounded-peca border border-creme/25 bg-superficie-2 px-4 text-creme sm:w-auto"
            >
              <option value="todos">Todos os estados</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-legenda text-nevoa" aria-live="polite">
        {resultado.length === 0
          ? "Nenhuma cidade encontrada."
          : `${resultado.length} ${resultado.length === 1 ? "cidade" : "cidades"} com atendimento Social Modas.`}
      </p>

      {resultado.length === 0 ? (
        <div className="mt-6 rounded-peca border border-fio bg-superficie p-6">
          <p className="font-serif text-h3 text-creme">Ainda não encontramos essa cidade.</p>
          <p className="mt-2 text-nevoa">Fale com a gente pelo WhatsApp: a equipe indica a loja mais perto de você.</p>
          <a
            href={linkWhatsApp(MARCA.whatsappCentral.numero, `Olá, Social Modas! Qual a loja mais perto de ${busca.trim() || "mim"}?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial mt-4"
          >
            <IconeWhatsApp className="size-4" />
            {MARCA.whatsappCentral.exibicao}
          </a>
        </div>
      ) : (
        <ul className={`mt-6 grid gap-4 ${compacto ? "sm:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
          {resultado.map((u) => (
            <CartaoUnidade key={u.id} unidade={u} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CartaoUnidade({ unidade: u }: { unidade: Unidade }) {
  const rota = rotaNoMapa(u);
  return (
    <li className="flex flex-col rounded-peca border border-fio bg-superficie-2 p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-[1.4375rem] leading-tight text-ouro">{u.cidade}</h3>
        <span className="rotulo pt-2">{u.estado}</span>
      </div>
      {u.endereco ? (
        <address className="mt-3 flex gap-2 text-[0.9375rem] text-creme not-italic">
          <MapPin className="mt-1 size-4 shrink-0 text-fosco" strokeWidth={1.8} aria-hidden="true" />
          <span>
            {u.endereco}
            {u.bairro ? `, ${u.bairro}` : ""}
          </span>
        </address>
      ) : (
        <p className="mt-3 text-[0.9375rem] text-nevoa">Atendimento e endereço da loja pelo WhatsApp.</p>
      )}
      {u.horario ? <p className="mt-2 text-legenda text-nevoa">{u.horario}</p> : null}

      <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-5">
        <a
          href={linkWhatsApp(u.whatsapp.numero, `Olá, Social Modas! Estou procurando a loja de ${u.cidade}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="link-editorial text-[0.875rem]"
          aria-label={`WhatsApp da Social Modas em ${u.cidade}: ${u.whatsapp.exibicao}`}
        >
          <IconeWhatsApp className="size-4" />
          WhatsApp
        </a>
        {u.telefone ? (
          <a href={`tel:+${u.telefone.numero}`} className="link-editorial text-[0.875rem]" aria-label={`Ligar para a loja de ${u.cidade}: ${u.telefone.exibicao}`}>
            <Phone className="size-4" strokeWidth={1.8} aria-hidden="true" />
            Ligar
          </a>
        ) : null}
        {rota ? (
          <a href={rota} target="_blank" rel="noopener noreferrer" className="link-editorial text-[0.875rem]" aria-label={`Rota até a loja de ${u.cidade} no Google Maps`}>
            <Navigation className="size-4" strokeWidth={1.8} aria-hidden="true" />
            Como chegar
          </a>
        ) : null}
      </div>
    </li>
  );
}
