import { MARCA } from "@/data/marca";
import { linkWhatsApp } from "@/lib/whatsapp";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";

/** Atalho fixo para o atendimento. Fica fora do caminho do conteúdo no celular. */
export function WhatsAppFlutuante() {
  return (
    <a
      href={linkWhatsApp(MARCA.whatsappCentral.numero, "Olá, Social Modas! Vim pelo site.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Social Modas no WhatsApp"
      className="group fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-marsala text-creme shadow-[0_10px_30px_-12px_rgb(41_40_43/0.6)] transition-[transform,background-color] duration-400 ease-suave hover:-translate-y-0.5 hover:bg-marsala sm:right-6 sm:bottom-6"
    >
      <IconeWhatsApp className="size-6" />
    </a>
  );
}
