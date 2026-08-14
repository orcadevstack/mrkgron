import { readFileSync } from "node:fs";
import { join } from "node:path";
import { findWikiPage } from "@/content/wiki/registry";

const WIKI_CONTENT_DIRECTORY = join(process.cwd(), "src", "content", "wiki");

export function getWikiArticle(slug: string) {
  const page = findWikiPage(slug);
  if (!page) {
    return null;
  }

  return {
    page,
    source: readFileSync(join(WIKI_CONTENT_DIRECTORY, page.fileName), "utf8"),
  };
}