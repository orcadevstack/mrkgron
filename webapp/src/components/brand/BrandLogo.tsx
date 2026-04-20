import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
};

const sizeConfig = {
  sm: { mark: 36, glyph: 20, title: "text-base", gap: "gap-2.5", subtitle: "text-[10px] tracking-[0.22em]", radius: "rounded-xl" },
  md: { mark: 44, glyph: 24, title: "text-lg", gap: "gap-3", subtitle: "text-[11px] tracking-[0.24em]", radius: "rounded-2xl" },
  lg: { mark: 48, glyph: 26, title: "text-xl", gap: "gap-3.5", subtitle: "text-xs tracking-[0.24em]", radius: "rounded-2xl" },
} as const;

/** Institutional logo mark — three ascending bars representing growth & analytics */
function LogoMark({ size, glyph, radius }: { size: number; glyph: number; radius: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-accent-gradient shadow-lg shadow-brand-accent/20",
        radius,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="1" y="15" width="5" height="8" rx="1.2" fill="rgba(255,255,255,0.55)" />
        <rect x="9.5" y="9" width="5" height="14" rx="1.2" fill="rgba(255,255,255,0.78)" />
        <rect x="18" y="2" width="5" height="21" rx="1.2" fill="white" />
      </svg>
    </span>
  );
}

export function BrandLogo({
  tone = "dark",
  size = "md",
  subtitle,
  href = "/",
  className,
  onClick,
}: BrandLogoProps) {
  const c = sizeConfig[size];
  const titleTone = tone === "light" ? "text-white" : "text-brand-dark";
  const subtitleTone = tone === "light" ? "text-white/45" : "text-slate-400";

  return (
    <Link href={href} className={cn("inline-flex items-center", c.gap, className)} onClick={onClick}>
      <LogoMark size={c.mark} glyph={c.glyph} radius={c.radius} />
      <span className="min-w-0">
        <span className={cn("block font-semibold tracking-[-0.03em]", c.title, titleTone)}>
          Liz<span className="text-brand-accent">Con</span>Mart
        </span>
        {subtitle ? (
          <span className={cn("mt-0.5 block font-medium uppercase", c.subtitle, subtitleTone)}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </Link>
  );
}