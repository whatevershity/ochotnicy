import Image from "next/image";
import Link from "next/link";
import {
  formatAktualnoscDate,
  hrefForAktualnoscCard,
  isArtykulyKind,
  labelForKind,
  layoutForIndex,
  type Aktualnosc,
} from "@/lib/aktualnosci";
import { firstSentences, hasMoreAfter } from "@/lib/excerpt";

/**
 * Zapisana wersja układu poziomego (lista wierszy ze zdjęciem obok tekstu).
 * Podstrona /aktualnosci używa teraz kart jak na stronie głównej;
 * ten komponent zostaje jako referencja do ewentualnego przywrócenia.
 */
export function AktualnosciListPoziom({ posts }: { posts: Aktualnosc[] }) {
  return (
    <ul className="news-list">
      {posts.map((post, index) => {
        const layout = layoutForIndex(index);
        const showKindLabel = isArtykulyKind(post.kind);
        const kindLabel = labelForKind(post.kind);
        const source = (post.excerpt || post.body).replace(/\s+/g, " ").trim();
        const teaser = firstSentences(source, 2);
        const { href, external } = hrefForAktualnoscCard(post);
        const more =
          hasMoreAfter(source, teaser) ||
          post.body.replace(/\s+/g, " ").trim().length > teaser.length + 24;

        const rowClass = [
          "news-list__row",
          `news-list__row--${layout}`,
          showKindLabel ? "news-list__row--artykul" : "",
          post.listOnly ? "news-list__row--inline" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const media = (
          <div className="news-list__media">
            <div className="news-list__frame">
              <Image
                src={post.image}
                alt=""
                width={900}
                height={675}
                className="news-list__img"
                sizes="(max-width: 768px) 90vw, 280px"
                unoptimized={
                  post.image.startsWith("/api/") ||
                  post.image.startsWith("http")
                }
              />
            </div>
          </div>
        );

        const copy = (
          <div className="news-list__copy">
            <div className="news-list__copy-top">
              <div className="news-list__meta">
                {showKindLabel ? (
                  <span className="news__date news__date--kind">
                    {kindLabel}
                  </span>
                ) : (
                  <time className="news__date" dateTime={post.date}>
                    {formatAktualnoscDate(post.date)}
                  </time>
                )}
              </div>
              <h2 className="news-list__title">{post.title}</h2>
              {post.listOnly ? (
                <div className="news-list__inline-body">
                  {post.body.split(/\n\n+/).map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              ) : teaser ? (
                <p className="news-list__excerpt">{teaser}</p>
              ) : null}
            </div>
            {more ? <span className="news-list__more">czytaj dalej</span> : null}
          </div>
        );

        return (
          <li key={post.slug} id={post.slug} className={rowClass}>
            {external ? (
              <a
                href={href}
                className="news-list__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {media}
                {copy}
              </a>
            ) : (
              <Link href={href} className="news-list__link">
                {media}
                {copy}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
