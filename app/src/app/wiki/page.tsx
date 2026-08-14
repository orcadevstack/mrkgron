import type { Metadata } from "next";
import Link from "next/link";
import { WikiSearch } from "@/components/wiki/WikiSearch";
import { WIKI_PAGES, WIKI_SECTIONS } from "@/content/wiki/registry";

export const metadata: Metadata = {
  title: "Wiki",
  description: "Official Mrkgron product, platform, developer, and compliance documentation.",
};

export default function WikiHomePage() {
  const wikiCards = WIKI_SECTIONS.flatMap((section) => (
    WIKI_PAGES
      .filter((page) => page.section === section)
      .map((page) => ({ ...page, section }))
  ));

  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-12">
        <header className="lg:col-span-8">
          <p className="text-sm font-medium text-[#EE6C4D]">MRKGRON WIKI</p>
          <h1 className="mt-4 text-[32px] font-semibold text-black">Official product documentation</h1>
          <p className="mt-4 text-xl font-medium leading-8 text-black">The operating reference for product use, implementation, integrations, and governance.</p>
          <div className="mt-6 grid gap-4 border-l border-t border-black/10 sm:grid-cols-2">
            <div className="border-b border-r border-black/10 p-4"><h2 className="text-base font-semibold text-black">Purpose</h2><p className="mt-3 text-base leading-7 text-black">Mrkgron gives organizations one controlled record for customer, communications, commerce, and operating decisions.</p></div>
            <div className="border-b border-r border-black/10 p-4"><h2 className="text-base font-semibold text-black">Mission</h2><p className="mt-3 text-base leading-7 text-black">Make operational data understandable, governed, and usable at the point of decision.</p></div>
            <div className="border-b border-r border-black/10 p-4"><h2 className="text-base font-semibold text-black">Vision</h2><p className="mt-3 text-base leading-7 text-black">Establish a consistent operating system for accountable growth and durable institutional control.</p></div>
            <div className="border-b border-r border-black/10 p-4"><h2 className="text-base font-semibold text-black">Core capabilities</h2><p className="mt-3 text-base leading-7 text-black">CRM, communications, analytics, commerce, automation, integrations, and workspace governance operate through one platform.</p></div>
          </div>
          <div className="mt-8 max-w-2xl"><WikiSearch pages={WIKI_PAGES} /></div>
        </header>
        <aside className="border-l border-black/10 pl-6 lg:col-span-4">
          <h2 className="text-sm font-medium text-black">Documentation standard</h2>
          <p className="mt-3 text-base leading-7 text-black">Mrkgron documentation records the controls, interfaces, and operating practices required to use the platform responsibly.</p>
        </aside>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="grid grid-cols-1 border-l border-t border-black/10 md:grid-cols-2 lg:grid-cols-3">
          {wikiCards.map((page) => (
            <Link key={page.slug} href={`/wiki/${page.slug}`} className="border-b border-r border-black/10 p-6 hover:bg-black/[0.03]">
              <p className="text-sm font-medium text-[#EE6C4D]">{page.section}</p>
              <h2 className="mt-4 text-xl font-semibold text-black">{page.title}</h2>
              <p className="mt-3 text-base leading-7 text-black">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}