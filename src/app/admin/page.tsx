import { connection } from "next/server";
import { AdminPostForm } from "@/components/AdminPostForm";
import { adminWritesAllowed, isAdminOpenAccess } from "@/lib/admin-auth";

export const metadata = {
  title: "Dodaj — Ochotnicy Wolności",
  robots: { index: false, follow: false },
};

export const instant = false;

/**
 * Na razie panel jest otwarty dla wszystkich (isAdminOpenAccess).
 * Gdy zamkniemy dostęp, wróci wymóg logowania / hasła.
 */
export default async function AdminPage() {
  await connection();

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

  // Otwarty dostęp: bez hasła. (Zamknięty tryb wróci w osobnej zmianie.)
  const needsPassword = !isAdminOpenAccess();

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
