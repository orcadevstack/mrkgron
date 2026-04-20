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

/** Institutional logo mark — hexagonal network representing connected commerce */
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
        {/* Hexagon shell */}
        <path
          d="M12 2 L20.66 7 L20.66 17 L12 22 L3.34 17 L3.34 7 Z"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Top node */}
        <circle cx="12" cy="8" r="2.3" fill="white" />
        {/* Bottom-left node */}
        <circle cx="7.4" cy="16" r="2.3" fill="rgba(255,255,255,0.68)" />
        {/* Bottom-right node */}
        <circle cx="16.6" cy="16" r="2.3" fill="rgba(255,255,255,0.68)" />
        {/* Connecting edges */}
        <line x1="12" y1="10.3" x2="7.4" y2="13.7" stroke="rgba(255,255,255,0.48)" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="12" y1="10.3" x2="16.6" y2="13.7" stroke="rgba(255,255,255,0.48)" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="9.7" y1="16" x2="14.3" y2="16" stroke="rgba(255,255,255,0.48)" strokeWidth="1.3" strokeLinecap="round" />
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