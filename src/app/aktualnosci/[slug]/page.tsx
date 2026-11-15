import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { LongformAktualnosc } from "@/components/LongformAktualnosc";
import { SiteFooter } from "@/components/SiteFooter";
import {
  bodyWithoutLead,
  captionForPost,
  compactLead,
  formatAktualnoscDate,
  getAktualnosc,
  getPagedAktualnosci,
  isArtykulyKind,
  labelForKind,
  readingTimeMinutes,
  resolvePostLead,
} from "@/lib/aktualnosci";
import { isLongformAktualnosc } from "@/lib/longform-posts";
import { renderSimpleMarkdown } from "@/lib/simple-markdown";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateStaticParams() {
  const posts = await getPagedAktualnosci();
  return posts.filter((p) => !p.fromDb).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  await connection();
  const { slug } = await params;
  const post = await getAktualnosc(slug);
  if (!post) return { title: "Aktualność" };
  return {
    title: `${post.title} — Ochotnicy Wolności`,
    description: post.excerpt,
  };
}

export default async function AktualnoscPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const post = await getAktualnosc(slug);
  if (!post) notFound();

  if (isLongformAktualnosc(slug)) {
    return <LongformAktualnosc post={post} />;
  }

  const category = labelForKind(post.kind);
  const lead = compactLead(resolvePostLead(post.excerpt, post.body));
  const bodySource = bodyWithoutLead(post.body, lead);
  const minutes = readingTimeMinutes(`${lead}\n${post.body}`);
  const archiveHash = isArtykulyKind(post.kind) ? "#artykuly" : "#aktualnosci";
  const hasImage = Boolean(post.image);
  const caption = captionForPost(post);

  return (
    <main className="post-page">
      <article className="post">
        <header className="post__header">
          <p className="post__category">{category}</p>
          <h1 className="post__title">{post.title}</h1>
          <p className="post__meta">
            <time dateTime={post.date}>{formatAktualnoscDate(post.date)}</time>
            <span className="post__meta-sep" aria-hidden>
              ·
            </span>
            <span>{minutes} min czytania</span>
          </p>
        </header>

        {lead ? <p className="post__lead">{lead}</p> : null}

        {hasImage ? (
          <figure className="post__hero">
            <Image
              src={post.image}
              alt={caption}
              width={1200}
              height={750}
              className="post__hero-img"
              sizes="(max-width: 960px) 94vw, 880px"
              priority
              unoptimized={
                post.image.startsWith("/api/") ||
                post.image.startsWith("http")
              }
            />
            <figcaption className="post__hero-cap">{caption}</figcaption>
          </figure>
        ) : null}

        {bodySource ? (
          <div className="post__body">{renderSimpleMarkdown(bodySource)}</div>
        ) : null}

        {post.gallery && post.gallery.length > 0 ? (
          <div className="post__gallery" aria-label="Galeria">
            {post.gallery.map((item, i) => (
              <figure key={`${item.src}-${i}`} className="post__gallery-item">
                <Image
                  src={item.src}
                  alt={item.caption ?? ""}
                  width={900}
                  height={675}
                  className="post__gallery-img"
                  sizes="(max-width: 700px) 94vw, 420px"
                  unoptimized={
                    item.src.startsWith("/api/") || item.src.startsWith("http")
                  }
                />
                {item.caption ? (
                  <figcaption className="post__gallery-cap">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        <p className="post__back">
          <Link className="post__back-link" href={`/aktualnosci${archiveHash}`}>
            {isArtykulyKind(post.kind)
              ? "Wróć do artykułów"
              : "Wróć do aktualności"}
          </Link>
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
