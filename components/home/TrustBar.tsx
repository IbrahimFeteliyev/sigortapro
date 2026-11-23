import { Languages, MessagesSquare, Smartphone, UserRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const items: { key: "online" | "advice" | "contact" | "languages"; icon: LucideIcon }[] = [
  { key: "online", icon: Smartphone },
  { key: "advice", icon: UserRound },
  { key: "contact", icon: MessagesSquare },
  { key: "languages", icon: Languages },
];

export function TrustBar() {
  const t = useTranslations("Trust");

  return (
    <div className="container-page">
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-line shadow-card ring-1 ring-line min-[480px]:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon }) => (
          <li key={key} className="flex items-center gap-4 bg-white p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <Icon aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block font-semibold text-ink">{t(`${key}.title`)}</span>
              <span className="mt-0.5 block text-sm text-muted">{t(`${key}.text`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
