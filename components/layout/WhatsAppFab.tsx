import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/site";

/** Floating WhatsApp shortcut. Pure CSS — no client JavaScript. */
export function WhatsAppFab() {
  const t = useTranslations("WhatsApp");
  const common = useTranslations("Common");

  return (
    <a
      href={siteConfig.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-40 flex h-14 items-center rounded-full bg-white px-3.5 text-ink shadow-pop ring-1 ring-line transition-[padding,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:pr-5 focus-visible:pr-5 motion-reduce:transition-none sm:right-6 sm:bottom-6 print:hidden"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
        <WhatsAppIcon className="size-4" />
      </span>
      {/* Label collapses visually but always stays in the accessible name. */}
      <span className="grid grid-cols-[0fr] text-sm font-semibold whitespace-nowrap transition-[grid-template-columns] duration-300 ease-out-soft group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none">
        <span className="overflow-hidden">
          <span className="pl-2.5">{t("fab")}</span>
          <span className="sr-only"> {common("newTab")}</span>
        </span>
      </span>
    </a>
  );
}
