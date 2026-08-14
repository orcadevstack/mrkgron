import Link from "next/link";
import { Fragment } from "react";

type WikiMarkdownProps = {
  source: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderInline(value: string) {
  const parts = value.split(/(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? <Link key={index} href={href} className="text-[#EE6C4D] underline">{label}</Link> : <a key={index} href={href} className="text-[#EE6C4D] underline">{label}</a>;
    }
    if (part.startsWith("`")) {
      return <code key={index} className="bg-black/[0.03] px-1 py-0.5 text-sm">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**")) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function WikiMarkdown({ source }: WikiMarkdownProps) {
  const lines = source.trim().split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push(<pre key={index} className="overflow-x-auto bg-black/[0.03] p-3 text-sm text-black"><code>{code.join("\n")}</code></pre>);
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const [, marks, text] = heading;
      const id = slugify(text);
      const className = marks.length === 1 ? "text-[32px] font-semibold text-black" : marks.length === 2 ? "mt-8 text-2xl font-semibold text-black" : "mt-6 text-xl font-medium text-black";
      const Tag = (`h${marks.length}` as "h1" | "h2" | "h3");
      blocks.push(<Tag key={id} id={id} className={className}>{renderInline(text)}</Tag>);
      index += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(<ul key={index} className="list-disc space-y-2 pl-6 text-base leading-7 text-black">{items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(<ol key={index} className="list-decimal space-y-2 pl-6 text-base leading-7 text-black">{items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    blocks.push(<p key={index} className="text-base leading-7 text-black">{renderInline(line)}</p>);
    index += 1;
  }

  return <div className="space-y-4">{blocks}</div>;
}