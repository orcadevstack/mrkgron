import type { ReactNode } from "react";

type MarketingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
};

export function MarketingHero({ eyebrow, title, description, children }: MarketingHeroProps) {
  return (
    <section className="border-b border-black/10 bg-white pt-32 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[#EE6C4D]">{eyebrow}</p>
          <h1 className="mt-6 text-[32px] font-semibold leading-tight text-black">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black">{description}</p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}