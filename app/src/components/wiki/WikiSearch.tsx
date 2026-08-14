"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { WikiPage } from "@/content/wiki/registry";

type WikiSearchProps = {
  pages: readonly WikiPage[];
};

export function WikiSearch({ pages }: WikiSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(() => {
    if (!deferredQuery) {
      return [];
    }

    return pages.filter((page) => [page.title, page.description, ...page.keywords]
      .join(" ")
      .toLowerCase()
      .includes(deferredQuery));
  }, [deferredQuery, pages]);

  return (
    <div className="relative">
      <label htmlFor="wiki-search" className="sr-only">Search documentation</label>
      <input
        id="wiki-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search guides, modules, API, and errors"
        className="input-field"
        type="search"
      />
      {deferredQuery && (
        <div className="absolute z-20 mt-2 w-full border border-black/10 bg-white p-4">
          {results.length ? (
            <ul className="space-y-3">
              {results.map((page) => (
                <li key={page.slug}>
                  <Link href={`/wiki/${page.slug}`} className="block text-sm text-black hover:opacity-80">
                    <span className="font-medium">{page.title}</span>
                    <span className="mt-1 block text-black/70">{page.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-black/70">No documentation matches this search.</p>
          )}
        </div>
      )}
    </div>
  );
}