import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";
import { WhatsAppFlutuante } from "@/components/layout/WhatsAppFlutuante";
import { Revelador } from "@/components/layout/Revelador";
import { MARCA } from "@/data/marca";
import { UNIDADES } from "@/data/lojas";
import { metadados } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(MARCA.url),
  ...metadados({
    descricao:
      "Moda feminina e masculina para acompanhar você em cada ocasião. Camisaria, alfaiataria e atendimento de loja no interior de São Paulo.",
    caminho: "/",
  }),
  icons: { icon: "/assets/favicon.png", apple: "/assets/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
  width: "device-width",
  initialScale: 1,
};

/**
 * Dados da organização. Só entram endereços confirmados: as cidades sem
 * endereço publicado aparecem como área atendida, não como loja.
 */
const organizacao = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: MARCA.nome,
  url: MARCA.url,
  logo: `${MARCA.url}/assets/logo.png`,
  image: `${MARCA.url}/assets/og.jpg`,
  description: MARCA.descricao,
  telephone: `+${MARCA.whatsappCentral.numero}`,
  sameAs: [MARCA.instagram.url],
  areaServed: UNIDADES.map((u) => ({ "@type": "City", name: `${u.cidade}, ${u.estado}` })),
  department: UNIDADES.filter((u) => u.endereco).map((u) => ({
    "@type": "ClothingStore",
    name: `${MARCA.nome} ${u.cidade}`,
    telephone: u.telefone ? `+${u.telefone.numero}` : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: u.endereco,
      addressLocality: u.cidade,
      addressRegion: u.estado,
      addressCountry: "BR",
    },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Antes da pintura: marca que há JS, para a revelação ao rolar poder começar escondida. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacao) }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="fixed top-2 left-2 z-50 -translate-y-24 bg-bordeaux px-4 py-3 text-ivory transition-transform focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
        <WhatsAppFlutuante />
        <Revelador />
        {/* Analytics próprio da marca (sem cookie), o mesmo que alimenta o dashboard. */}
        <Script src="/analytics.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
