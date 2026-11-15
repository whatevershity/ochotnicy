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

const SENTENCE_ABBREV =
  /\b(?:m\.in|ul|al|pl|św|dr|prof|nr|tzw|t\.j|tj|itd|itp|np|r|tys|ok|godz|min|ks|im|red|wyd|ang|niem|hiszp|fr|ros|ukr|cz|pl|es|en)\.$/iu;

/** Dzieli tekst na pełne zdania (bez ucinania w połowie). */
export function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const parts: string[] = [];
  let buf = "";
  for (let i = 0; i < clean.length; i++) {
    buf += clean[i];
    if (!".!?".includes(clean[i]) || i + 1 >= clean.length) continue;
    const rest = clean.slice(i + 1);
    if (!/^\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9„«"(]/.test(rest)) continue;
    const candidate = buf.trim();
    if (SENTENCE_ABBREV.test(candidate) || /\d\.$/.test(candidate)) continue;
    parts.push(candidate);
    buf = "";
    while (i + 1 < clean.length && /\s/.test(clean[i + 1])) i++;
  }
  const tail = buf.trim();
  if (tail) parts.push(tail);
  return parts;
}

/**
 * 1–3 pełne zdania na lead / excerpt.
 * Nigdy nie kończy wielokropkiem w połowie zdania.
 */
export function leadSentences(
  text: string,
  maxSentences = 3,
  maxChars = 320,
): string {
  const sents = splitSentences(text);
  if (!sents.length) return text.replace(/\s+/g, " ").trim();

  const chosen: string[] = [sents[0]];
  for (let i = 1; i < Math.min(maxSentences, sents.length); i++) {
    const trial = [...chosen, sents[i]].join(" ");
    if (chosen.length >= 1 && trial.length > maxChars) break;
    chosen.push(sents[i]);
    if (trial.length >= 140 && chosen.length >= 2) break;
  }
  return chosen.join(" ");
}

/**
 * Lead pod tytułem: naturalna długość (ok. 1–3 zdania).
 * Nigdy nie ucina w połowie zdania.
 */
export function compactLead(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 280) return clean;
  return leadSentences(clean, 3, 320);
}

/** Pierwszy akapit body (jedna linia). */
export function firstBodyParagraph(body: string): string {
  return (
    body
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n{2,}/)[0]
      ?.replace(/\n/g, " ")
      .trim() ?? ""
  );
}

/** Plain text z początku body (do zbudowania leadu). */
function bodyPlainStart(body: string): string {
  const plain = body
    .replace(/\r\n/g, "\n")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .trim();
  const paras = plain
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  return paras.slice(0, 3).join(" ");
}

/**
 * Lead na stronie wpisu: zawsze 1–3 pełne zdania z początku tekstu.
 * Excerpt z listy (często skrócony „…”) nie może ucinać w połowie zdania.
 */
export function resolvePostLead(_excerpt: string, body: string): string {
  return leadSentences(bodyPlainStart(body), 3, 320);
}

/**
 * Usuwa z body lead (1–3 zdania) z początku — reszta idzie dalej bez duplikatu.
 */
export function bodyWithoutLead(body: string, lead: string): string {
  const leadNorm = lead.replace(/\s+/g, " ").trim();
  if (!leadNorm) return body.trim();

  const normalized = body.replace(/\r\n/g, "\n").trim();
  const parts = normalized.split(/\n{2,}/);
  if (!parts.length) return "";

  // Zbierz tekst od początku aż „zjedzony” lead; reszta zostaje.
  let remainingLead = leadNorm;
  const out: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const para = parts[i].replace(/\n/g, " ").trim();
    if (!remainingLead) {
      out.push(parts[i]);
      continue;
    }

    const paraFlat = para.replace(/\s+/g, " ").trim();
    if (paraFlat === remainingLead) {
      remainingLead = "";
      continue;
    }

    if (remainingLead.startsWith(paraFlat)) {
      remainingLead = remainingLead.slice(paraFlat.length).trim();
      continue;
    }

    if (paraFlat.startsWith(remainingLead)) {
      const rest = paraFlat.slice(remainingLead.length).trim();
      remainingLead = "";
      if (rest) out.push(rest);
      continue;
    }

    // Lead = pierwsze zdania w akapicie
    if (paraFlat.startsWith(remainingLead.slice(0, Math.min(40, remainingLead.length)))) {
      const sents = splitSentences(paraFlat);
      const leadSents = splitSentences(remainingLead);
      if (
        leadSents.length &&
        sents.length >= leadSents.length &&
        sents.slice(0, leadSents.length).join(" ") === leadSents.join(" ")
      ) {
        const restSents = sents.slice(leadSents.length);
        remainingLead = "";
        if (restSents.length) out.push(restSents.join(" "));
        continue;
      }
    }

    out.push(parts[i]);
  }

  return out.join("\n\n").trim();
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

/** Domena do CTA zewnętrznego („Dowiedz się więcej: domena” — link tylko na domenę). */
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
    .filter(
      (f) =>
        f.endsWith(".md") &&
        !f.startsWith("_") &&
        f.toLowerCase() !== "readme.md",
    );

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

