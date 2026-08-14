import Link from "next/link";
import { WIKI_PAGES, WIKI_SECTIONS } from "@/content/wiki/registry";

export function WikiNavigation() {
  return (
    <nav aria-label="Wiki navigation" className="border-r border-black/10 pr-6">
      <Link href="/wiki" className="text-base font-medium text-black hover:opacity-80">Wiki home</Link>
      <div className="mt-6 space-y-6">
        {WIKI_SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="text-sm font-medium text-black">{section}</h2>
            <ul className="mt-3 space-y-2">
              {WIKI_PAGES.filter((page) => page.section === section).map((page) => (
                <li key={page.slug}>
                  <Link href={`/wiki/${page.slug}`} className="text-sm text-black/70 hover:text-black">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}