import { connection } from "next/server";
import { cookies, headers } from "next/headers";
import { getIdentity } from "../../../cursor/identity";
import { AdminPostForm } from "@/components/AdminPostForm";
import {
  adminPasswordConfigured,
  adminWritesAllowed,
  isAdminCookieHeader,
  isAdminOpenAccess,
  isHostedApp,
} from "@/lib/admin-auth";

export const metadata = {
  title: "Dodaj — Ochotnicy Wolności",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminPage() {
  await connection();
  const open = isAdminOpenAccess();

  if (!open) {
    const h = await headers();
    const viewer = await getIdentity(h);

    if (!viewer.verified || viewer.kind !== "person") {
      return (
        <main className="admin-page">
          <div className="admin-page__inner">
            <p className="admin-page__lead">
              Ta strona jest tylko dla osób zalogowanych do aplikacji.
            </p>
          </div>
        </main>
      );
    }

    if (!adminWritesAllowed()) {
      return (
        <main className="admin-page">
          <div className="admin-page__inner">
            <p className="admin-page__lead">
              Panel jest wyłączony: brak skonfigurowanego hasła administratora.
            </p>
          </div>
        </main>
      );
    }
  } else if (!adminWritesAllowed()) {
    return (
      <main className="admin-page">
        <div className="admin-page__inner">
          <p className="admin-page__lead">
            Panel jest wyłączony: brak skonfigurowanego hasła administratora.
          </p>
        </div>
      </main>
    );
  }

  let needsPassword = false;
  if (!open) {
    const h = await headers();
    const viewer = await getIdentity(h);
    const jar = await cookies();
    const cookieHeader = jar
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");
    const sub =
      viewer.verified && viewer.kind === "person" ? viewer.sub : undefined;
    needsPassword =
      (adminPasswordConfigured() || isHostedApp()) &&
      !isAdminCookieHeader(cookieHeader || null, sub);
  }

  return (
    <main className="admin-page">
      <div className="admin-page__inner">
        <AdminPostForm
          defaultDate={new Date().toISOString().slice(0, 10)}
          needsPassword={needsPassword}
        />
      </div>
    </main>
  );
}
