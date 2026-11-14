import type { ReactNode } from "react";
import { renderInlineMarkdown } from "@/lib/simple-markdown";

export type LongformSection = {
  id: string;
  title: string | null;
  blocks: ReactNode[];
};

function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function inline(text: string): ReactNode[] {
  return renderInlineMarkdown(text);
}

function renderBlock(block: string, key: number): ReactNode | null {
  const trimmed = block.trim();
  if (!trimmed) return null;

  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
    return <hr key={key} className="kampania__rule" />;
  }

  if (/^>\s?/m.test(trimmed) && trimmed.split("\n").every((l) => /^>\s?/.test(l) || !l.trim())) {
    const quoteLines = trimmed
      .split("\n")
      .map((l) => l.replace(/^>\s?/, "").trim())
      .filter(Boolean);
    const isVerse = quoteLines.length > 1 && quoteLines.every((l) => l.length < 90);
    return (
      <blockquote key={key} className="kampania__quote">
        {isVerse ? (
          <p>
            {quoteLines.map((line, i) => (
              <span key={i}>
                {inline(line)}
                {i < quoteLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ) : (
          <p>{inline(quoteLines.join(" "))}</p>
        )}
      </blockquote>
    );
  }

  const lines = trimmed.split("\n");
  const isUl = lines.every((l) => /^[-*]\s+/.test(l.trim()) || !l.trim());
  const isOl = lines.every((l) => /^\d+\.\s+/.test(l.trim()) || !l.trim());

  if (isUl && lines.some((l) => /^[-*]\s+/.test(l.trim()))) {
    return (
      <ul key={key} className="kampania__list">
        {lines
          .map((l) => l.trim())
          .filter((l) => /^[-*]\s+/.test(l))
          .map((l, i) => (
            <li key={i}>{inline(l.replace(/^[-*]\s+/, ""))}</li>
          ))}
      </ul>
    );
  }

  if (isOl && lines.some((l) => /^\d+\.\s+/.test(l.trim()))) {
    return (
      <ol key={key} className="kampania__list kampania__list--ol">
        {lines
          .map((l) => l.trim())
          .filter((l) => /^\d+\.\s+/.test(l))
          .map((l, i) => (
            <li key={i}>{inline(l.replace(/^\d+\.\s+/, ""))}</li>
          ))}
      </ol>
    );
  }

  const h3 = trimmed.match(/^###\s+([\s\S]+)$/);
  if (h3) {
    return (
      <h3 key={key} className="kampania__h3">
        {inline(h3[1].replace(/\n/g, " ").trim())}
      </h3>
    );
  }

  return <p key={key}>{inline(trimmed.replace(/\n/g, " ").trim())}</p>;
}

/**
 * Dzieli treść Markdowna na sekcje po ## — jak bloki na /kampania.
 */
export function parseLongformSections(body: string): LongformSection[] {
  const parts = body.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  const sections: LongformSection[] = [];
  let current: LongformSection = {
    id: "wstep",
    title: null,
    blocks: [],
  };
  let key = 0;
  const usedIds = new Set<string>();

  const pushCurrent = () => {
    if (current.blocks.length || current.title) {
      sections.push(current);
    }
  };

  for (const raw of parts) {
    const block = raw.trim();
    if (!block) continue;

    const h2 = block.match(/^##\s+([\s\S]+)$/);
    if (h2) {
      pushCurrent();
      const title = h2[1].replace(/\n/g, " ").trim();
      let id = slugifyHeading(title) || `sekcja-${sections.length + 1}`;
      if (usedIds.has(id)) id = `${id}-${sections.length + 1}`;
      usedIds.add(id);
      current = { id, title, blocks: [] };
      continue;
    }

    const node = renderBlock(block, key++);
    if (node) current.blocks.push(node);
  }

  pushCurrent();
  return sections;
}
