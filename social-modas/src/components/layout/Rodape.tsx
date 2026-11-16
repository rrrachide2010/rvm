import Image from "next/image";
import Link from "next/link";
import { NAV_RODAPE } from "@/data/navegacao";
import { MARCA } from "@/data/marca";
import { UNIDADES } from "@/data/lojas";
import { linkWhatsApp } from "@/lib/whatsapp";

const comEndereco = UNIDADES.filter((u) => u.endereco);

export function Rodape() {
  return (
    <footer className="sobre-bordeaux bg-bordeaux text-sand">
      <div className="conteiner grid grid-cols-1 gap-14 py-20 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
        <div>
          {/* O logo oficial, dourado: aqui ele tem o contraste que não teria no fundo claro. */}
          <Image src="/assets/logo.png" alt="Social Modas" width={132} height={132} className="size-[132px]" unoptimized />
          <p className="mt-6 max-w-xs font-serif text-[1.375rem] leading-snug text-ivory">{MARCA.conceito}</p>
          <p className="mt-4 max-w-xs text-legenda">
            Moda feminina e masculina, com {MARCA.tradicao} de tradição no {MARCA.regiao}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {NAV_RODAPE.map((grupo) => (
            <nav key={grupo.titulo} aria-label={grupo.titulo}>
              <p className="rotulo !text-sand/80">{grupo.titulo}</p>
              <ul className="mt-4 space-y-1">
                {grupo.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-ivory/90 transition-colors hover:text-white">
                      {l.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="rotulo !text-sand/80">Contato</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={linkWhatsApp(MARCA.whatsappCentral.numero)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-ivory/90 hover:text-white">
                  WhatsApp {MARCA.whatsappCentral.exibicao}
                </a>
              </li>
              <li>
                <a href={MARCA.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-ivory/90 hover:text-white">
                  Instagram @{MARCA.instagram.usuario}
                </a>
              </li>
            </ul>
            {comEndereco.map((u) => (
              <address key={u.id} className="mt-4 text-legenda not-italic">
                {u.endereco}
                {u.bairro ? `, ${u.bairro}` : ""}
                <br />
                {u.cidade}/{u.estado}
              </address>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-sand/20">
        <div className="conteiner flex flex-col gap-2 py-6 text-legenda sm:flex-row sm:items-center sm:justify-between">
          <p>© {MARCA.nome}. Todos os direitos reservados.</p>
          <p>Compras online pelo Mercado Livre.</p>
        </div>
      </div>
    </footer>
  );
}
