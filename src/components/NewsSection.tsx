import Image from "next/image";
import Link from "next/link";
import { AktualnosciTabs } from "@/components/AktualnosciTabs";
import { NewsPostCard } from "@/components/NewsPostCard";
import {
  getPagedAktualnosci,
  hostForExternalHref,
  hrefForAktualnoscCard,
  isArtykulyKind,
  type Aktualnosc,
} from "@/lib/aktualnosci";

/** Karty na home w każdej zakładce (desktop: 2 rzędy × 3). */
const HOME_COUNT = 6;

/** Na telefonie: 3 w Aktualnościach. */
const HOME_MOBILE_COUNT = 3;

/** Stały baner artykułu zewnętrznego — w zakładce Artykuły. */
const PINNED_ARTICLE = {
  id: "dabrowszczacy-to-dopiero-poczatek",
  title: "Dąbrowszczacy to dopiero początek",
  excerpt:
    "– Dąbrowszczaków zostaje! – takie było hasło młodych ludzi, którzy mimo zimna zorganizowali akcję na ulicach warszawskiej Pragi. W pobliżu Bazaru Różyckiego zbierali podpisy pod petycją i rozdawali ulotki.",
  image: "/aktualnosci/dabrowszczacy-to-dopiero-poczatek.jpg",
  href: "https://www.tygodnikprzeglad.pl/dabrowszczacy-dopiero-poczatek/",
} as const;

function HomeGrid({
  posts,
  emptyLabel,
  prependPinned = false,
}: {
  posts: Aktualnosc[];
  emptyLabel: string;
  prependPinned?: boolean;
}) {
  if (posts.length === 0 && !prependPinned) {
    return <p className="news__empty">{emptyLabel}</p>;
  }

  return (
    <ul className="news__grid">
      {prependPinned ? (
        <li className="news__card news__card--pinned">
          <article className="news__card-inner">
            <div className="news__thumb">
              <Image
                src={PINNED_ARTICLE.image}
                alt=""
                fill
                className="news__thumb-img"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <p className="news__date news__date--kind">Artykuł</p>
            <h3 className="news__card-title">{PINNED_ARTICLE.title}</h3>
            <p className="news__excerpt">{PINNED_ARTICLE.excerpt}</p>
            <a
              href={PINNED_ARTICLE.href}
              className="news__more-inline news__more-inline--external"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dowiedz się więcej
              <span className="news__more-arrow" aria-hidden>
                →
              </span>
              <span className="news__more-host">
                {hostForExternalHref(PINNED_ARTICLE.href)}
              </span>
            </a>
          </article>
        </li>
      ) : null}

      {posts.map((post) => (
        <NewsPostCard
          key={post.slug}
          post={post}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ))}
    </ul>
  );
}

/** Mobilna lista: tytuł + czytaj dalej | kwadratowe zdjęcie */
function HomeMobileList({
  posts,
  emptyLabel,
  prependPinned = false,
}: {
  posts: Aktualnosc[];
  emptyLabel: string;
  prependPinned?: boolean;
}) {
  if (posts.length === 0 && !prependPinned) {
    return <p className="news__empty">{emptyLabel}</p>;
  }

  return (
    <ul className="news__rows">
      {prependPinned ? (
        <li className="news__row">
          <div className="news__row-copy">
            <h3 className="news__row-title">{PINNED_ARTICLE.title}</h3>
            <a
              href={PINNED_ARTICLE.href}
              className="news__row-more"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dowiedz się więcej → {hostForExternalHref(PINNED_ARTICLE.href)}
            </a>
          </div>
          <div className="news__row-thumb" aria-hidden>
            <Image
              src={PINNED_ARTICLE.image}
              alt=""
              fill
              className="news__row-img"
              sizes="9rem"
            />
          </div>
        </li>
      ) : null}

      {posts.map((post) => {
        const { href, external } = hrefForAktualnoscCard(post);
        const title = external ? (
          post.title
        ) : (
          <Link href={href}>{post.title}</Link>
        );
        const more = external ? (
          <a
            href={href}
            className="news__row-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dowiedz się więcej → {hostForExternalHref(href)}
          </a>
        ) : (
          <Link href={href} className="news__row-more">
            Czytaj dalej
          </Link>
        );
        return (
          <li key={post.slug} className="news__row">
            <div className="news__row-copy">
              <h3 className="news__row-title">{title}</h3>
              {more}
            </div>
            <div className="news__row-thumb" aria-hidden>
              <Image
                src={post.image}
                alt=""
                fill
                className="news__row-img"
                sizes="9rem"
                unoptimized={
                  post.image.startsWith("/api/") ||
                  post.image.startsWith("http")
                }
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Sekcja home — desktop: zakładki; telefon: lista wierszy + Artykuły.
 */
export async function NewsSection() {
  const all = (await getPagedAktualnosci()).filter(
    (p) => p.slug !== "wpis-z-panelu",
  );
  const aktualnosciAll = all.filter((p) => !isArtykulyKind(p.kind));
  const artykulyAll = all.filter((p) => isArtykulyKind(p.kind));

  const aktualnosci = aktualnosciAll.slice(0, HOME_COUNT);
  const artykuly = artykulyAll.slice(0, HOME_COUNT - 1);

  const aktualnosciMobile = aktualnosciAll.slice(0, HOME_MOBILE_COUNT);
  const artykulyMobile: Aktualnosc[] = [];

  return (
    <section
      id="aktualnosci"
      aria-label="Aktualności i artykuły"
      className="news"
    >
      <div className="news__inner">
        <div className="news__desktop">
          <AktualnosciTabs
            panelAktualnosci={
              <HomeGrid
                posts={aktualnosci}
                emptyLabel="Brak aktualności. Dodaj wpis w panelu /admin."
              />
            }
            panelArtykuly={
              <HomeGrid
                posts={artykuly}
                emptyLabel="Brak artykułów."
                prependPinned
              />
            }
          />

          <p className="news__more">
            <Link href="/aktualnosci" className="news__more-link">
              Zobacz wszystkie
            </Link>
          </p>
        </div>

        <div className="news__mobile">
          <section className="news__block" aria-labelledby="news-mobile-akt">
            <header className="home-head">
              <div className="home-head__bar">
                <h2 id="news-mobile-akt" className="home-head__title">
                  Aktualności
                </h2>
              </div>
            </header>
            <HomeMobileList
              posts={aktualnosciMobile}
              emptyLabel="Brak aktualności. Dodaj wpis w panelu /admin."
            />
            <p className="news__more">
              <Link
                href="/aktualnosci#aktualnosci"
                className="ow-btn ow-btn--sweep"
              >
                <span className="ow-btn__label">ZOBACZ WIĘCEJ</span>
              </Link>
            </p>
          </section>

          <section
            className="news__block news__block--artykuly"
            aria-labelledby="news-mobile-art"
          >
            <header className="home-head">
              <div className="home-head__bar">
                <h2 id="news-mobile-art" className="home-head__title">
                  Artykuły
                </h2>
              </div>
            </header>
            <HomeMobileList
              posts={artykulyMobile}
              emptyLabel="Brak artykułów."
              prependPinned
            />
            <p className="news__more">
              <Link
                href="/aktualnosci#artykuly"
                className="ow-btn ow-btn--sweep"
              >
                <span className="ow-btn__label">ZOBACZ WIĘCEJ</span>
              </Link>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
