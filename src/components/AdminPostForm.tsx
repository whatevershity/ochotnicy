"use client";

import { useRef, useState } from "react";

type EntryKind = "aktualnosc" | "artykul" | "projekt";

const KIND_OPTIONS: { id: EntryKind; label: string }[] = [
  { id: "aktualnosc", label: "Aktualność" },
  { id: "artykul", label: "Artykuł" },
  { id: "projekt", label: "Projekt" },
];

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end) || "tekst";
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  textarea.value = next;
  textarea.focus();
  const cursor = start + before.length + selected.length + after.length;
  textarea.setSelectionRange(cursor, cursor);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/** ISO `YYYY-MM-DD` → `DD/MM/YYYY` */
function isoToPl(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** `DD/MM/YYYY` lub `DD.MM.YYYY` → ISO `YYYY-MM-DD` */
function plToIso(pl: string): string | null {
  const m = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(pl.trim());
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AdminPostForm({
  defaultDate,
  needsPassword,
}: {
  defaultDate: string;
  needsPassword: boolean;
}) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [unlocked, setUnlocked] = useState(!needsPassword);
  const [password, setPassword] = useState("");
  const [kind, setKind] = useState<EntryKind>("aktualnosc");
  const [datePl, setDatePl] = useState(() => isoToPl(defaultDate));
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "ok"; href: string; title: string }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [listOnly, setListOnly] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus({ type: "error", message: json.error || "Złe hasło." });
        return;
      }
      setUnlocked(true);
      setStatus({ type: "idle" });
      setPassword("");
    } catch {
      setStatus({ type: "error", message: "Błąd sieci." });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const isProjekt = kind === "projekt";

    if (!isProjekt) {
      const isoDate = plToIso(datePl);
      if (!isoDate) {
        setStatus({
          type: "error",
          message: "Podaj datę w formacie DD/MM/RRRR.",
        });
        return;
      }
      data.set("date", isoDate);
      data.set("kind", kind);
      if (listOnly) data.set("listOnly", "true");
    } else {
      const excerpt = String(data.get("excerpt") ?? "").trim();
      data.set("teaser", excerpt);
    }

    setStatus({ type: "loading" });
    try {
      const res = await fetch(
        isProjekt ? "/api/projekty" : "/api/aktualnosci",
        { method: "POST", body: data },
      );
      const json = (await res.json()) as {
        error?: string;
        href?: string;
      };
      if (!res.ok) {
        setStatus({
          type: "error",
          message: json.error || "Nie udało się zapisać.",
        });
        return;
      }
      setStatus({
        type: "ok",
        href: json.href || (isProjekt ? "/projekty" : "/aktualnosci"),
        title: String(data.get("title") || "Wpis"),
      });
      form.reset();
      setDatePl(isoToPl(defaultDate));
      setListOnly(false);
    } catch {
      setStatus({
        type: "error",
        message: "Błąd sieci. Spróbuj jeszcze raz.",
      });
    }
  }

  if (!unlocked) {
    return (
      <form className="admin-form" onSubmit={unlock}>
        <label className="admin-form__field">
          <span>Hasło</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="admin-form__submit"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sprawdzam…" : "Odblokuj panel"}
        </button>
        {status.type === "error" ? (
          <p className="admin-form__msg admin-form__msg--error" role="alert">
            {status.message}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="admin-compose">
      <div className="admin-kind">
        <p className="admin-kind__label">Wybierz sekcję</p>
        <div className="admin-kind__options" role="radiogroup" aria-label="Sekcja">
          {KIND_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={kind === opt.id}
              className={`admin-kind__btn${kind === opt.id ? " is-active" : ""}`}
              onClick={() => {
                setKind(opt.id);
                setStatus({ type: "idle" });
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <label className="admin-form__field">
          <span>Tytuł</span>
          <input name="title" type="text" required maxLength={200} />
        </label>

        <label className="admin-form__field">
          <span>Data (dzień/miesiąc/rok)</span>
          <input
            name="dateDisplay"
            type="text"
            inputMode="numeric"
            required={kind !== "projekt"}
            placeholder="DD/MM/RRRR"
            autoComplete="off"
            value={datePl}
            onChange={(ev) => setDatePl(ev.target.value)}
            pattern="\d{1,2}[./]\d{1,2}[./]\d{4}"
            title="Format: DD/MM/RRRR"
          />
        </label>

        <label className="admin-form__field">
          <span>Krótki opis (widoczny na stronie głównej)</span>
          <textarea name="excerpt" rows={2} maxLength={400} />
        </label>

        <div className="admin-form__field">
          <span>Treść</span>
          <div className="admin-toolbar" role="toolbar" aria-label="Formatowanie">
            <button
              type="button"
              className="admin-toolbar__btn"
              onClick={() => {
                const el = bodyRef.current;
                if (el) wrapSelection(el, "**", "**");
              }}
            >
              B
            </button>
            <button
              type="button"
              className="admin-toolbar__btn admin-toolbar__btn--italic"
              onClick={() => {
                const el = bodyRef.current;
                if (el) wrapSelection(el, "*", "*");
              }}
            >
              I
            </button>
            <button
              type="button"
              className="admin-toolbar__btn"
              onClick={() => {
                const el = bodyRef.current;
                if (!el) return;
                const url = window.prompt("Adres linku (https://…)");
                if (!url) return;
                wrapSelection(el, "[", `](${url})`);
              }}
            >
              Link
            </button>
            <button
              type="button"
              className="admin-toolbar__btn"
              onClick={() => {
                const el = bodyRef.current;
                if (!el) return;
                const start = el.selectionStart;
                const value = el.value;
                el.value = `${value.slice(0, start)}\n\n${value.slice(start)}`;
                el.focus();
                el.setSelectionRange(start + 2, start + 2);
              }}
            >
              ¶
            </button>
          </div>
          <textarea
            ref={bodyRef}
            name="body"
            rows={10}
            required={!listOnly || kind === "projekt"}
            placeholder="Treść wpisu…"
          />
        </div>

        <label className="admin-form__field">
          <span>Zdjęcie główne</span>
          <span className="admin-form__file">
            <input
              name="image"
              type="file"
              accept="image/*"
              className="admin-form__file-input"
              onChange={(ev) => {
                const file = ev.target.files?.[0];
                const label = ev.currentTarget.parentElement?.querySelector(
                  ".admin-form__file-label",
                );
                if (label) {
                  label.textContent = file ? file.name : "Wybierz folder";
                }
              }}
            />
            <span className="admin-form__file-label">Wybierz folder</span>
          </span>
        </label>

        <label className="admin-form__field">
          <span>albo URL zdjęcia głównego</span>
          <input name="imageUrl" type="url" placeholder="https://…" inputMode="url" />
        </label>

        {kind !== "projekt" ? (
          <label className="admin-form__field">
            <span>Galeria (opcjonalnie — kilka zdjęć)</span>
            <span className="admin-form__file">
              <input
                name="gallery"
                type="file"
                accept="image/*"
                multiple
                className="admin-form__file-input"
                onChange={(ev) => {
                  const files = ev.target.files;
                  const label = ev.currentTarget.parentElement?.querySelector(
                    ".admin-form__file-label",
                  );
                  if (!label) return;
                  if (!files?.length) {
                    label.textContent = "Wybierz folder";
                    return;
                  }
                  label.textContent =
                    files.length === 1
                      ? files[0].name
                      : `${files.length} zdjęcia`;
                }}
              />
              <span className="admin-form__file-label">Wybierz folder</span>
            </span>
          </label>
        ) : null}

        <label className="admin-form__check">
          <input
            type="checkbox"
            checked={listOnly}
            onChange={(ev) => setListOnly(ev.target.checked)}
          />
          <span>Krótki artykuł — tylko na liście, bez osobnej strony</span>
        </label>

        <button
          type="submit"
          className="admin-form__submit"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Zapisywanie…" : "Opublikuj"}
        </button>

        {status.type === "error" ? (
          <p className="admin-form__msg admin-form__msg--error" role="alert">
            {status.message}
          </p>
        ) : null}
        {status.type === "ok" ? (
          <p className="admin-form__msg admin-form__msg--ok" role="status">
            Gotowe: „{status.title}”.{" "}
            <a href={status.href}>Zobacz na stronie</a>
          </p>
        ) : null}
      </form>
    </div>
  );
}
