import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
};

const sizeClasses = {
  sm: {
    icon: "h-9 w-9 rounded-xl",
    iconGlyph: 16,
    title: "text-base",
    gap: "gap-2.5",
    subtitle: "text-[10px] tracking-[0.22em]",
  },
  md: {
    icon: "h-11 w-11 rounded-2xl",
    iconGlyph: 20,
    title: "text-lg",
    gap: "gap-3",
    subtitle: "text-[11px] tracking-[0.24em]",
  },
  lg: {
    icon: "h-12 w-12 rounded-2xl",
    iconGlyph: 22,
    title: "text-xl",
    gap: "gap-3.5",
    subtitle: "text-xs tracking-[0.24em]",
  },
} as const;

export function BrandLogo({
  tone = "dark",
  size = "md",
  subtitle,
  href = "/",
  className,
  onClick,
}: BrandLogoProps) {
  const config = sizeClasses[size];
  const titleTone = tone === "light" ? "text-white" : "text-brand-dark";
  const subtitleTone = tone === "light" ? "text-white/45" : "text-slate-400";
  const iconTone = tone === "light"
    ? "bg-white/10 shadow-lg shadow-brand-accent/20"
    : "bg-accent-gradient shadow-lg shadow-brand-accent/15";

  return (
    <Link href={href} className={cn("inline-flex items-center", config.gap, className)} onClick={onClick}>
      <span className={cn("flex items-center justify-center", config.icon, iconTone)}>
        <Zap size={config.iconGlyph} className="text-white" />
      </span>
      <span className="min-w-0">
        <span className={cn("block font-semibold tracking-[-0.03em]", config.title, titleTone)}>
          Liz<span className="text-brand-accent">Con</span>Mart
        </span>
        {subtitle ? (
          <span className={cn("mt-0.5 block font-medium uppercase", config.subtitle, subtitleTone)}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </Link>
  );
}