import type { NextConfig } from "next";
import { LARGURAS } from "./src/lib/larguras";

/**
 * Export estático: a saída em `out/` é HTML puro, servido como arquivo pelo
 * Vercel ao lado das funções que já existem em `api/` (catálogo, pedidos,
 * eventos, pagamento e chatbot). Nenhuma delas precisa mudar para o site novo
 * entrar no ar.
 *
 * `trailingSlash` gera `colecoes/index.html` em vez de `colecoes.html`, e
 * qualquer servidor estático entrega isso em `/colecoes/` sem regra extra.
 *
 * As imagens passam por um loader próprio: `scripts/imagens.mjs` gera as
 * versões em WebP antes do build, e o loader só escolhe a largura certa.
 * O otimizador do Next precisa de servidor, e aqui não há servidor.
 */
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imagem-loader.ts",
    deviceSizes: [...LARGURAS.telas],
    imageSizes: [...LARGURAS.miniaturas],
  },
};

export default config;
