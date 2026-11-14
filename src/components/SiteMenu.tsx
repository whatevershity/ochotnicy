"use client";

import { useEffect, useId, useState } from "react";
import { LangToggle } from "@/components/LangToggle";

const LINKS = [
  {
    href: "/",
    label: "Strona główna",
    tracking: "wide" as const,
  },
  {
    href: "/aktualnosci",
    label: "Aktualności",
    // Krótszy napis — większy tracking, żeby zajął całą szerokość jak Kampania
    tracking: "wide" as const,
  },
  {
    href: "/#projekty",
    label: "Projekty",
    tracking: "wider" as const,
  },
  {
    href: "/kampania",
    label: "Kampania „Łapy precz…”",
    tracking: "normal" as const,
  },
  {
    href: "#kontakt",
    label: "Kontakt",
    tracking: "wider" as const,
  },
] as const;

/**
 * Górne menu — na desktopie pasek, na mobile hamburger.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 821px)");
    const closeOnWide = () => {
      if (mq.matches) setOpen(false);
    };
    closeOnWide();
    mq.addEventListener("change", closeOnWide);
    return () => mq.removeEventListener("change", closeOnWide);
  }, []);

  return (
    <nav
      className={`site-menu${open ? " is-open" : ""}`}
      aria-label="Menu główne"
    >
      <div className="site-menu__bar">
        <div className="site-menu__desktop">
          <div className="site-menu__left">
            {LINKS.slice(0, -1).map((item) =>
              item.href === "/" ? (
                <a
                  key={item.href}
                  className="ow-btn ow-btn--sweep site-menu__home-pill"
                  href={item.href}
                >
                  <span className="ow-btn__label">{item.label}</span>
                </a>
              ) : (
                <a key={item.href} className="site-menu__link" href={item.href}>
                  {item.label}
                </a>
              ),
            )}
          </div>
          <div className="site-menu__right">
            <a className="site-menu__link" href={LINKS[LINKS.length - 1].href}>
              {LINKS[LINKS.length - 1].label}
            </a>
            <LangToggle />
          </div>
        </div>

        <div className="site-menu__mobile-tools">
          <LangToggle />
          <button
            type="button"
            className="ow-btn ow-btn--sweep site-menu__burger"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="ow-btn__label site-menu__burger-icon" aria-hidden>
              <span className="site-menu__burger-line" />
              <span className="site-menu__burger-line" />
              <span className="site-menu__burger-line" />
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="site-menu__scrim"
        aria-label="Zamknij menu"
        tabIndex={open ? 0 : -1}
        hidden={!open}
        onClick={() => setOpen(false)}
      />

      <div id={panelId} className="site-menu__panel" hidden={!open}>
        <ul className="site-menu__panel-list" aria-label="Menu">
          {LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`site-menu__panel-link site-menu__panel-link--${item.tracking}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
