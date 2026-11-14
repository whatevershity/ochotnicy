import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { sql } from "@/lib/db";

export type AktualnoscKind =
  | "aktualnosc"
  | "artykul"
  | "historia"
  | "recenzja";

export type GalleryItem = {
  src: string;
  caption?: string;
};

export type Aktualnosc = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  image: string; // ścieżka w /public lub /api/media/...
  /** Prawdziwy podpis pod zdjęciem hero (archiwum), jeśli znany */
  caption?: string;
  /** Dodatkowe zdjęcia galerii (po hero / treści) */
  gallery?: GalleryItem[];
  source?: string;
  kind: AktualnoscKind;
  listOnly: boolean;
  body: string;
  /** wpis z formularza /admin (baza), nie z Markdowna */
  fromDb?: boolean;
};

/** Wpisy w tabie „Artykuły” (artykuł / historia / recenzja). */
export function isArtykulyKind(kind: AktualnoscKind): boolean {
  return kind === "artykul" || kind === "historia" || kind === "recenzja";
}

export function labelForKind(kind: AktualnoscKind): string {
  switch (kind) {
    case "artykul":
      return "Artykuł";
    case "historia":
      return "Historia";
    case "recenzja":
      return "Recenzja";
    default:
      return "Aktualność";
  }
}

/** Przybliżony czas czytania (PL ≈ 180 słów/min). */
export function readingTimeMinutes(text: string): number {
  const words = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

/**
 * Lead pod tytułem: naturalna długość (ok. 1–3 zdania).
 * Nie ucinamy na siłę — tylko gdy excerpt jest wyraźnie za długi.
 */
export function compactLead(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 280) return clean;

  const window = clean.slice(0, 320);
  const ends = [...window.matchAll(/[.!?…](?=\s|$)/g)];
  const last = ends.at(-1);
  if (last && last.index != null && last.index >= 120) {
    return window.slice(0, last.index + 1).trim();
  }
  const space = window.lastIndexOf(" ");
  return `${(space > 120 ? window.slice(0, space) : window).trim()}…`;
}

/**
 * Link karty: pełny wpis albo zewnętrzne `source` / link z treści (listOnly).
 */
export function hrefForAktualnoscCard(
  post: Pick<Aktualnosc, "slug" | "body" | "source" | "listOnly">,
): { href: string; external: boolean } {
  if (!post.listOnly) {
    return { href: `/aktualnosci/${post.slug}`, external: false };
  }

  const fromBody = post.body.match(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/);
  if (fromBody?.[1]) {
    return { href: fromBody[1], external: true };
  }

  const source = (post.source ?? "").trim();
  if (/^https?:\/\//i.test(source)) {
    return { href: source, external: true };
  }

  return { href: `/aktualnosci#${post.slug}`, external: false };
}

/** Domena do CTA zewnętrznego („Dowiedz się więcej → domena”). */
export function hostForExternalHref(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./i, "") || href;
  } catch {
    return href;
  }
}

/** Krótki podpis pod zdjęciem hero — najpierw prawdziwy z treści/frontmatter. */
export function captionForPost(
  post: Pick<Aktualnosc, "title" | "kind" | "caption">,
): string {
  const real = post.caption?.replace(/\s+/g, " ").trim();
  if (real) return real;

  const title = post.title.replace(/[!?.…]+$/u, "").trim();
  switch (post.kind) {
    case "historia":
      return `Sylwetka z archiwum — ${title}`;
    case "recenzja":
      return `Ilustracja do recenzji „${title}”`;
    case "artykul":
      return `Do artykułu „${title}”`;
    default:
      return `Z materiału „${title}”`;
  }
}

/** Pierwszy blok `*podpis*` z treści — podpis archiwalny, nie tytuł artykułu. */
export function extractLeadingImageCaption(body: string): {
  caption: string | null;
  body: string;
} {
  const parts = body.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  if (!parts.length) return { caption: null, body: body.trim() };
  const first = parts[0].trim();
  const m = first.match(/^\*([\s\S]+)\*$/);
  if (!m) return { caption: null, body: body.trim() };
  const caption = m[1].replace(/\n/g, " ").trim();
  if (!caption || caption.length < 12) {
    return { caption: null, body: body.trim() };
  }
  return { caption, body: parts.slice(1).join("\n\n").trim() };
}

function parseKind(raw: unknown): AktualnoscKind {
  const v = String(raw ?? "")
    .normalize("NFC")
    .toLowerCase()
    .trim();
  if (v === "artykul" || v === "artykuł") return "artykul";
  if (v === "historia") return "historia";
  if (v === "recenzja") return "recenzja";
  return "aktualnosc";
}

export type AktualnoscLayout = "image-left" | "image-right" | "image-center";

const CONTENT_DIR = path.join(process.cwd(), "content", "aktualnosci");
export const DEFAULT_IMAGE = "/brand/mural-no-pasaran.jpg";

type DbPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  kind: string;
  list_only: boolean;
  image_url: string | null;
  image_bytes: Buffer | Uint8Array | null;
  image_mime: string | null;
};

