"use client";

import { useEffect, useState } from "react";

type Lang = "pl" | "en";

/**
 * Przełącznik języka w menu — pokazuje tylko drugi język (na PL → EN).
 */
export function LangToggle() {
  const [lang, setLang] = useState<Lang>("pl");

  useEffect(() => {
    const saved = window.localStorage.getItem("ow-lang");
    if (saved === "pl" || saved === "en") setLang(saved);
  }, []);

  const next: Lang = lang === "pl" ? "en" : "pl";
  const label = next.toUpperCase();

  function switchLang() {
    setLang(next);
    window.localStorage.setItem("ow-lang", next);
    document.documentElement.lang = next;
  }

  return (
    <button
      type="button"
      className="ow-btn ow-btn--sweep lang-toggle"
      aria-label={lang === "pl" ? "Switch to English" : "Przełącz na polski"}
      onClick={switchLang}
    >
      <span className="ow-btn__label">{label}</span>
    </button>
  );
}
