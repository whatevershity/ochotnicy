import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ow_admin";
const MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 dni

/** Tymczasowo na czas pracy — ustaw `false`, żeby znów wymagać hasła. */
const TEMP_SKIP_ADMIN_PASSWORD = true;

function secret(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

/** Hostowana aplikacja Cursor / Vercel — nigdy nie otwieramy admina „na styk”. */
export function isHostedApp(): boolean {
  return Boolean(
    process.env.CURSOR_APP_ID?.trim() || process.env.VERCEL?.trim(),
  );
}

function sign(value: string): string {
  const key = secret();
  if (!key) {
    // lokalnie: stały klucz tylko do mocka; na hoście secret() musi istnieć
    return createHmac("sha256", "local-dev-only").update(value).digest("hex");
  }
  return createHmac("sha256", key).update(value).digest("hex");
}

export function adminPasswordConfigured(): boolean {
  if (TEMP_SKIP_ADMIN_PASSWORD) return false;
  return secret() !== "";
}

/** Czy panel w ogóle może przyjmować wpisy na tym hoście. */
export function adminWritesAllowed(): boolean {
  if (TEMP_SKIP_ADMIN_PASSWORD) return true;
  if (adminPasswordConfigured()) return true;
  // mock tylko lokalnie (dev bez CURSOR_APP_ID)
  return !isHostedApp();
}

export function checkAdminPassword(password: string): boolean {
  const expected = secret();
  if (!expected) {
    // lokalny mock — na hostowanej apce zawsze false
    return !isHostedApp();
  }
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function makeAdminCookie(identitySub: string): string {
  const safeSub = identitySub.replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 80);
  const payload = `ok.${safeSub}.${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;
  const secure = isHostedApp() ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${MAX_AGE_SEC}${secure}`;
}

export function clearAdminCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}

function parseAdminCookie(
  cookieHeader: string | null,
): { sub: string; payload: string; sig: string } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(COOKIE.length + 1));
  const parts = token.split(".");
  if (parts.length < 4) return null;
  const sig = parts.pop()!;
  const payload = parts.join(".");
  // payload: ok.<sub>.<ts> — sub może zawierać ":"
  const [flag, ...rest] = parts;
  if (flag !== "ok" || rest.length < 2) return null;
  const ts = rest.pop()!;
  const sub = rest.join(".");
  if (!sub || !/^\d+$/.test(ts)) return null;
  return { sub, payload, sig };
}

export function isAdminRequest(
  request: Request,
  identitySub?: string,
): boolean {
  if (TEMP_SKIP_ADMIN_PASSWORD) return true;
  if (!adminWritesAllowed()) return false;

  // lokalny mock bez hasła
  if (!adminPasswordConfigured()) {
    return !isHostedApp();
  }

  const parsed = parseAdminCookie(request.headers.get("cookie"));
  if (!parsed) return false;
  const want = sign(parsed.payload);
  try {
    if (!timingSafeEqual(Buffer.from(parsed.sig), Buffer.from(want))) {
      return false;
    }
  } catch {
    return false;
  }
  if (identitySub && parsed.sub !== identitySub) return false;
  return true;
}

/** Dla Server Components — cookie z next/headers */
export function isAdminCookieHeader(
  cookieHeader: string | null,
  identitySub?: string,
): boolean {
  if (TEMP_SKIP_ADMIN_PASSWORD) return true;
  if (!adminWritesAllowed()) return false;
  if (!adminPasswordConfigured()) return !isHostedApp();
  if (!cookieHeader) return false;
  const fake = new Request("http://local", {
    headers: { cookie: cookieHeader },
  });
  return isAdminRequest(fake, identitySub);
}

/** Prosty limit prób (per klucz) w pamięci procesu. */
const attempts = new Map<string, { n: number; reset: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const row = attempts.get(key);
  if (!row || now > row.reset) {
    attempts.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (row.n >= limit) return false;
  row.n += 1;
  return true;
}