type DbPostImage = {
  id: string;
  post_id: string;
  sort_order: number;
  image_url: string | null;
  image_bytes: Buffer | Uint8Array | null;
};

function formatDatePl(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function slugifyTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseGalleryFrontmatter(raw: unknown): GalleryItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items: GalleryItem[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const src = item.trim();
      if (src.startsWith("/")) items.push({ src });
      continue;
    }
    if (item && typeof item === "object") {
      const rec = item as Record<string, unknown>;
      const src = String(rec.src ?? "").trim();
      if (!src.startsWith("/")) continue;
      const caption = rec.caption ? String(rec.caption).trim() : undefined;
      items.push(caption ? { src, caption } : { src });
    }
  }
  return items.length ? items : undefined;
}

function getFileAktualnosci(): Aktualnosc[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const gallery = parseGalleryFrontmatter(data.gallery);
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? "1970-01-01"),
      excerpt: String(data.excerpt ?? ""),
      image: String(data.image ?? DEFAULT_IMAGE),
      caption: data.caption ? String(data.caption).trim() : undefined,
      gallery,
      source: data.source ? String(data.source) : undefined,
      kind: parseKind(data.kind),
      listOnly: Boolean(data.listOnly),
      body: content.trim(),
      fromDb: false,
    } satisfies Aktualnosc;
  });
}

async function getDbAktualnosci(): Promise<Aktualnosc[]> {
  // Przy `next build` bez DATABASE_URL nie odpalaj PGlite (Date.now → błąd prerenderu).
  if (
    !process.env.DATABASE_URL?.trim() &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return [];
  }
  try {
    const rows = await sql<DbPost>(
      `select id, slug, title, date, excerpt, body, kind, list_only,
              image_url, image_bytes, image_mime
       from posts`,
    );
    const galleryRows = await sql<DbPostImage>(
      `select id, post_id, sort_order, image_url, image_bytes
       from post_images
       order by sort_order asc, created_at asc`,
    ).catch(() => [] as DbPostImage[]);

    const galleryByPost = new Map<string, GalleryItem[]>();
    for (const img of galleryRows) {
      const src = img.image_bytes
        ? `/api/media/${img.id}`
        : img.image_url || null;
      if (!src) continue;
      const list = galleryByPost.get(img.post_id) ?? [];
      list.push({ src });
      galleryByPost.set(img.post_id, list);
    }

    return rows.map((row) => {
      let image = DEFAULT_IMAGE;
      if (row.image_bytes) image = `/api/media/${row.id}`;
      else if (row.image_url) image = row.image_url;
      const gallery = galleryByPost.get(row.id) ?? [];
      return {
        slug: row.slug,
        title: row.title,
        date: row.date,
        excerpt: row.excerpt,
        image,
        gallery,
        kind: parseKind(row.kind),
        listOnly: Boolean(row.list_only),
        body: row.body,
        fromDb: true,
      } satisfies Aktualnosc;
    });
  } catch {
    return [];
  }
}

function sortByDateDesc(posts: Aktualnosc[]): Aktualnosc[] {
  return posts.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

/** Markdown + wpisy z formularza; przy tym samym slug wygrywa baza. */
export async function getAllAktualnosci(): Promise<Aktualnosc[]> {
  const files = getFileAktualnosci();
  const db = await getDbAktualnosci();
  const bySlug = new Map<string, Aktualnosc>();
  for (const post of files) bySlug.set(post.slug, post);
  for (const post of db) bySlug.set(post.slug, post);
  return sortByDateDesc([...bySlug.values()]);
}

export async function getPagedAktualnosci(): Promise<Aktualnosc[]> {
  return (await getAllAktualnosci()).filter((p) => !p.listOnly);
}

export async function getAktualnosc(slug: string): Promise<Aktualnosc | null> {
  const post = (await getAllAktualnosci()).find((p) => p.slug === slug) ?? null;
  if (post?.listOnly) return null;
  return post;
}

export async function slugExists(slug: string): Promise<boolean> {
  const posts = await getAllAktualnosci();
  return posts.some((p) => p.slug === slug);
}

export function formatAktualnoscDate(iso: string): string {
  return formatDatePl(iso);
}

export function layoutForIndex(index: number): AktualnoscLayout {
  return index % 2 === 0 ? "image-left" : "image-right";
}

/** Najbliższy datą wpis z tej samej kategorii (albo dowolny, jeśli brak). */
export function findRelatedPost(
  current: Pick<Aktualnosc, "slug" | "kind" | "date">,
  all: Aktualnosc[],
): Aktualnosc | null {
  const others = all.filter((p) => p.slug !== current.slug && !p.listOnly);
  if (!others.length) return null;

  const sameKind = others.filter((p) => p.kind === current.kind);
  const pool = sameKind.length ? sameKind : others;
  const currentMs = Date.parse(`${current.date}T12:00:00`);

  return (
    [...pool].sort((a, b) => {
      const da = Math.abs(Date.parse(`${a.date}T12:00:00`) - currentMs);
      const db = Math.abs(Date.parse(`${b.date}T12:00:00`) - currentMs);
      return da - db;
    })[0] ?? null
  );
}

