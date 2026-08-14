import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiNavigation } from "@/components/wiki/WikiNavigation";
import { WIKI_PAGES } from "@/content/wiki/registry";
import { getWikiArticle } from "@/lib/wiki";

type WikiArticlePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return WIKI_PAGES.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: WikiArticlePageProps): Metadata {
  const article = getWikiArticle(params.slug);
  return article ? { title: `${article.page.title} | Wiki`, description: article.page.description } : {};
}

export default function WikiArticlePage({ params }: WikiArticlePageProps) {
  const article = getWikiArticle(params.slug);
  if (!article) {
    notFound();
  }

  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block"><WikiNavigation /></aside>
        <article className="lg:col-span-9">
          <header className="border-b border-black/10 pb-8">
            <p className="text-sm font-medium text-[#EE6C4D]">{article.page.section}</p>
            <h1 className="mt-4 text-[32px] font-semibold text-black">{article.page.title}</h1>
            <p className="mt-4 text-xl font-medium leading-8 text-black">{article.page.description}</p>
          </header>
          <div className="pt-8"><WikiMarkdown source={article.source} /></div>
        </article>
      </div>
    </section>
  );
}