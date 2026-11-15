import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import {
  bodyWithoutLead,
  captionForPost,
  compactLead,
  extractLeadingImageCaption,
  formatAktualnoscDate,
  isArtykulyKind,
  labelForKind,
  readingTimeMinutes,
  resolvePostLead,
  type Aktualnosc,
} from "@/lib/aktualnosci";
import { parseLongformSections } from "@/lib/longform-markdown";

type Props = { post: Aktualnosc };

export function LongformAktualnosc({ post }: Props) {
  const category = labelForKind(post.kind);
  const lead = compactLead(resolvePostLead(post.excerpt, post.body));

  const pulled = post.caption
    ? { caption: post.caption, body: post.body.trim() }
    : extractLeadingImageCaption(post.body);
  const bodyWork = bodyWithoutLead(pulled.body, lead);

  const minutes = readingTimeMinutes(`${lead}\n${post.body}`);
  const archiveHash = isArtykulyKind(post.kind) ? "#artykuly" : "#aktualnosci";
  const caption = captionForPost({
    ...post,
    caption: pulled.caption ?? post.caption,
  });
  const sections = parseLongformSections(bodyWork);

  return (
    <main className="kampania kampania--article">
      <div className="kampania__inner">
        <header className="kampania__header">
          <p className="news__eyebrow">{category}</p>
          <h1 className="kampania__title">{post.title}</h1>
          <p className="post__meta">
            <time dateTime={post.date}>{formatAktualnoscDate(post.date)}</time>
            <span className="post__meta-sep" aria-hidden>
              ·
            </span>
            <span>{minutes} min czytania</span>
          </p>
          {lead ? <p className="kampania__lead">{lead}</p> : null}
        </header>

        {post.image ? (
          <figure className="kampania__hero-fig">
            <Image
              src={post.image}
              alt={caption}
              width={1200}
              height={750}
              className="kampania__hero-img"
              sizes="(max-width: 960px) 94vw, 928px"
              priority
              unoptimized={
                post.image.startsWith("/api/") || post.image.startsWith("http")
              }
            />
            <figcaption className="kampania__hero-cap">{caption}</figcaption>
          </figure>
        ) : null}

        {sections.map((section) => (
          <section
            key={section.id}
            className="kampania__section"
            {...(section.title
              ? { "aria-labelledby": section.id }
              : { "aria-label": "Wstęp" })}
          >
            {section.title ? (
              <h2 id={section.id} className="kampania__subtitle">
                {section.title}
              </h2>
            ) : null}
            <div className="kampania__prose">{section.blocks}</div>
          </section>
        ))}

        {post.gallery && post.gallery.length > 0 ? (
          <div className="kampania__gallery" aria-label="Galeria">
            {post.gallery.map((item, i) => (
              <figure key={`${item.src}-${i}`} className="kampania__gallery-item">
                <Image
                  src={item.src}
                  alt={item.caption ?? ""}
                  width={900}
                  height={675}
                  className="kampania__gallery-img"
                  sizes="(max-width: 700px) 94vw, 300px"
                  unoptimized={
                    item.src.startsWith("/api/") || item.src.startsWith("http")
                  }
                />
                {item.caption ? (
                  <figcaption className="kampania__gallery-cap">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        <p className="kampania__back">
          <Link
            className="kampania__follow-link kampania__follow-link--ghost"
            href={`/aktualnosci${archiveHash}`}
          >
            {isArtykulyKind(post.kind)
              ? "Wróć do artykułów"
              : "Wróć do aktualności"}
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
