import { randomUUID } from "node:crypto";
import { requireIdentity } from "../../../../cursor/identity";
import {
  isAdminOpenAccess,
  isAdminRequest,
  rateLimit,
} from "@/lib/admin-auth";
import {
  DEFAULT_IMAGE,
  slugExists,
  slugifyTitle,
} from "@/lib/aktualnosci";
import { sql } from "@/lib/db";

const MAX_IMAGE_BYTES = 1_500_000;

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46
  ) {
    return "image/gif";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function POST(request: Request) {
  const open = isAdminOpenAccess();
  let actorSub = "open";

  if (!open) {
    const identity = await requireIdentity(request);
    if (identity instanceof Response) return identity;
    if (identity.kind !== "person") {
      return Response.json({ error: "Niedozwolone." }, { status: 403 });
    }
    // Preview nie zapisuje do wspólnej bazy produkcyjnej.
    if (identity.stage === "preview") {
      return Response.json(
        { error: "Zapis z podglądu jest wyłączony." },
        { status: 403 },
      );
    }
    if (!isAdminRequest(request, identity.sub)) {
      return Response.json(
        { error: "Wymagane hasło administratora." },
        { status: 401 },
      );
    }
    actorSub = identity.sub;
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`post:${actorSub}:${ip}`, 20, 60 * 60 * 1000)) {
    return Response.json(
      { error: "Za dużo wpisów na godzinę. Spróbuj później." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Niepoprawne dane." }, { status: 400 });
  }

  const title = String(form.get("title") ?? "").trim();
  const date = String(form.get("date") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const imageUrlRaw = String(form.get("imageUrl") ?? "").trim();
  const listOnly = form.get("listOnly") === "on" || form.get("listOnly") === "true";
  const kindRaw = String(form.get("kind") ?? "").trim();
  const kind =
    kindRaw === "artykul" || listOnly ? "artykul" : "aktualnosc";

  if (!title) {
    return Response.json({ error: "Podaj tytuł." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: "Data musi być w formacie RRRR-MM-DD." },
      { status: 400 },
    );
  }
  if (!listOnly && !body) {
    return Response.json({ error: "Podaj treść wpisu." }, { status: 400 });
  }

  let slug = slugifyTitle(title);
  if (!slug) slug = `wpis-${date}`;
  if (await slugExists(slug)) {
    slug = `${slug}-${date}`;
  }
  if (await slugExists(slug)) {
    slug = `${slug}-${randomUUID().slice(0, 8)}`;
  }

  let imageUrl: string | null = null;
  let imageBytes: Buffer | null = null;
  let imageMime: string | null = null;

  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: "Zdjęcie jest za duże (max ok. 1,5 MB)." },
        { status: 400 },
      );
    }
    imageBytes = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageMime(imageBytes);
    if (!sniffed) {
      return Response.json(
        { error: "Plik musi być obrazem (JPG, PNG, GIF lub WebP)." },
        { status: 400 },
      );
    }
    imageMime = sniffed;
  } else if (imageUrlRaw) {
    if (!/^https?:\/\//i.test(imageUrlRaw) && !imageUrlRaw.startsWith("/")) {
      return Response.json(
        { error: "Adres zdjęcia musi zaczynać się od http(s) lub /." },
        { status: 400 },
      );
    }
    imageUrl = imageUrlRaw;
  }

  const galleryFiles = form
    .getAll("gallery")
    .filter((f): f is File => f instanceof File && f.size > 0);

  for (const g of galleryFiles) {
    if (g.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: "Zdjęcie w galerii jest za duże (max ok. 1,5 MB)." },
        { status: 400 },
      );
    }
    const buf = Buffer.from(await g.arrayBuffer());
    if (!sniffImageMime(buf)) {
      return Response.json(
        { error: "Galeria: plik musi być obrazem (JPG, PNG, GIF lub WebP)." },
        { status: 400 },
      );
    }
  }

  const id = randomUUID();
  await sql(
    `insert into posts (
       id, slug, title, date, excerpt, body, kind, list_only,
       image_url, image_bytes, image_mime
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      id,
      slug,
      title,
      date,
      excerpt,
      body || excerpt,
      kind,
      listOnly,
      imageUrl,
      imageBytes,
      imageMime,
    ],
  );

  let sort = 0;
  for (const g of galleryFiles) {
    const buf = Buffer.from(await g.arrayBuffer());
    const mime = sniffImageMime(buf)!;
    await sql(
      `insert into post_images (
         id, post_id, sort_order, image_bytes, image_mime
       ) values ($1,$2,$3,$4,$5)`,
      [randomUUID(), id, sort, buf, mime],
    );
    sort += 1;
  }

  const image =
    imageBytes != null
      ? `/api/media/${id}`
      : imageUrl ?? DEFAULT_IMAGE;

  return Response.json(
    {
      ok: true,
      slug,
      href: listOnly ? `/aktualnosci#${slug}` : `/aktualnosci/${slug}`,
      image,
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
