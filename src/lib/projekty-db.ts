import { sql } from "@/lib/db";
import { STATIC_PROJEKTY, type Projekt } from "@/lib/projekty";

type DbProject = {
  id: string;
  title: string;
  teaser: string;
  body: string;
  image_url: string | null;
  image_bytes: Buffer | Uint8Array | null;
};

function paragraphsFromBody(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function getDbProjekty(): Promise<Projekt[]> {
  if (
    !process.env.DATABASE_URL?.trim() &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return [];
  }
  try {
    const rows = await sql<DbProject>(
      `select id, title, teaser, body, image_url, image_bytes
       from projects
       order by created_at desc`,
    );
    return rows.map((row) => {
      let image: string | null = null;
      if (row.image_bytes) image = `/api/media/${row.id}`;
      else if (row.image_url) image = row.image_url;
      return {
        id: row.id,
        title: row.title,
        teaser: row.teaser,
        body: paragraphsFromBody(row.body),
        image,
        imageAlt: row.title,
      } satisfies Projekt;
    });
  } catch {
    return [];
  }
}

/** Stałe projekty + nowe z panelu /admin. Tylko server. */
export async function getAllProjekty(): Promise<Projekt[]> {
  const db = await getDbProjekty();
  const byId = new Map<string, Projekt>();
  for (const p of STATIC_PROJEKTY) byId.set(p.id, p);
  for (const p of db) byId.set(p.id, p);
  return [...byId.values()];
}

export async function getProjektAsync(
  id: string,
): Promise<Projekt | undefined> {
  return (await getAllProjekty()).find((p) => p.id === id);
}
