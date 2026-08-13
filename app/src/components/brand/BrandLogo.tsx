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
  sm: { title: "text-base", subtitle: "text-xs" },
  md: { title: "text-lg", subtitle: "text-xs" },
  lg: { title: "text-xl", subtitle: "text-sm" },
} as const;

export function BrandLogo({
  tone = "dark",
  size = "md",
  subtitle,
  href = "/",
  className,
  onClick,
}: BrandLogoProps) {
  const c = sizeConfig[size];
  const titleTone = tone === "light" ? "text-white" : "text-black";
  const subtitleTone = tone === "light" ? "text-white/70" : "text-black/60";

  return (
    <Link href={href} className={cn("inline-flex items-center", className)} onClick={onClick}>
      <span className="min-w-0">
        <span className={cn("block font-semibold", c.title, titleTone)}>
          Mrk<span className="text-[#EE6C4D]">gron</span>
        </span>
        {subtitle ? (
          <span className={cn("mt-1 block font-normal", c.subtitle, subtitleTone)}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </Link>
  );
}