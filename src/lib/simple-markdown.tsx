import type { ReactNode } from "react";

/**
 * Lekki renderer Markdowna do wpisów:
 * akapity, **bold**, *italic*, [link](url), ## / ###, listy, cytaty (>).
 */
export function renderSimpleMarkdown(text: string): ReactNode[] {
  const blocks = text.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  const nodes: ReactNode[] = [];
  let key = 0;

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    const heading = block.match(/^(#{2,3})\s+([\s\S]+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2].replace(/\n/g, " ").trim());
      if (level === 2) {
        nodes.push(
          <h2 key={key++} className="post__h2">
            {content}
          </h2>,
        );
      } else {
        nodes.push(
          <h3 key={key++} className="post__h3">
            {content}
          </h3>,
        );
      }
      continue;
    }

    if (/^>\s?/m.test(block) && block.split("\n").every((l) => /^>\s?/.test(l) || !l.trim())) {
      const quote = block
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join(" ")
        .trim();
      nodes.push(
        <blockquote key={key++} className="post__callout">
          <p>{inline(quote)}</p>
        </blockquote>,
      );
      continue;
    }

    const lines = block.split("\n");
    const isUl = lines.every((l) => /^[-*]\s+/.test(l.trim()) || !l.trim());
    const isOl = lines.every((l) => /^\d+\.\s+/.test(l.trim()) || !l.trim());

    if (isUl && lines.some((l) => /^[-*]\s+/.test(l.trim()))) {
      nodes.push(
        <ul key={key++} className="post__list">
          {lines
            .map((l) => l.trim())
            .filter((l) => /^[-*]\s+/.test(l))
            .map((l, i) => (
              <li key={i}>{inline(l.replace(/^[-*]\s+/, ""))}</li>
            ))}
        </ul>,
      );
      continue;
    }

    if (isOl && lines.some((l) => /^\d+\.\s+/.test(l.trim()))) {
      nodes.push(
        <ol key={key++} className="post__list post__list--ol">
          {lines
            .map((l) => l.trim())
            .filter((l) => /^\d+\.\s+/.test(l))
            .map((l, i) => (
              <li key={i}>{inline(l.replace(/^\d+\.\s+/, ""))}</li>
            ))}
        </ol>,
      );
      continue;
    }

    nodes.push(
      <p key={key++}>{inline(block.replace(/\n/g, " ").trim())}</p>,
    );
  }

  return nodes;
}

/** Inline: **bold**, *italic*, [link](url) — do pojedynczych akapitów. */
export function renderInlineMarkdown(text: string): ReactNode[] {
  return inline(text);
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2];
        const safe =
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("/");
        nodes.push(
          safe ? (
            <a
              key={key++}
              href={href}
              {...(href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link[1]}
            </a>
          ) : (
            link[1]
          ),
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
