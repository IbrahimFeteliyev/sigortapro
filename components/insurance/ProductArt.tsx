import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { InsuranceSlug } from "@/types/insurance";
import { ProductIcon } from "./ProductIcon";

/* Pale tints that stay inside the blue family, one per product. */
const tones: Record<InsuranceSlug, string> = {
  "car-insurance": "from-[#d9e5fe] via-[#edf3ff] to-white",
  casco: "from-[#dfe3ff] via-[#eef0ff] to-white",
  travel: "from-[#d6ecfc] via-[#ecf6ff] to-white",
  property: "from-[#dbe8f3] via-[#eef5fa] to-white",
  life: "from-[#e6e2fd] via-[#f2f0ff] to-white",
};

function Decoration({ slug }: { slug: InsuranceSlug }) {
  const common = {
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    fill: "none",
    stroke: "currentColor",
    className: "absolute inset-0 size-full text-brand-300/70",
  } as const;

  switch (slug) {
    case "car-insurance":
      return (
        <svg {...common}>
          <circle cx="330" cy="58" r="38" strokeWidth="1.4" />
          <circle cx="330" cy="58" r="68" strokeWidth="1.4" opacity=".7" />
          <circle cx="330" cy="58" r="98" strokeWidth="1.4" opacity=".45" />
          <path d="M0 236H400" strokeWidth="1.6" />
          <path d="M0 262H400" strokeWidth="1.6" strokeDasharray="16 14" />
        </svg>
      );
    case "casco":
      return (
        <svg {...common}>
          <path d="M200 26 292 58v68c0 60-39 106-92 124-53-18-92-64-92-124V58l92-32Z" strokeWidth="1.5" />
          <path
            d="M200 52 268 76v52c0 45-29 80-68 93-39-13-68-48-68-93V76l68-24Z"
            strokeWidth="1.4"
            opacity=".55"
          />
          <circle cx="58" cy="236" r="22" strokeWidth="1.4" opacity=".7" />
          <circle cx="350" cy="232" r="10" strokeWidth="1.4" opacity=".7" />
        </svg>
      );
    case "travel":
      return (
        <svg {...common}>
          <path d="M28 252Q196-24 372 206" strokeWidth="1.6" strokeDasharray="6 9" />
          <circle cx="28" cy="252" r="6" fill="currentColor" stroke="none" />
          <circle cx="372" cy="206" r="6" fill="currentColor" stroke="none" />
          <circle cx="74" cy="72" r="30" strokeWidth="1.4" />
          <ellipse cx="74" cy="72" rx="13" ry="30" strokeWidth="1.2" opacity=".7" />
          <path d="M44 72h60" strokeWidth="1.2" opacity=".7" />
        </svg>
      );
    case "property":
      return (
        <svg {...common}>
          <path d="M18 300V196h64v104M98 300V158h76v142M300 300V176h72v124" strokeWidth="1.5" />
          <path
            d="M34 214h14M58 214h14M34 238h14M58 238h14M116 178h14M144 178h14M116 204h14M144 204h14M116 230h14M144 230h14M318 196h14M342 196h14M318 222h14M342 222h14"
            strokeWidth="1.5"
            opacity=".7"
          />
          <circle cx="330" cy="62" r="26" strokeWidth="1.4" opacity=".7" />
        </svg>
      );
    case "life":
      return (
        <svg {...common}>
          <path
            d="M0 170h38l15-30 17 64 16-54 12 20h204l15-30 17 64 16-54 12 20h38"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="76" cy="62" r="24" strokeWidth="1.4" opacity=".6" />
          <circle cx="334" cy="250" r="34" strokeWidth="1.4" opacity=".6" />
        </svg>
      );
  }
}

/**
 * Branded product visual. When a product has photography (`image`), the photo
 * is rendered with next/image instead of the illustration.
 */
export function ProductArt({
  slug,
  label,
  image,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  slug: InsuranceSlug;
  label?: string;
  image?: { src: string; alt: string } | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
        {label ? <ArtLabel>{label}</ArtLabel> : null}
      </div>
    );
  }

  return (
    <div className={cn("relative isolate overflow-hidden bg-linear-to-br", tones[slug], className)}>
      <div aria-hidden>
        <Decoration slug={slug} />
        <div className="absolute inset-0 bg-[radial-gradient(14rem_12rem_at_100%_0%,rgb(255_255_255/0.75),transparent_70%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid size-[4.5rem] place-items-center rounded-[1.4rem] bg-white shadow-pop ring-1 ring-ink/5 transition-transform duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:-rotate-3 motion-reduce:transition-none sm:size-20">
            <ProductIcon slug={slug} className="size-9 text-brand-700" strokeWidth={1.6} />
          </div>
        </div>
      </div>
      {label ? <ArtLabel>{label}</ArtLabel> : null}
    </div>
  );
}

function ArtLabel({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs">
      <span aria-hidden className="size-1.5 rounded-full bg-brand-600" />
      {children}
    </span>
  );
}
