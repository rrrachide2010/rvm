import type { MetadataRoute } from "next";
import { MARCA } from "@/data/marca";

export const dynamic = "force-static";

/** Painel, dashboard, retorno de pagamento e API ficam fora da busca. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin.html", "/dashboard.html", "/pagamento.html", "/api/"] },
    sitemap: `${MARCA.url}/sitemap.xml`,
  };
}
