import { requireIdentity } from "../../../../../cursor/identity";
import {
  checkAdminPassword,
  clearAdminCookie,
  isAdminOpenAccess,
  makeAdminCookie,
  rateLimit,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (isAdminOpenAccess()) {
    return Response.json(
      { ok: true },
      {
        headers: {
          "set-cookie": makeAdminCookie("open"),
          "cache-control": "private, no-store",
        },
      },
    );
  }

  const identity = await requireIdentity(request);
  if (identity instanceof Response) return identity;
  if (identity.kind !== "person") {
    return Response.json({ error: "Niedozwolone." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (!rateLimit(`admin-login:${identity.sub}:${ip}`, 8, 15 * 60 * 1000)) {
    return Response.json(
      { error: "Za dużo prób. Spróbuj za chwilę." },
      { status: 429 },
    );
  }

  let body: { password?: string } = {};
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return Response.json({ error: "Niepoprawne dane." }, { status: 400 });
  }
  if (!checkAdminPassword(String(body.password ?? ""))) {
    return Response.json({ error: "Złe hasło." }, { status: 401 });
  }
  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": makeAdminCookie(identity.sub),
        "cache-control": "private, no-store",
      },
    },
  );
}

export async function DELETE(request: Request) {
  if (!isAdminOpenAccess()) {
    const identity = await requireIdentity(request);
    if (identity instanceof Response) return identity;
  }
  return new Response(null, {
    status: 204,
    headers: { "set-cookie": clearAdminCookie() },
  });
}
