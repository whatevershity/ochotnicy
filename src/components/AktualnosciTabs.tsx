"use client";

import { useEffect, useState, type ReactNode } from "react";

type TabId = "aktualnosci" | "artykuly";

type AktualnosciTabsProps = {
  panelAktualnosci: ReactNode;
  panelArtykuly: ReactNode;
};

function tabFromHash(): TabId {
  if (typeof window === "undefined") return "aktualnosci";
  const h = window.location.hash.replace(/^#/, "").toLowerCase();
  return h === "artykuly" || h === "artykuły" ? "artykuly" : "aktualnosci";
}

/** Taby w wspólnej belce .home-head (v2) — jak O nas / Historia. */
export function AktualnosciTabs({
  panelAktualnosci,
  panelArtykuly,
}: AktualnosciTabsProps) {
  const [tab, setTab] = useState<TabId>("aktualnosci");

  useEffect(() => {
    setTab(tabFromHash());
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function selectTab(next: TabId) {
    setTab(next);
    const hash = next === "artykuly" ? "#artykuly" : "#aktualnosci";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  return (
    <>
      <header className="home-head news-page__header--tabs">
        <div
          className="home-head__bar news-page__tabs"
          role="tablist"
          aria-label="Rodzaj wpisów"
        >
          <button
            type="button"
            role="tab"
            id="tab-aktualnosci"
            aria-selected={tab === "aktualnosci"}
            aria-controls="panel-aktualnosci"
            tabIndex={tab === "aktualnosci" ? 0 : -1}
            className={`news-page__tab home-head__title${
              tab === "aktualnosci" ? " is-active" : ""
            }`}
            onClick={() => selectTab("aktualnosci")}
          >
            <span className="news-page__tab-label">
              <span className="news-page__tab-word">
                <span className="news-page__tab-mark" aria-hidden />
                Aktualności
              </span>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-artykuly"
            aria-selected={tab === "artykuly"}
            aria-controls="panel-artykuly"
            tabIndex={tab === "artykuly" ? 0 : -1}
            className={`news-page__tab home-head__title${
              tab === "artykuly" ? " is-active" : ""
            }`}
            onClick={() => selectTab("artykuly")}
          >
            <span className="news-page__tab-label">
              <span className="news-page__tab-slash" aria-hidden>
                /
              </span>
              <span className="news-page__tab-word">
                <span className="news-page__tab-mark" aria-hidden />
                Artykuły
              </span>
            </span>
          </button>
        </div>
      </header>

      <div
        role="tabpanel"
        id="panel-aktualnosci"
        aria-labelledby="tab-aktualnosci"
        hidden={tab !== "aktualnosci"}
      >
        {panelAktualnosci}
      </div>
      <div
        role="tabpanel"
        id="panel-artykuly"
        aria-labelledby="tab-artykuly"
        hidden={tab !== "artykuly"}
      >
        {panelArtykuly}
      </div>
    </>
  );
}
