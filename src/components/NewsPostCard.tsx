import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  formatAktualnoscDate,
  hostForExternalHref,
  hrefForAktualnoscCard,
  isArtykulyKind,
  labelForKind,
  type Aktualnosc,
} from "@/lib/aktualnosci";

/**
 * Długość opisu jak na karcie stałego artykułu (Dąbrowszczacy…)
 * — bez ucinania w pół zdania.
 */
export const NEWS_EXCERPT_TARGET =
  "– Dąbrowszczaków zostaje! – takie było hasło młodych ludzi, którzy mimo zimna zorganizowali akcję na ulicach warszawskiej Pragi. W pobliżu Bazaru Różyckiego zbierali podpisy pod petycją i rozdawali ulotki."
    .length;

export function shortenNewsExcerpt(
  text: string,
  target = NEWS_EXCERPT_TARGET,
): string {
  const clean = text.replace(/\s+/g, " ").trim().replace(/(?:\u2026|\.{3})\s*$/u, "");
  if (clean.length <= target + 12) return clean;

  // Tylko pełne zdania — bez urywania w połowie.
  const slice = clean.slice(0, target + 80);
  const sentenceEnds = [...slice.matchAll(/[.!?](?=\s|$)/g)];
  if (sentenceEnds.length > 0) {
    let best = sentenceEnds[0];
    for (const end of sentenceEnds) {
      const at = (end.index ?? 0) + 1;
      if (at <= target + 24) best = end;
      else break;
    }
    const end = (best.index ?? 0) + 1;
    if (end >= Math.floor(target * 0.4)) {
      return slice.slice(0, end).trim();
    }
  }

  // Awaryjnie: pierwsze zdanie z całego tekstu (nawet dłuższe niż target).
  const firstEnd = clean.search(/[.!?](?=\s|$)/);
  if (firstEnd >= 0) return clean.slice(0, firstEnd + 1).trim();
  return clean;
}

type NewsPostCardProps = {
  post: Aktualnosc;
  /** np. szersze karty na archiwum */
  sizes?: string;
  headingLevel?: "h2" | "h3";
};

function CardLink({
  href,
  external,
  className,
  children,
  ...rest
}: {
  href: string;
  external: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">) {
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/**
 * Karta aktualności — ten sam układ co na stronie głównej
 * (zdjęcie, data/etykieta, tytuł, opis, „czytaj dalej” / zewnętrzne CTA).
 */
export function NewsPostCard({
  post,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  headingLevel = "h3",
}: NewsPostCardProps) {
  const showKindLabel = isArtykulyKind(post.kind);
  const kindLabel = labelForKind(post.kind);
  const source = (post.excerpt || post.body).replace(/\s+/g, " ").trim();
  const excerpt = shortenNewsExcerpt(source);
  const { href, external } = hrefForAktualnoscCard(post);
  const TitleTag = headingLevel;
  const host = external ? hostForExternalHref(href) : null;

  const thumb = external ? (
    <div className="news__thumb">
      <Image
        src={post.image}
        alt=""
        fill
        className="news__thumb-img"
        sizes={sizes}
        unoptimized={
          post.image.startsWith("/api/") || post.image.startsWith("http")
        }
      />
    </div>
  ) : (
    <CardLink
      href={href}
      external={false}
      className="news__thumb"
      tabIndex={-1}
      aria-hidden
    >
      <Image
        src={post.image}
        alt=""
        fill
        className="news__thumb-img"
        sizes={sizes}
        unoptimized={
          post.image.startsWith("/api/") || post.image.startsWith("http")
        }
      />
    </CardLink>
  );

  return (
    <li id={post.slug} className="news__card">
      <article className="news__card-inner">
        {thumb}
        {showKindLabel ? (
          <p className="news__date news__date--kind">{kindLabel}</p>
        ) : (
          <time className="news__date" dateTime={post.date}>
            {formatAktualnoscDate(post.date)}
          </time>
        )}
        <TitleTag className="news__card-title">
          {external ? (
            post.title
          ) : (
            <CardLink href={href} external={false}>
              {post.title}
            </CardLink>
          )}
        </TitleTag>
        {excerpt ? <p className="news__excerpt">{excerpt}</p> : null}
        {external && host ? (
          <a
            href={href}
            className="news__more-inline news__more-inline--external"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dowiedz się więcej
            <span className="news__more-arrow" aria-hidden>
              →
            </span>
            <span className="news__more-host">{host}</span>
          </a>
        ) : (
          <CardLink href={href} external={false} className="news__more-inline">
            czytaj dalej
          </CardLink>
        )}
      </article>
    </li>
  );
}
