import { sql } from "@/lib/db";

type Row = {
  image_bytes: Buffer | Uint8Array | null;
  image_mime: string | null;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id || id.length > 80) {
    return new Response("Not found", { status: 404 });
  }

  let rows = await sql<Row>(
    `select image_bytes, image_mime from posts where id = $1 limit 1`,
    [id],
  );
  if (!rows[0]?.image_bytes) {
    rows = await sql<Row>(
      `select image_bytes, image_mime from post_images where id = $1 limit 1`,
      [id],
    );
  }
  if (!rows[0]?.image_bytes) {
    rows = await sql<Row>(
      `select image_bytes, image_mime from projects where id = $1 limit 1`,
      [id],
    );
  }
  const row = rows[0];
  if (!row?.image_bytes) {
    return new Response("Not found", { status: 404 });
  }

  const raw = row.image_bytes;
  const bytes = new Uint8Array(
    Buffer.isBuffer(raw) ? raw : Buffer.from(raw),
  );

  return new Response(bytes, {
    headers: {
      "content-type": row.image_mime || "image/jpeg",
      "cache-control": "public, max-age=86400",
    },
  });
}
